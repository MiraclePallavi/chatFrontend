import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Redirect to login if no username is found
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      navigate("/");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  // Set up WebSocket connection
  useEffect(() => {
    if (username) {
      const ws = new WebSocket(`ws://127.0.0.1:8000/?username=${username}`);
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message && data.username) {
          setMessages((prev) => [...prev, data]); // Add only server-broadcasted messages
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
      };
    }
  }, [username]);

  // Send message through WebSocket
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ message, username })); // Send only; server will handle broadcasting
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Chat Room</h1>
        {username && <p style={styles.subtitle}>Welcome, {username}!</p>}
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageBubble,
              ...(msg.username === username
                ? styles.sentMessage
                : styles.receivedMessage),
            }}
          >
            <span style={styles.messageSender}>
              {msg.username === username ? "You" : msg.username}:
            </span>
            <span style={styles.messageText}>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    minWidth:"50vw",
  },
  header: {
    padding: "15px",
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  subtitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "300",
  },
  chatArea: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#e9ecef",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "15px",
    fontSize: "1rem",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "15px 15px 0 15px",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    color: "#333",
    borderRadius: "15px 15px 15px 0",
  },
  messageSender: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  messageText: {
    display: "block",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#fff",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
  },
  sendButton: {
    padding: "10px 15px",
    marginLeft: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Chat;
