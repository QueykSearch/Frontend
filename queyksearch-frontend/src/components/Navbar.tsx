import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { role, setRole } = useAuth();

  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/tts">TTs</Link>
        </li>
        {role !== "visitor" && (
          <li>
            <Link to="/my-proposals">Mis Propuestas</Link>
          </li>
        )}
        {role !== "visitor" && (
          <li>
            <Link to="/tts/create">Proponer TT</Link>
          </li>
        )}
        <li>
          <span>Rol Actual: {role}</span>
          <button onClick={() => handleRoleChange("visitor")}>Visitor</button>
          <button onClick={() => handleRoleChange("user")}>User</button>
          <button onClick={() => handleRoleChange("gestor")}>Gestor</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
