import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./AuthForm";
import GroupChat from "./GroupChat";
import PrivateChat from "./PrivateChat";
import ChatSelection from "./ChatSelection";
const App = () => {
  return (
    <Router>
       <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/chat-selection" element={<ChatSelection />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="/private-chat" element={<PrivateChat />} />
      </Routes>
    </Router>
  );
};

export default App;
