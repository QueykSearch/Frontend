import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import {User} from "../types/User";

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
