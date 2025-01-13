// src/components/Navbar.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); // <-- Obtenemos la función logout
  const navigate = useNavigate();

  // Manejar la acción de logout
  const handleLogout = () => {
    logout(); // <-- Llamamos al método del contexto
    navigate("/login"); // Redirigir a login o donde prefieras
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/tts">TTs</Link>
        </li>
        {!user.roles.includes("visitor") && (
          <>
            <li>
              <Link to="/my-proposals">Mis Propuestas</Link>
            </li>
            <li>
              <Link to="/tts/create">Proponer TT</Link>
            </li>
            <li>
              <Link to="/history">Historial</Link>
            </li>
          </>
        )}

        {user.roles.includes("visitor") && (
          <>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
          </>
        )}

        {/* Mostrar enlace a TTs por Aprobar solo para gestores */}
        {user.roles.includes("gestor") && (
          <li>
            <Link to="/tts/approval">TTs por Aprobar</Link>
          </li>
        )}

        {/* Mostrar botón Cerrar Sesión si NO es visitante */}
        {!user.roles.includes("visitor") && (
          <li>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
