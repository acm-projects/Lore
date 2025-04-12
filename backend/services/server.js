import express from "express";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "form-data";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

dotenv.config(); // load secret keys

// Replace this with your actual Stability API key
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

console.log(ACCESS_KEY);
console.log(SECRET_KEY);

// Create a second DynamoDB client for the Cognito/Stories account
const dynamoForStories = new DynamoDBClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

// Initialize Amazon Bedrock client
const bedrock = new BedrockRuntimeClient();

/**
 * Generates story content based on the provided parameters
 * @param {string} prompt - The creative prompt for story generation
 * @param {string} currentStory - The existing story content (empty for first round)
 * @param {number} roundNumber - The current round number (starts at 1)
 * @param {boolean} isFinal - Whether this is the final round
 * @returns {Promise<string>} The generated story text
 */
async function generateStory(
  prompt,
  currentStory = "",
  roundNumber = 1,
  isFinal = false
) {
  // 🧠 Prompt logic for final round vs normal
  let instruction;
  if (isFinal) {
    instruction =
      `With this story:\n\n${currentStory}\n\n` +
      `write a conclusion in three short, numbered paragraphs following this prompt: ${prompt}. ` +
      "End with a new line and ...";
  } else if (roundNumber === 1) {
    instruction =
      `Provide only three short numbered paragraphs to start the story using this prompt:\n${prompt}\n` +
      "After the three paragraphs, do not include any further explanation or comments. End with a new line and ...";
  } else {
    instruction =
      `Using the following prompt: ${prompt}, generate 3 short numbered paragraphs to continue the following story:\n\n` +
      `${currentStory}\n\n` +
      "Only generate 3 short paragraphs. Do not include anything else after. End with a new line and ...";
  }

  // AI Generation Configuration
  const payload = {
    prompt: instruction,
    temperature: 0.9,
  };

  const body = JSON.stringify(payload);
  const modelId = "meta.llama3-3-70b-instruct-v1:0";

  try {
    const command = new InvokeModelCommand({
      body,
      modelId,
      accept: "application/json",
      contentType: "application/json",
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString());
    return (
      responseBody.generation ||
      responseBody.output ||
      "Error generating response"
    );
  } catch (error) {
    throw new Error(`Error generating story: ${error.message}`);
  }
}

/**
 * Summarizes a complete story into a single paragraph
 * @param {string} fullStory - The complete story text to summarize
 * @returns {Promise<string>} The summarized text
 */
async function summarizeStory(fullStory) {
  if (!fullStory) {
    throw new Error("No story provided for summarization");
  }

  // Instruction for summarization
  const instruction = `Return a one paragraph summary of the story:\n\n${fullStory}\n\n Label the beginning of the paragraph with Summary: `;

  const payload = {
    prompt: instruction,
    temperature: 0.6,
  };

  const body = JSON.stringify(payload);
  const modelId = "meta.llama3-3-70b-instruct-v1:0";

  try {
    const command = new InvokeModelCommand({
      body,
      modelId,
      accept: "application/json",
      contentType: "application/json",
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString());
    return (
      responseBody.generation ||
      responseBody.output ||
      "Error generating summary"
    );
  } catch (error) {
    throw new Error(`Error summarizing story: ${error.message}`);
  }
}

const app = express();
app.use(express.json({ limit: "10mb" })); // or higher if needed

const PORT = 3001; // Local WebSocket server port

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081", "https://lore-8hal.onrender.com", "*"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://lore-8hal.onrender.com",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

const rooms = {}; // Store game room data
// ✅ Function to get ranked results based on prompts won
const getRankings = (room) => {
  if (!rooms[room]) return [];

  return Object.entries(rooms[room].playerWins || {})
    .map(([playerId, wins]) => {
      let player = rooms[room].users.find((user) => user.id === playerId);
      return { id: player?.name || "Unknown", plotPoints: wins };
    })
    .sort((a, b) => b.plotPoints - a.plotPoints); // Sort in descending order
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Generate a Numeric Game Code
  socket.on("create_room", (callback) => {
    const room = Math.floor(100000 + Math.random() * 900000).toString();
    rooms[room] = {
      users: [],
      creator: socket.id,
      gameStarted: false,
      prompts: {},
      votes: {},
      totalVotes: 0,
      winner: null,
      story: "",
      winningPrompts: [],
      storyHistory: [],
      round: 0,
      lastRound: 3,
      maxPlayers: 4,
      continueCount: 0,
      continuePressedBy: new Set(),
      playerWins: {},
      imageAlreadyGenerated: false,
      imgURL: null,
      summary: null,
    };

    console.log(`Room created: ${room}`);
    callback({ success: true, roomCode: room });
  });

  // ✅ Listen for rankings request
  socket.on("request_rankings", (room) => {
    if (!rooms[room]) return;

    const rankings = getRankings(room);
    console.log(`🏆 Sending Rankings for Room ${room}:`, rankings);
    io.to(room).emit("receive_rankings", rankings);
  });

  socket.on("join_room", async ({ room, username, cognitoSub }, callback) => {
    if (!rooms[room]) {
      return callback({ success: false, message: "Lobby does not exist" });
    }
  
    if (rooms[room].users.length >= (rooms[room].maxPlayers || 10)) {
      return callback({ success: false, message: "Max Players Reached" });
    }
  
    socket.join(room);
  
    let avatarUrl = null;
  
    try {
      const command = new ScanCommand({
        TableName: "Players",
        FilterExpression: "CognitoSub = :sub",
        ExpressionAttributeValues: {
          ":sub": { S: cognitoSub },
        },
        ProjectionExpression: "ProfilePicURL",
      });
  
      const result = await dynamoForStories.send(command);
      const player = result.Items?.[0];
      avatarUrl = player?.ProfilePicURL?.S || null;
  
      console.log("✅ Avatar URL fetched from Players:", avatarUrl);
    } catch (err) {
      console.error("❌ Failed to fetch avatar from Players table:", err);
    }
  
    const isAlreadyInRoom = rooms[room].users.some((user) => user.id === socket.id);
    if (!isAlreadyInRoom) {
      rooms[room].users.push({
        id: socket.id,
        name: username,
        avatar: avatarUrl,
        currentScreen: "lobby",
      });
    }
  
    callback({ success: true, creatorId: rooms[room].creator });
    io.to(room).emit("update_users", rooms[room].users);
  });
  
  socket.on("update_room_settings", ({ roomCode, settings }) => {
    if (!rooms[roomCode]) return;

    const { maxPlayers, maxRounds } = settings;
    if (typeof maxPlayers === "number") {
      rooms[roomCode].maxPlayers = maxPlayers;
    }
    if (typeof maxRounds === "number") {
      rooms[roomCode].lastRound = maxRounds;
    }

    console.log(`⚙️ Settings updated for room ${roomCode}:`, settings);
  });

  socket.on("update_screen", ({ room, screen }) => {
    if (!rooms[room]) return;

    const player = rooms[room].users.find((user) => user.id === socket.id);
    if (player) {
      player.currentScreen = screen;
    }

    console.log(`🔄 Player ${socket.id} moved to screen: ${screen}`);

    // Emit updated users list
    io.to(room).emit("update_users", rooms[room].users);
  });

  socket.on("start_game", (room) => {
    if (rooms[room] && rooms[room].creator === socket.id) {
      rooms[room].gameStarted = true;
      io.to(room).emit("game_started"); // Notify all players
      console.log(`Game started in room: ${room}`);
    }
  });

  socket.on("submit_prompt", ({ room, prompt }) => {
    if (!rooms[room]) return;

    const user = rooms[room].users.find((u) => u.id === socket.id);

    rooms[room].prompts[socket.id] = {
      prompt,
      playerId: socket.id,
      name: user?.name || "Unknown",
    };

    console.log(
      `📢 Prompt received from ${
        user?.name || socket.id
      } in ${room}: "${prompt}"`
    );

    if (Object.keys(rooms[room].prompts).length === rooms[room].users.length) {
      console.log(
        `✅ All prompts submitted in room: ${room}. Moving to voting phase.`
      );
      io.to(room).emit("prompts_ready");
    }
  });

  // Request prompts for voting screen
  socket.on("request_prompts", ({ room }) => {
    if (!rooms[room]) return;

    const promptsWithNames = Object.values(rooms[room].prompts).map((entry) => {
      const player = rooms[room].users.find((u) => u.id === entry.playerId);
      return {
        ...entry,
        name: player?.name || entry.playerId,
      };
    });

    io.to(socket.id).emit("receive_prompts", promptsWithNames);
  });

  socket.on("submit_vote", ({ room, votedPrompt }) => {
    if (!rooms[room]) return;

    const promptEntry = Object.values(rooms[room].prompts).find(
      (entry) => entry.prompt === votedPrompt
    );
    if (!promptEntry) return;

    const votedPlayerId = promptEntry.playerId;
    rooms[room].votes[votedPlayerId] =
      (rooms[room].votes[votedPlayerId] || 0) + 1;
    rooms[room].totalVotes++;

    // If all players have voted, proceed to AI
    if (rooms[room].totalVotes === Object.keys(rooms[room].prompts).length) {
      determineWinnerAndStartAI(room);
    } else {
      // If not all have voted, this player waits on waiting screen
      socket.emit("go_to_waiting", { phase: "story" });
    }
  });

  socket.on("force_end_voting", (room) => {
    if (!rooms[room]) return;
    determineWinnerAndStartAI(room);
  });

  async function determineWinnerAndStartAI(room) {
    io.to(room).emit("go_score");
    const roomData = rooms[room];
    if (!roomData) return;
  
    const votes = roomData.votes;
    const prompts = roomData.prompts;
    const users = roomData.users;
  
    let maxVotes = Math.max(...Object.values(votes));
    let tiedPlayers = Object.keys(votes).filter(
      (playerId) => votes[playerId] === maxVotes
    );
    let winnerId =
      tiedPlayers.length > 1
        ? tiedPlayers[Math.floor(Math.random() * tiedPlayers.length)]
        : tiedPlayers[0];
  
    let winningPrompt = prompts[winnerId].prompt;
    let winnerName = users.find((u) => u.id === winnerId)?.name || "Unknown";
  
    roomData.winner = winnerName;
    roomData.winningPrompts.push(winningPrompt);
    roomData.round++;
  
    const isFinalRound = roomData.round >= roomData.lastRound;
  
    // 🧠 Score calculation (based on votes, with bonus for round winner)
    const scoreSummary = users.map((user) => {
      const id = user.id;
      const name = user.name;
      const avatar = user.avatar || null;
  
      const voteCount = votes[id] || 0;
      const isWinner = id === winnerId;
      const pointsEarned = isWinner ? voteCount * 2 : voteCount;
  
      const pastScore = roomData.playerWins[id] || 0;
      const newScore = pastScore + pointsEarned;
  
      // Update the stored score
      roomData.playerWins[id] = newScore;
  
      return {
        id,
        username: name,
        avatar_url: avatar,
        past_score: pastScore,
        score_to_add: pointsEarned,
        new_score: newScore,
        winner: isWinner,
      };
    });
  
    // ✅ Send score breakdown to all players
    io.to(room).emit("score_summary", scoreSummary);
  
    // ✅ Wait 6 seconds before moving to AI gen screen
    setTimeout(async () => {
      io.to(room).emit("go_to_ai_gen", { prompt: winningPrompt });
  
      try {
        const aiResponse = await generateStory(
          winningPrompt,
          roomData.storyHistory.join("\n\n"),
          roomData.round,
          isFinalRound
        );
  
        const numberedParagraphs = aiResponse
          .split("\n")
          .filter((line) => /^\d+\.\s/.test(line))
          .map((line) => line.replace(/^\d+\.\s/, ""))
          .slice(0, 3)
          .join("\n\n");
  
        roomData.story = numberedParagraphs;
        roomData.storyHistory.push(numberedParagraphs);
  
        io.to(room).emit("story_ready", {
          story: numberedParagraphs,
          round: roomData.round,
          lastRound: roomData.lastRound,
          creatorId: roomData.creator,
          playerWins: roomData.playerWins,
          prompt: roomData.winningPrompts,
        });
      } catch (err) {
        console.error("❌ AI error:", err);
        roomData.story = "Error generating story.";
        io.to(room).emit("story_ready", { story: "Error generating story." });
      }
    }, 6000);
  }  

  // Send current continue count when a player enters the story screen
  socket.on("request_continue_count", (room) => {
    if (!rooms[room]) return;
    io.to(socket.id).emit("update_continue_count", {
      count: rooms[room].continueCount || 0,
      total: rooms[room].users.length,
    });
  });
  // Handle "Continue" button press
  socket.on("continue_pressed", (room) => {
    if (!rooms[room]) return;

    // Prevent duplicate presses
    if (rooms[room].continuePressedBy.has(socket.id)) {
      console.log(
        `⚠️ Player ${socket.id} already pressed Continue in room ${room}.`
      );
      return;
    }

    rooms[room].continuePressedBy.add(socket.id);
    rooms[room].continueCount++;

    console.log(
      `📢 Continue Pressed in Room ${room}: ${rooms[room].continueCount}/${rooms[room].users.length}`
    );

    // Emit updated count to all players
    io.to(room).emit("update_continue_count", {
      count: rooms[room].continueCount,
      total: rooms[room].users.length,
    });

    // ✅ Check if all players have pressed continue
    if (rooms[room].continueCount === rooms[room].users.length) {
      console.log(`🔄 Resetting for next round in room: ${room}`);

      // ✅ Reset prompts, votes, and continue counts
      rooms[room].prompts = {};
      rooms[room].votes = {};
      rooms[room].totalVotes = 0;
      rooms[room].continueCount = 0;
      rooms[room].continuePressedBy.clear();

      // Notify all players to move to prompt.tsx
      if (rooms[room].round >= rooms[room].lastRound) {
        console.log(`Going end`);
        io.to(room).emit("go_to_end");
      } else {
        console.log(`Next round`);
        io.to(room).emit("go_to_prompt");
      }
    }
  });

  socket.on("request_story_summary", async ({ room }) => {
    if (!rooms[room]) return;

    // ✅ Return cached image/summary if already generated
    if (rooms[room].imageAlreadyGenerated && rooms[room].imgURL) {
      console.log("🖼 Returning cached image for room", room);
      return io.to(room).emit("receive_story_image", {
        summary: rooms[room].summary || "Previously generated summary",
        image: rooms[room].imgURL,
      });
    }

    rooms[room].imageAlreadyGenerated = true;

    const full_story = rooms[room].storyHistory.join("\n\n");

    try {
      // Step 1: Get summary using our summarizeStory function
      const rawSummary = await summarizeStory(full_story);
      console.log("🧠 Raw AI Summary Response:", rawSummary);

      const summaryMatch = rawSummary.match(/Summary:\s*(.*)/is);
      const cleanSummary = summaryMatch
        ? summaryMatch[1].trim()
        : "No summary found.";
      rooms[room].summary = cleanSummary; // ✅ Save summary for reuse
      console.log("clean summary: ", cleanSummary);
      // Step 2: Generate image using Stable Diffusion
      const prompt = `Create a cartoon book cover for this story: ${cleanSummary}`;
      const form = new FormData();
      form.append("prompt", prompt);
      form.append("output_format", "webp");

      const imageResponse = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        form,
        {
          headers: {
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            ...form.getHeaders(),
            Accept: "image/*",
          },
          responseType: "arraybuffer",
        }
      );

      if (imageResponse.status === 200) {
        const imageBase64 = Buffer.from(imageResponse.data).toString("base64");
        const imageDataUri = `data:image/webp;base64,${imageBase64}`;

        // ✅ Store in global room data
        rooms[room].imgURL = imageDataUri;

        io.to(room).emit("receive_story_image", {
          summary: cleanSummary,
          image: imageDataUri,
        });
      } else {
        throw new Error(`Image generation failed: ${imageResponse.status}`);
      }
    } catch (err) {
      console.error("❌ Summary or image generation failed:", err);
      io.to(room).emit("receive_story_image", {
        summary: "Summary could not be generated.",
        image: null,
      });
    }
  });

  socket.on("request_full_story", (room) => {
    if (!rooms[room]) return;
    const fullStory = rooms[room].storyHistory.join("\n\n");
    io.to(socket.id).emit("receive_full_story", fullStory);
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    const room = Object.keys(rooms).find((room) =>
      rooms[room].users.some((user) => user.id === socket.id)
    );

    if (room) {
      rooms[room].users = rooms[room].users.filter(
        (user) => user.id !== socket.id
      );

      if (rooms[room].users.length === 0) {
        console.log(`🗑 Room ${room} is now empty. Deleting room.`);
        delete rooms[room];
      } else {
        io.to(room).emit("update_users", rooms[room].users);
      }
    }
  });
});

app.post("/save-story", async (req, res) => {
  const { userId, title, winningPrompts, storyHistory } = req.body;

  console.log("📦 Received save-story request:", req.body);

  try {
    const command = new PutItemCommand({
      TableName: "Stories",
      Item: {
        userId: { S: userId },
        storyId: { S: uuidv4() },
        title: { S: title },
        winningPrompts: { L: winningPrompts.flat().map((p) => ({ S: p })) },
        storyHistory: { L: storyHistory.map((p) => ({ S: p })) },
        createdAt: { S: new Date().toISOString() },
      },
    });

    await dynamoForStories.send(command); // ✅ Using the custom credentials here
    res.status(200).json({ message: "Story saved!" });
  } catch (err) {
    console.error("❌ Failed to save story:", err);
    res.status(500).json({ error: "Failed to save story" });
  }
});

app.get("/get-stories", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const command = new QueryCommand({
      TableName: "Stories",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": { S: userId },
      },
    });

    const response = await dynamoForStories.send(command);
    const stories = (response.Items || []).map((item) => {
      const unmarshalled = unmarshall(item);
      return {
        title: unmarshalled.title,
        plotPoints: unmarshalled.winningPrompts.map((prompt, index) => ({
          winningPlotPoint: prompt,
          story: unmarshalled.storyHistory[index] || "",
        })),
      };
    });

    res.json({ stories });
  } catch (err) {
    console.error("❌ Failed to fetch stories:", err);
    res.status(500).json({ error: "Failed to retrieve stories" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running locally on port ${PORT}`);
});
