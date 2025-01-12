import React, {
  createContext,
  useState,
  useContext,
  ReactNode, useEffect,
} from "react";
import {User} from "../types/User";
import api from "../api/api";

// Definimos qué expone nuestro contexto
interface AuthContextProps {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User;
  setUser: (user: User) => void;
}

// Creamos el contexto con defaults "vacíos"
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setAuthenticated: () => {
  },
  user: {
    _id: "",
    nombreCompleto: "Visitante",
    email: "",
    roles: ["visitor"],
    fechaRegistro: new Date().toISOString(),
  },
  setUser: () => {
  },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children,}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    _id: "",
    nombreCompleto: "Visitante",
    email: "",
    roles: ["visitor"],
    fechaRegistro: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const accessToken: string | null = localStorage.getItem('accessToken');
        const refreshToken: string | null = localStorage.getItem('refreshToken');
        const expiresAt: string | null = localStorage.getItem('expiresAt');

        if (!accessToken || !refreshToken || !expiresAt) {
          return;
        }

        const response = await api.post('/login-with-token', {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresAt: expiresAt,
        });

        console.log("Response:", response);

        if (response.data) {
          const {accessToken, refreshToken, expiresAt, user} = response.data.data;

          setAuthenticated(true);
          setUser(user);

          console.log("User session restored:", user, expiresAt, accessToken, refreshToken);

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('expiresAt', expiresAt);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUserSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
