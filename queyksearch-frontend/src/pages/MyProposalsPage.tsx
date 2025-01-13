import React, { useEffect, useState } from "react";
import api from "../api/api";
import { TT } from "../types/TT";
import { useAuth } from "../context/AuthContext";

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
        // res.data.data.data => la lista de TT
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

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Mis Propuestas</h1>
      {proposals.map((tt) => (
        <div key={tt._id} style={{ border: "1px solid #ccc", margin: "8px" }}>
          <h3>{tt.titulo}</h3>
          <p>Status: {tt.status}</p>
          <p>Resumen: {tt.resumen}</p>
          {/* Muestra otros datos si quieres */}
        </div>
      ))}
    </div>
  );
};

export default MyProposalsPage;
