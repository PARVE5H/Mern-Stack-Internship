import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const app = express();
app.use(cors()); // Enable CORS for all routes
const server = http.createServer(app);
dotenv.config();

const userSocketMap = {};
const roomCodeMap = {}; // Store code for each room

//-----------Deployment----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = dirname(__filename);
if (process.env.NODE_ENV === "production") {
  // Serve static files from the build directory
  app.use(express.static(path.join(__dirname1, "build")));

  // Handle React routing, return all requests to React app
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname1, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}

//-----------Deployment----------------

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

// Configure Socket.IO with CORS and timeout settings
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  upgradeTimeout: 30000,
  transports: ["websocket", "polling"],
});

app.use(express.json());

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle joining a room
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    console.log(`${username} joined the room with id: ${roomId}`);

    //  Send latest code to the user who just joined
    const latestCode = roomCodeMap[roomId];
    if (latestCode) {
      setTimeout(() => {
        io.to(socket.id).emit("sync-code", { code: latestCode });
      }, 200);
    }

    // Notify all clients about the new joiner
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Update roomCodeMap on every code-change
  socket.on("code-change", ({ roomId, code }) => {
    roomCodeMap[roomId] = code;
    socket.in(roomId).emit("code-change", { code });
  });

  // Handle disconnection
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    const username = userSocketMap[socket.id];
    const roomId = rooms.find((room) => room !== socket.id); // Filter out socket ID
    console.log(`${username} disconnected from room ${roomId}`);

    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
});
