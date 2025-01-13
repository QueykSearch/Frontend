// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types/User";
import api from "../api/api";

// Definimos qué expone nuestro contexto
interface AuthContextProps {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  logout: () => void; // <-- Añadido: Función para cerrar sesión
}

// Usuario "visitante" por defecto
const visitorUser: User = {
  _id: "",
  nombreCompleto: "Visitante",
  email: "",
  roles: ["visitor"],
  fechaRegistro: new Date().toISOString(),
};

// Creamos el contexto con defaults "vacíos"
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  user: visitorUser,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(visitorUser);

  // Intentar restaurar sesión del localStorage
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const accessToken: string | null = localStorage.getItem("accessToken");
        const refreshToken: string | null =
          localStorage.getItem("refreshToken");
        const expiresAt: string | null = localStorage.getItem("expiresAt");

        if (!accessToken || !refreshToken || !expiresAt) {
          return; // No hay tokens guardados
        }

        // Validamos/renovamos el token con login-with-token
        const response = await api.post("/login-with-token", {
          accessToken,
          refreshToken,
          expiresAt,
        });

        // Si la API responde bien, guardamos datos en el AuthContext
        if (response.data) {
          const {
            accessToken: newAccess,
            refreshToken: newRefresh,
            expiresAt: newExpires,
            user: userData,
          } = response.data.data;

          setAuthenticated(true);
          setUser(userData);

          localStorage.setItem("accessToken", newAccess);
          localStorage.setItem("refreshToken", newRefresh);
          localStorage.setItem("expiresAt", newExpires);
        }
      } catch (error) {
        console.error("Error restaurando sesión:", error);
      }
    };

    void fetchUserSession();
  }, []);

  /**
   * Función para cerrar sesión (logout):
   * - Quita tokens del localStorage
   * - Restaura el usuario a "visitante"
   * - isAuthenticated = false
   */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");

    setUser(visitorUser);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        user,
        setUser,
        logout, // <-- Inyectamos la función en el contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
