// import React, { useEffect, useState } from "react";
// import { TT } from "../../types/TT";
// import { TTListResponse } from "../../types/TTListResponse";
// import api from "../../api/api";
// import { Link } from "react-router-dom";

// const TTList: React.FC = () => {
//   const [tts, setTts] = useState<TT[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTTs = async () => {
//       try {
//         const response = await api.get<TTListResponse>("/tts");
//         console.log("Respuesta de la API:", response.data);

//         // Acceder al arreglo de TTs correctamente
//         if (
//           response.data &&
//           response.data.data &&
//           Array.isArray(response.data.data.data)
//         ) {
//           setTts(response.data.data.data);
//         } else {
//           setError("La respuesta de la API no contiene un arreglo de TT.");
//         }

//         setLoading(false);
//       } catch (err: any) {
//         console.error("Error al obtener TT:", err);
//         setError(err.message || "Error desconocido al obtener TT.");
//         setLoading(false);
//       }
//     };

//     fetchTTs();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("¿Estás seguro de eliminar este TT?")) {
//       try {
//         await api.delete(`/tts/${id}`);
//         setTts(tts.filter((tt) => tt._id !== id));
//       } catch (err: any) {
//         alert("Error al eliminar el TT");
//         console.error("Error al eliminar TT:", err);
//       }
//     }
//   };

//   if (loading) return <div>Cargando...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!Array.isArray(tts))
//     return <div>Error: Los datos recibidos no son válidos.</div>;

//   return (
//     <div>
//       <h2>Lista de Trabajos de Titulación</h2>
//       <Link to="/tts/create">Crear Nuevo TT</Link>
//       <table border={1} cellPadding={10} cellSpacing={0}>
//         <thead>
//           <tr>
//             <th>Título</th>
//             <th>Autores</th>
//             <th>Palabras Clave</th>
//             <th>Unidad Académica</th>
//             <th>Directores</th>
//             <th>Grado</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tts.map((tt) => (
//             <tr key={tt._id}>
//               <td>{tt.titulo}</td>
//               <td>{tt.autores.map((a) => a.nombreCompleto).join(", ")}</td>
//               <td>{tt.palabrasClave.join(", ")}</td>
//               <td>{tt.unidadAcademica}</td>
//               <td>{tt.directores.map((d) => d.nombreCompleto).join(", ")}</td>
//               <td>{tt.grado}</td>
//               <td>
//                 <Link to={`/tts/edit/${tt._id}`}>Editar</Link> |{" "}
//                 <button onClick={() => handleDelete(tt._id)}>Eliminar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TTList;

// src/components/TT/TTList.tsx
import React, { useEffect, useState } from "react";
import TTSearchBar from "./TTSearchBar";
import api from "../../api/api";
import { TT } from "../../types/TT";
import { Link } from "react-router-dom";

const TTList: React.FC = () => {
  const [tts, setTts] = useState<TT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTTs = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tts", { params: filters });
      // Ajustar si la respuesta trae data: { data: { total, data: [] }}
      // Por ejemplo:
      if (response.data && response.data.data && response.data.data.data) {
        setTts(response.data.data.data);
        console.log("Respuesta de la API:", response.data);
      } else {
        setError("Estructura de respuesta no esperada");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTTs();
  }, []);

  const handleSearch = (filters: any) => {
    fetchTTs(filters);
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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Repositorio de TT</h2>
      <TTSearchBar onSearch={handleSearch} />

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
