import React from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const Navbar: React.FC = () => {
  const {user} = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/tts">TTs</Link>
        </li>
        {!user.roles.includes("visitor") && (
          <li>
            <Link to="/my-proposals">Mis Propuestas</Link>
          </li>
        )}
        {!user.roles.includes("visitor") && (
          <li>
            <Link to="/tts/create">Proponer TT</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
