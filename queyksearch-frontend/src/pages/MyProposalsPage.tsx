import React, { useEffect, useState } from "react";
import api from "../api/api";
import { TT } from "../types/TT";
import { useAuth } from "../context/AuthContext";
import "./MyProposalsPage.css"; // Importa el CSS

const MyProposalsPage: React.FC = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<TT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProposals = async () => {
      try {
        const res = await api.get("/tts", {
          params: { createdBy: user._id },
        });
        setProposals(res.data.data.data);
      } catch (error) {
        console.error("Error al obtener mis propuestas:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user._id) {
      fetchMyProposals();
    }
  }, [user._id]);

  if (loading) {
    return <div className="myproposals-loading">Cargando...</div>;
  }

  return (
    <div className="myproposals-container">
      <h1 className="myproposals-title">Mis Propuestas</h1>
      {proposals.map((tt) => (
        <div className="myproposals-item" key={tt._id}>
          <h3 className="myproposals-item-title">{tt.titulo}</h3>
          <p className="myproposals-item-status">
            <span className="myproposals-item-label">Status:</span> {tt.status}
          </p>
          <p className="myproposals-item-resumen">
            <span className="myproposals-item-label">Resumen:</span> {tt.resumen}
          </p>
          {/* Agrega más campos si deseas */}
        </div>
      ))}
    </div>
  );
};

export default MyProposalsPage;
