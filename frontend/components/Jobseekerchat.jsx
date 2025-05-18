import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const JobSeekerChat = ({ userId }) => {
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId) {
      socket.emit("registerUser", { userId, role: "jobseeker" });
    }
  
    socket.on("updateUsers", ({ recruiters }) => {
      setRecruiters(recruiters);
    });
  
    return () => {
      socket.off("updateUsers");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (selectedRecruiter) {
      socket.emit("fetchMessages", { userId, otherUserId: selectedRecruiter });
      socket.on("loadMessages", (msgs) => setMessages(msgs));
    }

    return () => socket.off("loadMessages");
  }, [selectedRecruiter]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === selectedRecruiter || msg.receiverId === selectedRecruiter) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedRecruiter]);

  const sendMessage = () => {
    if (message.trim() && selectedRecruiter) {
      socket.emit("sendMessage", { senderId: userId, receiverId: selectedRecruiter, message });
      setMessages((prev) => [...prev, { senderId: userId, message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Job Seeker Chat</h2>
      <h3>Recruiters:</h3>
      {recruiters.length > 0 ? (
        recruiters.map((rec) => (
          <button key={rec} onClick={() => setSelectedRecruiter(rec)}>
            {rec}
          </button>
        ))
      ) : (
        <p>No recruiters available</p>
      )}

      {selectedRecruiter && (
        <div>
          <h3>Chat with {selectedRecruiter}</h3>
          <div>
            {messages.map((msg, index) => (
              <p key={index} style={{ color: msg.senderId === userId ? "blue" : "green" }}>
                {msg.message}
              </p>
            ))}
          </div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default JobSeekerChat;
