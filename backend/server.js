import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Schema for storing chat messages
const chatSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// Store connected users: { userId: { socketId, role } }
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user when they join
  socket.on("registerUser", ({ userId, role }) => {
    if (!userId || !role) {
      console.log("Invalid user registration:", { userId, role });
      return;
    }
  
    users[userId] = { socketId: socket.id, role };
    console.log(`User registered: ${userId} (${role}) -> ${socket.id}`);
  
    // Log users to check if they are stored correctly
    console.log("Current active users:", users);
  
    // Send online recruiters to job seekers and vice versa
    broadcastActiveUsers();
  });
  

  // Send a message to a specific user
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    const receiver = users[receiverId];
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", newMessage);
    }
  });

  // Fetch chat history between two users
  socket.on("fetchMessages", async ({ userId, otherUserId }) => {
    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    socket.emit("loadMessages", messages);
  });

  // Fetch contacts: Job Seekers should see recruiters, and recruiters should see job seekers who messaged them
  socket.on("fetchContacts", async ({ userId }) => {
    const userRole = users[userId]?.role;
    let contacts = [];
  
    console.log(`Fetching contacts for ${userId} (${userRole})`);
    console.log("Current users object:", users);
  
    if (userRole === "jobseeker") {
      // Job seekers see only online recruiters
      contacts = Object.keys(users).filter((id) => users[id].role === "recruiter");
    } else if (userRole === "recruiter") {
      // Recruiters see only job seekers who messaged them
      const sentMessages = await Chat.find({ senderId: userId }).distinct("receiverId");
      const receivedMessages = await Chat.find({ receiverId: userId }).distinct("senderId");
      contacts = [...new Set([...sentMessages, ...receivedMessages])];
    }
  
    console.log(`Contacts for ${userId}:`, contacts);
    socket.emit("loadContacts", contacts);
  });
  

  // Remove user from tracking when they disconnect
  socket.on("disconnect", () => {
    const userId = Object.keys(users).find(
      (key) => users[key].socketId === socket.id
    );
    if (userId) {
      delete users[userId];
      console.log(`User disconnected: ${userId}`);
    }

    broadcastActiveUsers();
  });

  // Broadcast active users to all clients
  function broadcastActiveUsers() {
    const jobSeekers = Object.keys(users).filter(
      (id) => users[id].role === "jobseeker"
    );
    const recruiters = Object.keys(users).filter(
      (id) => users[id].role === "recruiter"
    );

    io.emit("updateUsers", { jobSeekers, recruiters });
  }
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
