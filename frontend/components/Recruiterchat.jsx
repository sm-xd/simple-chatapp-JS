import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const RecruiterChat = ({ userId }) => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("registerUser", { userId, role: "recruiter" });

    socket.on("updateUsers", ({ jobSeekers }) => {
      setJobSeekers(jobSeekers);
    });

    return () => {
      socket.off("updateUsers");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (selectedJobSeeker) {
      socket.emit("fetchMessages", { userId, otherUserId: selectedJobSeeker });
      socket.on("loadMessages", (msgs) => setMessages(msgs));
    }

    return () => socket.off("loadMessages");
  }, [selectedJobSeeker]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === selectedJobSeeker || msg.receiverId === selectedJobSeeker) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedJobSeeker]);

  const sendMessage = () => {
    if (message.trim() && selectedJobSeeker) {
      socket.emit("sendMessage", { senderId: userId, receiverId: selectedJobSeeker, message });
      setMessages((prev) => [...prev, { senderId: userId, message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Recruiter Chat</h2>
      <h3>Job Seekers:</h3>
      {jobSeekers.length > 0 ? (
        jobSeekers.map((job) => (
          <button key={job} onClick={() => setSelectedJobSeeker(job)}>
            {job}
          </button>
        ))
      ) : (
        <p>No job seekers available</p>
      )}

      {selectedJobSeeker && (
        <div>
          <h3>Chat with {selectedJobSeeker}</h3>
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

export default RecruiterChat;
