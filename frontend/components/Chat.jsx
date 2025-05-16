import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatComponent = ({ userId, receiverId, senderRole }) => {
  userId = 1
  receiverId = 2
  senderRole = "jobseeker"

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("registerUser", { userId });

    socket.on("receiveMessage", (msg) => {
      if ((msg.senderId === userId && msg.receiverId === receiverId) || 
          (msg.senderId === receiverId && msg.receiverId === userId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { senderId: userId, receiverId, message, senderRole });
      setMessages((prev) => [...prev, { senderId: userId, message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.senderId === userId ? "blue" : "green" }}>
            {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
