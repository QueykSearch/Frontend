import React, { useEffect, useState } from "react";
import { User } from "../../types/User";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../../api/api";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>(
          "/users"
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este Usuario?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err: any) {
        alert("Error al eliminar el Usuario");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <Link to="/users/create">Crear Nuevo Usuario</Link>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Fecha de Registro</th>
            <th>Último Login</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nombreCompleto}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>{new Date(user.fechaRegistro).toLocaleDateString()}</td>
              <td>
                {user.ultimoLogin
                  ? new Date(user.ultimoLogin).toLocaleDateString()
                  : "Nunca"}
              </td>
              <td>
                <Link to={`/users/edit/${user._id}`}>Editar</Link> |{" "}
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
