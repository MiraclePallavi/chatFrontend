import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [recipient, setRecipient] = useState(""); 
  const [users, setUsers] = useState([]); 
  const navigate = useNavigate();

  // Redirect to login if no username is found in localStorage
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      // Redirect to login page if the user is not logged in
      navigate("/login");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  // Fetch the list of users (No authentication required now)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Establish WebSocket connection for private chat
  useEffect(() => {
    if (username && recipient) {
      const ws = new WebSocket(
        `ws://127.0.0.1:8000/?username=${username}&recipient=${recipient}`
      );
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection established for private chat");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message && data.username) {
          setMessages((prev) => [...prev, data]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed for private chat");
      };

      return () => {
        ws.close();
      };
    }
  }, [username, recipient]);

  // Send message via WebSocket
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(
        JSON.stringify({
          message,
          username,
          recipient,
        })
      );
      setMessage(""); // Clear input field
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Private Chat</h1>
        {username && <p style={styles.subtitle}>Welcome, {username}!</p>}
      </div>

      {/* Recipient Selection */}
      <div style={styles.recipientArea}>
        <label htmlFor="recipient" style={styles.label}>
          Select Recipient:
        </label>
        <select
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Choose a recipient --</option>
          {users
            .filter((user) => user.username !== username) 
            .map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
        </select>
      </div>

    
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
          disabled={!recipient}
        />
        <button
          onClick={sendMessage}
          style={styles.sendButton}
          disabled={!recipient || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width:"50vw",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555",
  },
  recipientArea: {
    padding: "10px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
  },
  chatArea: {
    height: "300px",
    overflowY: "scroll",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  messageBubble: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    maxWidth: "70%",
  },
  sentMessage: {
    backgroundColor: "#D3F8E2",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#F0F0F0",
    alignSelf: "flex-start",
  },
  messageSender: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  messageText: {
    fontSize: "1rem",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    width: "80%",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
  },
  sendButton: {
    padding: "10px 15px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PrivateChat;
