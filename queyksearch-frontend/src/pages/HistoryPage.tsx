import React, { useEffect, useState } from "react";
import api from "../api/api";
import { TT } from "../types/TT";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HistoryPage.css"; // Importa el CSS

const HistoryPage: React.FC = () => {
  const [historyTTIds, setHistoryTTIds] = useState<string[]>([]);
  const [historyTTs, setHistoryTTs] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTTs, setLoadingTTs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user._id) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/users/${user._id}/history`);
        setHistoryTTIds(response.data.data);
      } catch (err: any) {
        setError("Error al obtener el historial");
        console.error("Error en HistoryPage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user._id]);

  useEffect(() => {
    const fetchTTDetails = async () => {
      if (historyTTIds.length === 0) {
        setHistoryTTs([]);
        return;
      }

      setLoadingTTs(true);
      try {
        const response = await api.post("/tts/multiple", {
          ttIds: historyTTIds,
        });
        setHistoryTTs(response.data.data);
      } catch (err: any) {
        setError("Error al obtener detalles de TT's en el historial");
        console.error("Error al obtener detalles de TT's:", err);
      } finally {
        setLoadingTTs(false);
      }
    };

    fetchTTDetails();
  }, [historyTTIds]);

  if (loading) return <div className="history-loading">Cargando historial...</div>;
  if (error) return <div className="history-error">{error}</div>;
  if (historyTTs.length === 0) {
    return <div className="history-empty">No tienes historial de TTs visitados.</div>;
  }

  return (
    <div className="history-container">
      <h2 className="history-title">Historial de TTs Visitados</h2>
      {loadingTTs ? (
        <div className="history-loading">Cargando detalles de TTs...</div>
      ) : (
        <ul className="history-list">
          {historyTTs.map((tt) => (
            <li key={tt._id}>
              <Link to={`/tts/view/${tt._id}`}>{tt.titulo}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
