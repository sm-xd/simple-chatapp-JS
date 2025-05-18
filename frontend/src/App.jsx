import React, { useState, useEffect } from "react";
import JobSeekerChat from "../components/JobSeekerChat";
import RecruiterChat from "../components/RecruiterChat";

const App = () => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [previousUsers, setPreviousUsers] = useState([]);

  useEffect(() => {
    // Load previously logged-in users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("chatUsers")) || [];
    setPreviousUsers(storedUsers);
  }, []);

  const handleLogin = () => {
    if (!userId.trim()) return;

    setIsLoggedIn(true);

    // Save user ID if it's new
    if (!previousUsers.includes(userId)) {
      const updatedUsers = [...previousUsers, userId];
      setPreviousUsers(updatedUsers);
      localStorage.setItem("chatUsers", JSON.stringify(updatedUsers));
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem("chatUsers");
          setPreviousUsers([]);
        }}
      >
        Clear History
      </button>
      <h1>Chat Application</h1>

      {!userType ? (
        <div>
          <h3>Select User Type</h3>
          <button onClick={() => setUserType("jobseeker")}>Job Seeker</button>
          <button onClick={() => setUserType("recruiter")}>Recruiter</button>
        </div>
      ) : !isLoggedIn ? (
        <div>
          <h3>Select or Enter User ID</h3>

          {/* Show previous users if available */}
          {previousUsers.length > 0 && (
            <div>
              <p>Previously used accounts:</p>
              {previousUsers.map((user) => (
                <button
                  key={user}
                  onClick={() => {
                    setUserId(user);
                    setIsLoggedIn(true);
                  }}
                >
                  {user}
                </button>
              ))}
            </div>
          )}

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter a unique ID (e.g., user123)"
          />
          <button onClick={handleLogin} disabled={!userId.trim()}>
            Login
          </button>
        </div>
      ) : (
        <>
          <p>
            Logged in as: <strong>{userId}</strong> ({userType})
          </p>
          {userType === "jobseeker" ? (
            <JobSeekerChat userId={userId} />
          ) : (
            <RecruiterChat userId={userId} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
