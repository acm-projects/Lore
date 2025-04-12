import { io } from 'socket.io-client';

export const socket = io('https://b7b0-129-110-242-224.ngrok-free.app', {
  transports: ['websocket', 'polling'], // Ensure WebSocket connection
  reconnectionAttempts: 5, // Retry if disconnected
  reconnectionDelay: 2000, // Wait before retrying
});
