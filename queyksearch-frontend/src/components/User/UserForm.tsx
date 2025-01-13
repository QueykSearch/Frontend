import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {Role, User} from "../../types/User";
import api from "../../api/api";

const UserForm: React.FC = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<Role[]>(["user"]);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    if (userId) {
      // Editar Usuario: Obtener datos existentes
      const fetchUser = async () => {
        try {
          const response = await api.get<User>(
            `/users/${userId}`
          );
          const user = response.data;
          setNombreCompleto(user.nombreCompleto);
          setEmail(user.email);
          setRoles(user.roles);
        } catch (err: any) {
          alert("Error al obtener el Usuario");
        }
      };

      void fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: Partial<User> = {
      nombreCompleto,
      email,
      roles,
    };

    try {
      if (userId) {
        // Actualizar Usuario
        await api.put(
          `/users/${userId}`,
          userData
        );
        alert("Usuario actualizado con éxito");
      } else {
        // Crear Usuario
        await api.post("/users", userData);
        alert("Usuario creado con éxito");
      }
      navigate("/users");
    } catch (err: any) {
      alert("Error al guardar el Usuario");
    }
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

        <button type="submit">{userId ? "Actualizar" : "Crear"} Usuario</button>
      </form>
    </div>
  );
};

export default UserForm;
