import React, { useEffect, useState } from "react";
import { TT } from "../../types/TT";
import { useParams } from "react-router-dom";
import api from "../../api/api";

const TTDetail: React.FC = () => {
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
      } catch (err: any) {
        setError("Error al obtener el TT");
      } finally {
        setLoading(false);
      }
    };

    if (ttId) {
      fetchTTDetail();
    }
  }, [ttId]);

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

  if (loading) return <div>Cargando TT...</div>;
  if (error) return <div>{error}</div>;
  if (!tt) return <div>No se encontró el TT</div>;

  return (
    <div>
      <h2>{tt.titulo}</h2>
      <p>
        <strong>Autores:</strong>{" "}
        {tt.autores.map((a) => a.nombreCompleto).join(", ")}
      </p>
      <p>
        <strong>Palabras Clave:</strong> {tt.palabrasClave.join(", ")}
      </p>
      <p>
        <strong>Unidad Académica:</strong> {tt.unidadAcademica}
      </p>
      <p>
        <strong>Directores:</strong>{" "}
        {tt.directores.map((d) => d.nombreCompleto).join(", ")}
      </p>
      <p>
        <strong>Grado:</strong> {tt.grado}
      </p>
      <p>
        <strong>Resumen:</strong> {tt.resumen}
      </p>
      <p>
        <strong>Status:</strong> {tt.status}
      </p>
      {tt.documentoUrl && (
        <p>
          <a href={tt.documentoUrl} target="_blank" rel="noopener noreferrer">
            Descargar Documento
          </a>
        </p>
      )}

      <h3>Trabajos Similares</h3>
      {loadingSimilar ? (
        <p>Cargando trabajos similares...</p>
      ) : similarTTs.length > 1 ? (
        <ul>
          {similarTTs.slice(1).map((similarTT) => (
            <li key={similarTT._id}>
              <a href={`/tts/view/${similarTT._id}`}>{similarTT.titulo}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron trabajos similares.</p>
      )}
    </div>
  );
};

export default TTDetail;
