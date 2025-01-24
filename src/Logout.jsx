import React from "react";

const Logout = ({ setLoggedInUser }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setLoggedInUser(null); // Clear logged-in user
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
