import React from "react";
import TTList from "../components/TT/TTList";
import TTForm from "../components/TT/TTForm";
import { Routes, Route } from "react-router-dom";
import TTApprovalList from "../components/TT/TTApprovalList";
import TTDetail from "../components/TT/TTDetail";

// Importa el CSS
import "./TTPage.css";

const TTPage: React.FC = () => {
  return (
    <div className="ttpage-container">
      <h1 className="ttpage-title">Gestión de Trabajos de Titulación</h1>

      <Routes>
        <Route path="/" element={<TTList />} />
        <Route path="/create" element={<TTForm />} />
        <Route path="/edit/:ttId" element={<TTForm />} />
        <Route path="/approval" element={<TTApprovalList />} />
        <Route path="/view/:ttId" element={<TTDetail />} />
      </Routes>
    </div>
  );
};

export default TTPage;
