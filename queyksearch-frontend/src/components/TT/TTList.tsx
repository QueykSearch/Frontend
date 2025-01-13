// src/components/TT/TTList.tsx
import React, { useEffect, useState } from "react";
import TTSearchBar from "./TTSearchBar";
import api from "../../api/api";
import { TT } from "../../types/TT";
import { Link } from "react-router-dom";
import { TTListResponse } from "../../types/TTListResponse";

// Importa el CSS
import "./TTList.css";
import {useAuth} from "../../context/AuthContext";

const TTList: React.FC = () => {
  const {user} = useAuth();

  const [tts, setTts] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchTTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchTTs = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, ...filters };
      const response = await api.get<TTListResponse>("/tts", { params });
      if (response.data && response.data.data) {
        setTts(response.data.data.data);
        setTotal(response.data.data.total);
      } else {
        setError("Estructura de respuesta no esperada");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchSemanticTTs = async (query: string, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = { query, limit: limit || 8 };
      const response = await api.get("/tts/semantic", { params });
      if (response.data && response.data.data) {
        setTts(response.data.data);
        setTotal(response.data.data.length);
      } else {
        setError("Estructura de respuesta no esperada");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSearch = (
    filters: any,
    isSemantic: boolean,
    semanticQuery?: string
  ) => {
    setPage(1);
    if (isSemantic && semanticQuery) {
      fetchSemanticTTs(semanticQuery, limit);
    } else {
      fetchTTs(filters);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este TT?")) {
      try {
        await api.delete(`/tts/${id}`);
        setTts(tts.filter((tt) => tt._id !== id));
      } catch (err: any) {
        alert("Error al eliminar el TT");
        console.error("Error al eliminar TT:", err);
      }
    }
  };

  const handleDownload = async (ttId: string) => {
    try {
      const res = await api.get(`/tts/${ttId}/download`);
      window.open(res.data.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar el PDF");
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <div className="ttlist-loading">Cargando...</div>;
  if (error) return <div className="ttlist-error">Error: {error}</div>;

  return (
    <div className="ttlist-container">
      <h2 className="ttlist-title">Repositorio de TT</h2>

      {/* Barra de búsqueda */}
      <div className="ttlist-searchbar">
        <TTSearchBar onSearch={handleSearch} />
      </div>

      {/* Selector de límite */}
      <div className="ttlist-limit">
        <label htmlFor="limitSelect">Resultados por página:</label>
        <select id="limitSelect" value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Tabla con resultados */}
      <div className="table-container">
        <table className="ttlist-table">
          <thead>
          <tr>
            <th>Título</th>
            <th>Autores</th>
            <th>Palabras Clave</th>
            <th>Unidad Académica</th>
            <th>Directores</th>
            <th>Grado</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {tts.map((tt) => (
            <tr key={tt._id}>
              <td>
                <Link to={`/tts/view/${tt._id}`}>{tt.titulo}</Link>
              </td>
              <td>{tt.autores.map((a) => a.nombreCompleto).join(", ")}</td>
              <td>{tt.palabrasClave.join(", ")}</td>
              <td>{tt.unidadAcademica}</td>
              <td>{tt.directores.map((d) => d.nombreCompleto).join(", ")}</td>
              <td>{tt.grado}</td>
              <td>
                <div className="ttlist-actions">
                  {user?.roles.includes("gestor") && (
                    <>
                      <Link to={`/tts/edit/${tt._id}`}>Editar</Link>
                      <button onClick={() => handleDelete(tt._id)}>Eliminar</button>
                    </>
                  )}
                  <button onClick={() => handleDownload(tt._id)}>Descargar PDF</button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="ttlist-pagination">
        <button onClick={handlePrevPage} disabled={page <= 1}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page >= totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TTList;
