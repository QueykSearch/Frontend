import React, { useState } from "react";

interface TTSearchProps {
  onSearch: (filters: any) => void;
}

const TTSearchBar: React.FC<TTSearchProps> = ({ onSearch }) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [unidadAcademica, setUnidadAcademica] = useState("");
  const [grado, setGrado] = useState("");
  const [palabraClave, setPalabraClave] = useState("");
  const [anoPublicacion, setAnoPublicacion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: any = {};
    if (titulo) filters.titulo = titulo;
    if (autor) filters.autor = autor;
    if (unidadAcademica) filters.unidadAcademica = unidadAcademica;
    if (grado) filters.grado = grado;
    if (palabraClave) filters.palabrasClave = [palabraClave];
    if (anoPublicacion) filters.anoPublicacion = Number(anoPublicacion);

    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Autor"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Unidad Académica"
        value={unidadAcademica}
        onChange={(e) => setUnidadAcademica(e.target.value)}
      />
      <input
        type="text"
        placeholder="Grado"
        value={grado}
        onChange={(e) => setGrado(e.target.value)}
      />
      <input
        type="text"
        placeholder="Palabra Clave"
        value={palabraClave}
        onChange={(e) => setPalabraClave(e.target.value)}
      />
      <input
        type="number"
        placeholder="Año de Publicación"
        value={anoPublicacion}
        onChange={(e) => setAnoPublicacion(e.target.value)}
      />
      <button type="submit">Buscar</button>
      <br />
      <br />
    </form>
  );
};

export default TTSearchBar;
