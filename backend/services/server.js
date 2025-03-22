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
      winningPrompts: [], // Store past winning prompts
      round: 1 // Start from round 1
    };
    console.log(`Room created: ${room}`);

    if (typeof callback === "function") {
      callback({ success: true, roomCode: room });
    }
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
  
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  
    // Ensure the user is not already in the room
    const isAlreadyInRoom = rooms[room].users.some(user => user.id === socket.id);
    if (!isAlreadyInRoom) {
      rooms[room].users.push({ id: socket.id });
    }
  
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
  
    // Ensure the room's prompt structure exists
    rooms[room].prompts = rooms[room].prompts || {};
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

    const promptList = Object.values(rooms[room].prompts);
    io.to(socket.id).emit("receive_prompts", promptList);
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
      let winnerId = Object.keys(rooms[room].votes).reduce((a, b) =>
        rooms[room].votes[a] > rooms[room].votes[b] ? a : b
      );
  
      let winningPrompt = rooms[room].prompts[winnerId].prompt;
      let winnerName = rooms[room].users.find(user => user.id === winnerId)?.name || "Unknown";
  
      rooms[room].winner = winnerName;
      rooms[room].round = (rooms[room].round || 1);
      rooms[room].story = rooms[room].story || "";
  
      console.log(`🏆 Winner of round ${rooms[room].round}: ${winnerName} with prompt: "${winningPrompt}"`);
      console.log(`📡 Sending AI request to expand the story...`);
  
      try {
        const response = await axios.post("http://127.0.0.1:5000/generate", {
          prompt: winningPrompt,
          current_story: rooms[room].story,
          round: rooms[room].round
        });
  
        const newStoryPart = response.data.story;
        rooms[room].story += `\n\n${newStoryPart}`; // Append AI response
  
        console.log("✅ AI Response Received:", newStoryPart);
      } catch (error) {
        rooms[room].story += "\n\nError generating story.";
        console.error("❌ AI generation error:", error);
      }
  
      console.log(`🚀 Emitting "story_ready" event for room: ${room}`);
      io.to(room).emit("story_ready", { 
        prompt: winningPrompt, 
        story: rooms[room].story, 
        finalRound: rooms[room].round >= 5,
        creatorId: rooms[room].creator // ✅ Send creator ID to story.tsx
      });

  
      rooms[room].round++;
    }
  });  
  
  // Handle "Next" button click (only creator can trigger)
  socket.on("next_to_prompt", (room) => {
    if (!rooms[room] || socket.id !== rooms[room].creator) return;
  
    console.log(`🔄 Resetting for next round in room: ${room}`);
  
    // ✅ Reset prompts and votes
    rooms[room].prompts = {};
    rooms[room].votes = {};
    rooms[room].totalVotes = 0;
  
    // Notify all players to move to prompt.tsx
    io.to(room).emit("go_to_prompt");
  });
  
  
  
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running locally on port ${PORT}`);
});
