import express from 'express';
import { createServer } from 'http'; // Use named import for 'http'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { dbConnect } from './src/app/utils/dbConnect';
import Message from './src/app/models/Message';
import dotenv from 'dotenv'

const app = express();
dotenv.config();
app.use(express.json())
app.get('/', (req,res)=> {
  console.log("New get request from", req.url)
  res.json("Hi socket")
})


app.get('/developer', (req,res)=> {
  res.json("Obaid ur rehman")
})

const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "https://chat-me-ylat.vercel.app", 
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_connected', (userId: string) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });

  socket.on('private_message', async ({ to, content, senderId }) => {
    console.log("In the private message event senderid", senderId);
    const targetSocketId = userSocketMap.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('private_message', {to, content, senderId});
    }
  
    try {
      await dbConnect();
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
