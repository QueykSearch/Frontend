import React, { useEffect, useState } from "react";
import { TT } from "../../types/TT";
// import axios from "axios";
import api from "../../api/api";
import { Link } from "react-router-dom";

const TTList: React.FC = () => {
  const [tts, setTts] = useState<TT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTTs = async () => {
      try {
        const response = await api.get<{ data: TT[] }>("/tts");
        setTts(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTTs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este TT?")) {
      try {
        await api.delete(`/tts/${id}`);
        setTts(tts.filter((tt) => tt._id !== id));
      } catch (err: any) {
        alert("Error al eliminar el TT");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Trabajos de Titulación</h2>
      <Link to="/tts/create">Crear Nuevo TT</Link>
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
              <td>{tt.titulo}</td>
              <td>{tt.autores.map((a) => a.nombreCompleto).join(", ")}</td>
              <td>{tt.palabrasClave.join(", ")}</td>
              <td>{tt.unidadAcademica}</td>
              <td>{tt.directores.map((d) => d.nombreCompleto).join(", ")}</td>
              <td>{tt.grado}</td>
              <td>
                <Link to={`/tts/edit/${tt._id}`}>Editar</Link> |{" "}
                <button onClick={() => handleDelete(tt._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TTList;
