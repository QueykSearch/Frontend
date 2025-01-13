// src/components/Navbar.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Importa el CSS

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Manejar la acción de logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo a la izquierda */}
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo__queyk">QueyK</span>
        <span className="navbar-logo__search">Search</span>
      </Link>

      {/* Enlaces a la derecha */}
      <ul className="navbar-menu">
        <li>
          <Link to="/tts">TTs</Link>
        </li>

        {/* Si NO es 'visitor', mostramos enlaces restringidos */}
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

        {/* Si es 'visitor', mostramos Login/Register */}
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

        {/* Link sólo para gestor */}
        {user.roles.includes("gestor") && (
          <li>
            <Link to="/tts/approval">TTs por Aprobar</Link>
          </li>
        )}

        {/* Si NO es visitor, se muestra Cerrar Sesión */}
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
