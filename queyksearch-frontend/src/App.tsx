// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TTPage from "./pages/TTPage";
import MyProposalsPage from "./pages/MyProposalsPage";
import LoginPage from "./pages/LoginPage"; // futuro
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  const { role } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/tts" />} />
        <Route path="/tts/*" element={<TTPage />} />
        {role !== "visitor" && (
          <Route path="/my-proposals" element={<MyProposalsPage />} />
        )}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
