import React, { useState } from "react";
import axios from "axios";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css"; // Importa el archivo CSS

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, expiresAt, user } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("expiresAt", expiresAt);

      console.log("Inicio de sesión exitoso para el usuario:", user);

      authContext.setUser(user);
      authContext.setAuthenticated(true);

      navigate("/tts");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || "Error al iniciar sesión");
      } else {
        setErrorMsg("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Iniciar Sesión</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <button
          className={`auth-button ${loading ? "auth-loading" : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
