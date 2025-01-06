import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { User } from "../../types/User";

const UserForm: React.FC = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>(["user"]);
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [ultimoLogin, setUltimoLogin] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    if (userId) {
      // Editar Usuario: Obtener datos existentes
      const fetchUser = async () => {
        try {
          const response = await axios.get<User>(
            `http://localhost:4000/api/v1/users/${userId}`
          );
          const user = response.data;
          setNombreCompleto(user.nombreCompleto);
          setEmail(user.email);
          setRoles(user.roles);
          setFechaRegistro(user.fechaRegistro.substring(0, 10));
          setUltimoLogin(
            user.ultimoLogin ? user.ultimoLogin.substring(0, 10) : ""
          );
        } catch (err: any) {
          alert("Error al obtener el Usuario");
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: Partial<User> = {
      nombreCompleto,
      email,
      roles,
      fechaRegistro: fechaRegistro
        ? new Date(fechaRegistro).toISOString()
        : undefined,
      ultimoLogin: ultimoLogin
        ? new Date(ultimoLogin).toISOString()
        : undefined,
    };

    try {
      if (userId) {
        // Actualizar Usuario
        await axios.put(
          `http://localhost:4000/api/v1/users/${userId}`,
          userData
        );
        alert("Usuario actualizado con éxito");
      } else {
        // Crear Usuario
        await axios.post("http://localhost:4000/api/v1/users", userData);
        alert("Usuario creado con éxito");
      }
      navigate("/users");
    } catch (err: any) {
      alert("Error al guardar el Usuario");
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(selectedOptions);
  };

  return (
    <div>
      <h2>{userId ? "Editar" : "Crear"} Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Roles:</label>
          <select multiple value={roles} onChange={handleRoleChange}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="gestor">Gestor</option>
            {/* Añade más roles según sea necesario */}
          </select>
        </div>

        <div>
          <label>Fecha de Registro:</label>
          <input
            type="date"
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
          />
        </div>

        <div>
          <label>Último Login:</label>
          <input
            type="date"
            value={ultimoLogin}
            onChange={(e) => setUltimoLogin(e.target.value)}
          />
        </div>

        <button type="submit">{userId ? "Actualizar" : "Crear"} Usuario</button>
      </form>
    </div>
  );
};

export default UserForm;
