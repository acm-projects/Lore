import { io } from 'socket.io-client';

export const socket = io('https://ready-feet-greet.loca.lt', {
  transports: ['websocket', 'polling'], // Ensure WebSocket connection
  reconnectionAttempts: 5, // Retry if disconnected
  reconnectionDelay: 2000, // Wait before retrying
});
