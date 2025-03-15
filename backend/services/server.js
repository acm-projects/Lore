  
import express from "express";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());

const PORT = 3001; // Local WebSocket server port

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"]
  }
});

const rooms = {}; // Store game room data

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Generate a Numeric Game Code
  socket.on("create_room", (callback) => {
    const existingRoom = Object.keys(rooms).find((room) => rooms[room].creator === socket.id);
  
    if (existingRoom) {
      console.log(`⚠️ Player ${socket.id} already has room ${existingRoom}`);
      return callback({ success: true, roomCode: existingRoom });
    }
  
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
      continueCount: 0,
      continuePressedBy: new Set()
    };
  
    console.log(`Room created: ${room}`);
    callback({ success: true, roomCode: room });
  });

  // Join an existing room
  socket.on("join_room", ({ room }, callback) => {
    if (!rooms[room]) {
      console.log(`Attempted to join invalid room: ${room}`);
      if (typeof callback === "function") {
        callback({ success: false, message: "Invalid room code" });
      }
      return;
    }

    // Ensure the user is not already in the room
    const isAlreadyInRoom = rooms[room].users.some(user => user.id === socket.id);
    if (isAlreadyInRoom) {
      console.log(`⚠️ User ${socket.id} is already in room ${room}.`);
      return;
    }

    socket.join(room);
    rooms[room].users.push({ id: socket.id });

    console.log(`User ${socket.id} joined room ${room}`);
  
    // Send back creatorId to client
    if (typeof callback === "function") {
      callback({ success: true, creatorId: rooms[room].creator });
    }
  
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

    rooms[room].prompts[socket.id] = { prompt, playerId: socket.id };

    console.log(`📢 Prompt received from ${socket.id} in ${room}: "${prompt}"`);

    if (Object.keys(rooms[room].prompts).length === rooms[room].users.length) {
      console.log(`✅ All prompts submitted in room: ${room}. Moving to voting phase.`);
      io.to(room).emit("prompts_ready");
    }
  });

  // Request prompts for voting screen
  socket.on("request_prompts", ({ room }) => {
    if (!rooms[room]) return;
    io.to(socket.id).emit("receive_prompts", Object.values(rooms[room].prompts));
  });

// When all votes are submitted, determine the winner and send prompt to AI
socket.on("submit_vote", async ({ room, votedPrompt }) => {
  if (!rooms[room]) return;

  console.log(`🗳 Vote received for: "${votedPrompt}" in room: ${room}`);

  const promptEntry = Object.values(rooms[room].prompts).find(entry => entry.prompt === votedPrompt);
  if (!promptEntry) {
    console.log("❌ Invalid vote: Prompt not found");
    return;
  }

  const votedPlayerId = promptEntry.playerId;
  rooms[room].votes[votedPlayerId] = (rooms[room].votes[votedPlayerId] || 0) + 1;
  rooms[room].totalVotes++;

  if (rooms[room].totalVotes === Object.keys(rooms[room].prompts).length) {
    console.log("🔍 All votes submitted. Determining winner...");

    let maxVotes = Math.max(...Object.values(rooms[room].votes));
    let tiedPlayers = Object.keys(rooms[room].votes).filter(playerId => rooms[room].votes[playerId] === maxVotes);
    let winnerId = tiedPlayers.length > 1 ? tiedPlayers[Math.floor(Math.random() * tiedPlayers.length)] : tiedPlayers[0];

    let winningPrompt = rooms[room].prompts[winnerId].prompt;
    let winnerName = rooms[room].users.find(user => user.id === winnerId)?.name || "Unknown";

    rooms[room].winner = winnerName;
    rooms[room].winningPrompts.push(winningPrompt);

    console.log(`🏆 Winner of round ${rooms[room].round}: ${winnerName} with prompt: "${winningPrompt}"`);
    console.log(`📡 Sending AI request to expand the story...`);

    try {
        const response = await axios.post("http://127.0.0.1:5000/generate", {
            prompt: winningPrompt,
            current_story: rooms[room].storyHistory.join("\n\n"),
            round: rooms[room].round
        });

        let newStoryPart = response.data.story;

        // ✅ Limit AI response to 3 paragraphs
        let paragraphs = newStoryPart.split("\n\n").slice(0, 4).join("\n\n");

        // ✅ Save only the latest AI response
        rooms[room].story = paragraphs;
        rooms[room].storyHistory.push(paragraphs); // Keep track of full story progression

        console.log("✅ AI Response Received:", paragraphs);
    } catch (error) {
        rooms[room].story = "Error generating story.";
        console.error("❌ AI generation error:", error);
    }

    // ✅ Now increment round BEFORE checking finalRound
    rooms[room].round++;

    console.log(`🚀 Emitting "story_ready" event for room: ${room}, Round: ${rooms[room].round}`);

    io.to(room).emit("story_ready", { 
        prompt: winningPrompt, 
        story: rooms[room].story, 
        finalRound: rooms[room].round >= 5, // ✅ Now this will work correctly
        creatorId: rooms[room].creator,
    });
  }
});


  // Handle "Next" button click (only creator can trigger)
  socket.on("next_to_prompt", (room) => {
    if (!rooms[room] || socket.id !== rooms[room].creator) return;

    console.log(`🔄 Resetting for next round in room: ${room}`);

    // ✅ Reset prompts, votes, and continue counts
    rooms[room].prompts = {};
    rooms[room].votes = {};
    rooms[room].totalVotes = 0;
    rooms[room].continueCount = 0;
    rooms[room].continuePressedBy.clear();

    // Notify all players to move to prompt.tsx
    io.to(room).emit("go_to_prompt");
  }
});

// Send current continue count when a player enters the story screen
socket.on("request_continue_count", (room) => {
  if (!rooms[room]) return;
  io.to(socket.id).emit("update_continue_count", { 
    count: rooms[room].continueCount || 0, 
    total: rooms[room].users.length 
  });

  // Handle "Continue" button press
  socket.on("continue_pressed", (room) => {
    if (!rooms[room]) return;

    // Prevent duplicate presses
    if (rooms[room].continuePressedBy.has(socket.id)) {
      console.log(`⚠️ Player ${socket.id} already pressed Continue in room ${room}.`);
      return;
    }

    rooms[room].continuePressedBy.add(socket.id);
    rooms[room].continueCount++;

    console.log(`📢 Continue Pressed in Room ${room}: ${rooms[room].continueCount}/${rooms[room].users.length}`);

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
      io.to(room).emit("go_to_prompt");
    }
});

  // Send current continue count when a player enters the story screen
  socket.on("request_continue_count", (room) => {
    if (!rooms[room]) return;
    io.to(socket.id).emit("update_continue_count", { 
      count: rooms[room].continueCount || 0, 
      total: rooms[room].users.length 
    });
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    const room = Object.keys(rooms).find((room) =>
      rooms[room].users.some((user) => user.id === socket.id)
    );

    if (room) {
      rooms[room].users = rooms[room].users.filter((user) => user.id !== socket.id);

      if (rooms[room].users.length === 0) {
        console.log(`🗑 Room ${room} is now empty. Deleting room.`);
        delete rooms[room];
      } else {
        io.to(room).emit("update_users", rooms[room].users);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running locally on port ${PORT}`);
});
