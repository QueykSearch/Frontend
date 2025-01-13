import React, { useEffect, useState } from "react";
import api from "../api/api";
import { TT } from "../types/TT";
import { useAuth } from "../context/AuthContext";
import "./MyProposalsPage.css"; // Tu archivo de estilos

const MyProposalsPage: React.FC = () => {
  const { user } = useAuth();

  const [proposals, setProposals] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filtro por estado (pendiente, aprobado, rechazado)
  const [statusFilter, setStatusFilter] = useState<string>(""); // "" => ver todos

  useEffect(() => {
    if (user._id) {
      fetchMyProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, page, limit, statusFilter]);

  // Función para obtener mis propuestas con paginación y filtro
  const fetchMyProposals = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construimos los params para la request
      const params: any = {
        page,
        limit,
        createdBy: user._id,
      };

      // Si el status no está vacío, agregamos el filtro
      if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await api.get("/tts", { params });
      const data = res.data.data;

      setProposals(data.data); // array de TTs
      setTotal(data.total);    // total de TTs (para la paginación)
    } catch (err: any) {
      console.error("Error al obtener mis propuestas:", err);
      setError("Error al obtener mis propuestas");
    } finally {
      setLoading(false);
    }
  };

  // Manejo del cambio de límite (resultados por página)
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reiniciamos la página
  };

  // Manejo del cambio de estado
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reiniciamos la página
  };

  // Cálculo de total de páginas
  const totalPages = Math.ceil(total / limit);

  // Botones de navegación
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return <div className="myproposals-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="myproposals-error">{error}</div>;
  }

  return (
    <div className="myproposals-container">
      <h1 className="myproposals-title">Mis Propuestas</h1>

      {/* Filtro de estado y selector de resultados por página */}
      <div className="myproposals-filters">
        <div className="myproposals-status-filter">
          <label htmlFor="statusSelect">Estado:</label>
          <select
            id="statusSelect"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div className="myproposals-limit">
          <label htmlFor="limitSelect">Resultados por página:</label>
          <select
            id="limitSelect"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Renderizado de propuestas */}
      {proposals.length === 0 ? (
        <p>No tienes propuestas registradas.</p>
      ) : (
        proposals.map((tt) => (
          <div className="myproposals-item" key={tt._id}>
            <h3 className="myproposals-item-title">{tt.titulo}</h3>
            <p className="myproposals-item-status">
              <span className="myproposals-item-label">Status:</span> {tt.status}
            </p>
            <p className="myproposals-item-resumen">
              <span className="myproposals-item-label">Resumen:</span> {tt.resumen}
            </p>
            {/* Más campos si deseas */}
          </div>
        ))
      )}

      {/* Controles de paginación */}
      {proposals.length > 0 && (
        <div className="myproposals-pagination">
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
      )}
    </div>
  );
};

export default MyProposalsPage;
