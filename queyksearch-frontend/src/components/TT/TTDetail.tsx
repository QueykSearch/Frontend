import React, { useEffect, useState } from "react";
import { TT } from "../../types/TT";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./TTDetail.css"; // Importa el CSS

const TTDetail: React.FC = () => {
  const { user } = useAuth();
  const { ttId } = useParams<{ ttId: string }>();
  const [tt, setTT] = useState<TT | null>(null);
  const [similarTTs, setSimilarTTs] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTTDetail = async () => {
      try {
        const response = await api.get(`/tts/${ttId}`);
        setTT(response.data.data);

        if (user._id) {
          await api.post(`/users/${user._id}/history`, { ttId });
        }
      } catch (err: any) {
        setError("Error al obtener el TT");
      } finally {
        setLoading(false);
      }
    };

    if (ttId) {
      fetchTTDetail();
    }
  }, [ttId, user._id]);

  const handleDownload = async () => {
    const res = await api.get(`/tts/${ttId}/download`);
    window.open(res.data.downloadUrl, "_blank");
  };

  const fetchSimilarTTs = async (query: string) => {
    setLoadingSimilar(true);
    try {
      const response = await api.get("/tts/semantic", { params: { query } });
      setSimilarTTs(response.data.data);
    } catch (err: any) {
      console.error("Error al buscar TTs similares:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  useEffect(() => {
    if (tt) {
      fetchSimilarTTs(tt.resumen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tt]);

  if (loading) return <div className="ttdetail-loading">Cargando TT...</div>;
  if (error) return <div className="ttdetail-error">{error}</div>;
  if (!tt) return <div className="ttdetail-empty">No se encontró el TT</div>;

  return (
    <div className="ttdetail-container">
      <h2 className="ttdetail-title">{tt.titulo}</h2>

      <p className="ttdetail-info">
        <strong>Autores:</strong> {tt.autores.map((a) => a.nombreCompleto).join(", ")}
      </p>
      <p className="ttdetail-info">
        <strong>Palabras Clave:</strong> {tt.palabrasClave.join(", ")}
      </p>
      <p className="ttdetail-info">
        <strong>Unidad Académica:</strong> {tt.unidadAcademica}
      </p>
      <p className="ttdetail-info">
        <strong>Directores:</strong>{" "}
        {tt.directores.map((d) => d.nombreCompleto).join(", ")}
      </p>
      <p className="ttdetail-info">
        <strong>Grado:</strong> {tt.grado}
      </p>
      <p className="ttdetail-info">
        <strong>Resumen:</strong> {tt.resumen}
      </p>
      <p className="ttdetail-info">
        <strong>Status:</strong> {tt.status}
      </p>
      {tt.filename && (
        <p className="ttdetail-info">
          <button
            className="ttdetail-download"
            onClick={handleDownload}
          >
            Descargar documento
          </button>
        </p>
      )}

      <h3 className="ttdetail-subtitle">Trabajos Similares</h3>
      {loadingSimilar ? (
        <p className="ttdetail-info">Cargando trabajos similares...</p>
      ) : similarTTs.length > 1 ? (
        <ul className="ttdetail-similar-list">
          {similarTTs.slice(1).map((similarTT) => (
            <li key={similarTT._id}>
              <a href={`/tts/view/${similarTT._id}`}>{similarTT.titulo}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ttdetail-info">No se encontraron trabajos similares.</p>
      )}
    </div>
  );
};

export default TTDetail;
