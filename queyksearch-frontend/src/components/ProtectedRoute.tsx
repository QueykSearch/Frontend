import React from "react";
import {Navigate} from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const {isAuthenticated, isLoading} = {isAuthenticated: true, isLoading: false};

  // Mostrar un indicador de carga mientras Auth0 verifica el estado del usuario
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log("No autenticado");
    return <Navigate to="/login"/>;
  }

  // Si está autenticado, renderizar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
