import express from 'express';
import { createServer } from 'http'; // Use named import for 'http'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { dbConnect } from './src/app/utils/dbConnect';
import Message from './src/app/models/Message';
import dotenv from 'dotenv'

const app = express();
dotenv.config();
const server = createServer(app); // Use createServer instead of http.createServer
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// A map to keep track of user IDs and their corresponding socket IDs
const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When a user logs in, you would receive their userId and store it
  socket.on('user_connected', (userId: string) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the map when they disconnect
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });

  // Handle private messages
  socket.on('private_message', async ({ to, content, senderId }) => {
    console.log("In the private message event senderid", senderId);
    const targetSocketId = userSocketMap.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('private_message', {to, content, senderId});
    }
  
    try {
      await dbConnect(); // Ensure the database connection
      const newMessage = new Message({
        senderId,
        receiverId: to,
        content,
        status: 'sent'
      });
  
      const savedMessage = await newMessage.save();
      console.log('Message saved:', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
