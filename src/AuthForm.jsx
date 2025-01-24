import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://127.0.0.1:8000/auth/login/"
      : "http://127.0.0.1:8000/auth/register/";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(
          isLogin
            ? `Welcome back, ${data.username}!`
            : "User registered successfully! You can now log in."
        );
        if (!isLogin) setIsLogin(true);
        localStorage.setItem("username", data.username);
        navigate("/chat");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Form Section */}
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>{isLogin ? "Welcome Back!" : "Join the Chat"}</h1>
        <p style={styles.subheading}>
          {isLogin
            ? "Log in to connect with your friends."
            : "Sign up to start chatting today!"}
        </p>
        <form onSubmit={handleAuth} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>

      {/* Right Image Section */}
      <div style={styles.imageContainer}>
        <img
          src="/aug_8_01.jpg"
          alt="Chat illustration"
          style={styles.image}
        />
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    flex: 1,
    padding: "50px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    padding: "12px",
    margin: "10px 0",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    backgroundColor: "#007bff",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  switchText: {
    marginTop: "15px",
    color: "#666",
    textAlign: "center",
  },
  switchButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    marginLeft: "5px",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
  },
  image: {
    width: "80%",
    height: "auto",
    objectFit: "contain",
  },
};

export default AuthForm;
