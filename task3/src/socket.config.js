import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket", "polling"], // Allow fallback to polling
  };

  // Use relative path when deployed, fallback to localhost for development
  const backendUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";

  return io(backendUrl, options);
};
