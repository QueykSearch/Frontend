// src/components/Navbar.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Importa el CSS

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Manejar la acción de logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Cerrar el menú al hacer clic en un enlace (opcional)
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo a la izquierda */}
      <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
        <span className="navbar-logo__queyk">QueyK</span>
        <span className="navbar-logo__search">Search</span>
      </Link>

      {/* Botón del menú hamburguesa */}
      <button
        className={`navbar-toggle ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Enlaces a la derecha */}
      <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/tts" onClick={handleLinkClick}>
            TTs
          </Link>
        </li>

        {/* Si NO es 'visitor', mostramos enlaces restringidos */}
        {!user.roles.includes("visitor") && (
          <>
            <li>
              <Link to="/my-proposals" onClick={handleLinkClick}>
                Mis Propuestas
              </Link>
            </li>
            <li>
              <Link to="/tts/create" onClick={handleLinkClick}>
                Proponer TT
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={handleLinkClick}>
                Historial
              </Link>
            </li>
          </>
        )}

        {/* Si es 'visitor', mostramos Login/Register */}
        {user.roles.includes("visitor") && (
          <>
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={handleLinkClick}>
                Registrarse
              </Link>
            </li>
          </>
        )}

        {/* Link sólo para gestor */}
        {user.roles.includes("gestor") && (
          <li>
            <Link to="/tts/approval" onClick={handleLinkClick}>
              TTs por Aprobar
            </Link>
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
