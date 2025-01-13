// src/components/TT/TTList.tsx
import React, { useEffect, useState } from "react";
import TTSearchBar from "./TTSearchBar";
import api from "../../api/api";
import { TT } from "../../types/TT";
import { Link } from "react-router-dom";
import { TTListResponse } from "../../types/TTListResponse";

const TTList: React.FC = () => {
  const [tts, setTts] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchTTs();
    // fetchApprovedTTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchApprovedTTs = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        status: "aprobado", // Solo TTs aprobados
        ...filters,
      };
      const response = await api.get<TTListResponse>("/tts", { params });
      if (response.data && response.data.data) {
        setTts(response.data.data.data);
        setTotal(response.data.data.total);
        console.log("Respuesta de la API con aprobados:", response.data);
      } else {
        setError("Estructura de respuesta no esperada");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchTTs = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get<TTListResponse>("/tts", { params });
      if (response.data && response.data.data) {
        setTts(response.data.data.data);
        setTotal(response.data.data.total);
        console.log("Respuesta de la API:", response.data);
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
      const params = {
        query,
        limit: limit || 8,
      };
      const response = await api.get("/tts/semantic", { params });
      if (response.data && response.data.data) {
        setTts(response.data.data); // data es un array
        setTotal(response.data.data.length); // total es la cantidad de resultados
        console.log(
          "Respuesta de la API con búsqueda semántica:",
          response.data
        );
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
    setPage(1); // Reiniciar a la primera página al buscar
    if (isSemantic && semanticQuery) {
      fetchSemanticTTs(semanticQuery, limit);
    } else {
      fetchTTs(filters);
      // fetchApprovedTTs(filters);
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
      // res.data.downloadUrl => la URL firmada
      window.open(res.data.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar el PDF");
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reiniciar a la primera página al cambiar el límite
  };

  const totalPages = Math.ceil(total / limit);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Repositorio de TT</h2>
      <TTSearchBar onSearch={handleSearch} />

      <div style={{ margin: "10px 0" }}>
        <label>Resultados por página: </label>
        <select value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table border={1} cellPadding={10} cellSpacing={0}>
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
                <Link to={`/tts/edit/${tt._id}`}>Editar</Link> |{" "}
                <button onClick={() => handleDelete(tt._id)}>Eliminar</button> |{" "}
                <button onClick={() => handleDownload(tt._id)}>
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrevPage} disabled={page <= 1}>
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
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
