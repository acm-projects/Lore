import express from "express";
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

const rooms = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Generate a Numeric Game Code
  socket.on("create_room", (callback) => {
    const room = Math.floor(100000 + Math.random() * 900000).toString();
    rooms[room] = {
      users: [],
      creator: socket.id,
      gameStarted: false
    };
    console.log(`Room created: ${room}`);

    if (typeof callback === "function") {
      callback({ success: true, roomCode: room });
    }
  });

  // Validate & Join an existing room
  socket.on("join_room", ({ room }, callback) => {
    if (!rooms[room]) {
      console.log(`Attempted to join invalid room: ${room}`);
      if (typeof callback === "function") {
        callback({ success: false, message: "Invalid room code" });
      }
      return;
    }

    socket.join(room);
    console.log(`User joined room ${room}`);

    if (typeof callback === "function") {
      callback({ success: true });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running locally on port ${PORT}`);
});
