import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-five-ecru.vercel.app"],
  },
});

// used to store online users
const userSocketMap = {};

// Get receiver's socket ID
export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

// listen for connections
io.on("connection", (socket) => {
  console.log("A user has connected: ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.userId = userId; 
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
