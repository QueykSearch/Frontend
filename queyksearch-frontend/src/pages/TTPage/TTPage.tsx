import React from "react";
import TTList from "../../components/TT/TTList";
import TTForm from "../../components/TT/TTForm";
import { Routes, Route } from "react-router-dom";

const TTPage: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Trabajos de Titulación</h1>
      <Routes>
        <Route path="/" element={<TTList />} />
        <Route path="/create" element={<TTForm />} />
        <Route path="/edit/:ttId" element={<TTForm />} />
      </Routes>
    </div>
  );
};

export default TTPage;
