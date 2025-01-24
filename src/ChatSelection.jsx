import React from "react";
import { useNavigate } from "react-router-dom";

const ChatSelection = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    fetch("http://127.0.0.1:8000/auth/logout/", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("username");
      navigate("/");
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, {username}!</h1>
      <div style={styles.options}>
        <button
          style={styles.button}
          onClick={() => navigate("/group-chat")}
        >
          Group Chat
        </button>
        <button
          style={styles.button}
          onClick={() => navigate("/private-chat")}
        >
          Private Chat
        </button>
      </div>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  options: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default ChatSelection;
