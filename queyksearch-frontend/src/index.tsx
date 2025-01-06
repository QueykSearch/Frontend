import React from "react";
import ReactDOM from "react-dom/client"; // Nota: Cambio aquí
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error('No se pudo encontrar el elemento con id "root".');
}

const root = ReactDOM.createRoot(container); // Crear el root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
