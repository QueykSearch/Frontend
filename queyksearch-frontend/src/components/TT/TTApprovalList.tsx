import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { TT } from "../../types/TT";
// import { useAuth } from "../../context/AuthContext";

const TTApprovalList: React.FC = () => {
  //   const { user } = useAuth();
  const [tts, setTts] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchPendingTTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchPendingTTs = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        status: "pendiente", // Solo TTs pendientes
        ...filters,
      };
      const response = await api.get("/tts", { params });
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

  const handleApprove = async (ttId: string) => {
    try {
      await api.patch(`/tts/${ttId}/approve`);
      // Actualizar la lista localmente
      setTts(tts.filter((tt) => tt._id !== ttId));
      alert("TT aprobado con éxito");
    } catch (error) {
      console.error("Error al aprobar el TT:", error);
      alert("Error al aprobar el TT");
    }
  };

  const handleReject = async (ttId: string) => {
    try {
      await api.patch(`/tts/${ttId}/reject`);
      // Actualizar la lista localmente
      setTts(tts.filter((tt) => tt._id !== ttId));
      alert("TT rechazado con éxito");
    } catch (error) {
      console.error("Error al rechazar el TT:", error);
      alert("Error al rechazar el TT");
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
      <h2>TTs por Aprobar</h2>

      <div style={{ margin: "10px 0" }}>
        <label>Resultados por página: </label>
        <select value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {tts.length === 0 ? (
        <p>No hay TTs pendientes por aprobar.</p>
      ) : (
        <table border={1} cellPadding={10} cellSpacing={0}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autores</th>
              <th>Palabras Clave</th>
              <th>Unidad Académica</th>
              <th>Directores</th>
              <th>Grado</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tts.map((tt) => (
              <tr key={tt._id}>
                <td>{tt.titulo}</td>
                <td>{tt.autores.map((a) => a.nombreCompleto).join(", ")}</td>
                <td>{tt.palabrasClave.join(", ")}</td>
                <td>{tt.unidadAcademica}</td>
                <td>{tt.directores.map((d) => d.nombreCompleto).join(", ")}</td>
                <td>{tt.grado}</td>
                <td>{tt.status || "pendiente"}</td>
                <td>
                  <button onClick={() => handleApprove(tt._id)}>Aprobar</button>{" "}
                  |{" "}
                  <button onClick={() => handleReject(tt._id)}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

export default TTApprovalList;
