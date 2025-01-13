import React, { useState } from "react";
import "./TTSearchBar.css"; // Importa el CSS

interface TTSearchProps {
  onSearch: (filters: any, isSemantic: boolean, semanticQuery?: string) => void;
}

const TTSearchBar: React.FC<TTSearchProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState<"traditional" | "semantic">(
    "traditional"
  );

  // Estados para búsqueda tradicional
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [unidadAcademica, setUnidadAcademica] = useState("");
  const [grado, setGrado] = useState("");
  const [palabraClave, setPalabraClave] = useState("");
  const [anoPublicacion, setAnoPublicacion] = useState("");

  // Estado para búsqueda semántica
  const [semanticQuery, setSemanticQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === "traditional") {
      const filters: any = {};
      if (titulo) filters.titulo = titulo;
      if (autor) filters.autor = autor;
      if (unidadAcademica) filters.unidadAcademica = unidadAcademica;
      if (grado) filters.grado = grado;
      if (palabraClave) filters.palabrasClave = [palabraClave];
      if (anoPublicacion) filters.anoPublicacion = Number(anoPublicacion);

      onSearch(filters, false);
    } else if (searchType === "semantic") {
      if (semanticQuery.trim() === "") {
        alert("Por favor, ingresa una consulta semántica.");
        return;
      }
      onSearch({}, true, semanticQuery);
    }
  };

  return (
    <form className="ttsearchbar-container" onSubmit={handleSubmit}>
      {/* Contenedor de radio buttons */}
      <div className="ttsearchbar-radio-group">
        <label>
          <input
            type="radio"
            value="traditional"
            checked={searchType === "traditional"}
            onChange={() => setSearchType("traditional")}
          />
          Búsqueda Tradicional
        </label>
        <label>
          <input
            type="radio"
            value="semantic"
            checked={searchType === "semantic"}
            onChange={() => setSearchType("semantic")}
          />
          Búsqueda Semántica
        </label>
      </div>

      {/* Inputs según el tipo de búsqueda */}
      {searchType === "traditional" ? (
        <div className="ttsearchbar-inputs">
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
        </div>
      ) : (
        <div className="ttsearchbar-inputs">
          <input
            type="text"
            placeholder="Consulta Semántica"
            value={semanticQuery}
            onChange={(e) => setSemanticQuery(e.target.value)}
          />
        </div>
      )}

      {/* Botón de buscar */}
      <button className="ttsearchbar-submit" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default TTSearchBar;
