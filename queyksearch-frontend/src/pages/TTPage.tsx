import React from "react";
import TTList from "../components/TT/TTList";
import TTForm from "../components/TT/TTForm";
import { Routes, Route } from "react-router-dom";

import TTApprovalList from "../components/TT/TTApprovalList"; // Importar el nuevo componente
import TTDetail from "../components/TT/TTDetail";

const TTPage: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Trabajos de Titulación</h1>
      <Routes>
        <Route path="/" element={<TTList />} />
        <Route path="/create" element={<TTForm />} />
        <Route path="/edit/:ttId" element={<TTForm />} />
        <Route path="/edit/:ttId" element={<TTForm />} />
        <Route path="/approval" element={<TTApprovalList />} />{" "}
        {/* Nueva ruta */}
        <Route path="/view/:ttId" element={<TTDetail />} />
      </Routes>
    </div>
  );
};

export default TTPage;
