import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 5000,
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);

  // Emit event to add a story
  socket.emit("add_story", {
    storyID: "abcd",
    story: "Once upon a time...",
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
