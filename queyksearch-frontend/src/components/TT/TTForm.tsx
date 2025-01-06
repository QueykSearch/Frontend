import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TT } from "../../types/TT";

const TTForm: React.FC = () => {
  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState([{ nombreCompleto: "", orcid: "" }]);
  const [palabrasClave, setPalabrasClave] = useState<string[]>([""]);
  const [unidadAcademica, setUnidadAcademica] = useState("");
  const [directores, setDirectores] = useState([
    { nombreCompleto: "", orcid: "" },
  ]);
  const [grado, setGrado] = useState("");
  const [resumen, setResumen] = useState("");
  const [documentoUrl, setDocumentoUrl] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const navigate = useNavigate();
  const { ttId } = useParams<{ ttId: string }>();

  useEffect(() => {
    if (ttId) {
      // Editar TT: Obtener datos existentes
      const fetchTT = async () => {
        try {
          const response = await axios.get<TT>(
            `http://localhost:4000/api/v1/tts/${ttId}`
          );
          const tt = response.data;
          setTitulo(tt.titulo);
          //   setAutores(tt.autores);
          setPalabrasClave(tt.palabrasClave);
          setUnidadAcademica(tt.unidadAcademica);
          //   setDirectores(tt.directores);
          setGrado(tt.grado);
          setResumen(tt.resumen);
          setDocumentoUrl(tt.documentoUrl);
          setFechaPublicacion(
            tt.fechaPublicacion ? tt.fechaPublicacion.substring(0, 10) : ""
          );
        } catch (err: any) {
          alert("Error al obtener el TT");
        }
      };

      fetchTT();
    }
  }, [ttId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ttData: Partial<TT> = {
      titulo,
      autores,
      palabrasClave,
      unidadAcademica,
      directores,
      grado,
      resumen,
      documentoUrl,
      fechaPublicacion: fechaPublicacion
        ? new Date(fechaPublicacion).toISOString()
        : undefined,
    };

    try {
      if (ttId) {
        // Actualizar TT
        await axios.put(`http://localhost:4000/api/v1/tts/${ttId}`, ttData);
        alert("TT actualizado con éxito");
      } else {
        // Crear TT
        await axios.post("http://localhost:4000/api/v1/tts", ttData);
        alert("TT creado con éxito");
      }
      navigate("/tts");
    } catch (err: any) {
      alert("Error al guardar el TT");
    }
  };

  // Funciones para manejar autores y directores dinámicos
  const handleAutorChange = (index: number, field: string, value: string) => {
    const newAutores = [...autores];
    (newAutores[index] as any)[field] = value;
    setAutores(newAutores);
  };

  const addAutor = () => {
    setAutores([...autores, { nombreCompleto: "", orcid: "" }]);
  };

  const removeAutor = (index: number) => {
    const newAutores = [...autores];
    newAutores.splice(index, 1);
    setAutores(newAutores);
  };

  const handleDirectorChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newDirectores = [...directores];
    (newDirectores[index] as any)[field] = value;
    setDirectores(newDirectores);
  };

  const addDirector = () => {
    setDirectores([...directores, { nombreCompleto: "", orcid: "" }]);
  };

  const removeDirector = (index: number) => {
    const newDirectores = [...directores];
    newDirectores.splice(index, 1);
    setDirectores(newDirectores);
  };

  const handlePalabraClaveChange = (index: number, value: string) => {
    const newPalabrasClave = [...palabrasClave];
    newPalabrasClave[index] = value;
    setPalabrasClave(newPalabrasClave);
  };

  const addPalabraClave = () => {
    setPalabrasClave([...palabrasClave, ""]);
  };

  const removePalabraClave = (index: number) => {
    const newPalabrasClave = [...palabrasClave];
    newPalabrasClave.splice(index, 1);
    setPalabrasClave(newPalabrasClave);
  };

  return (
    <div>
      <h2>{ttId ? "Editar" : "Crear"} Trabajo de Titulación</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Autores:</label>
          {autores.map((autor, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Nombre Completo"
                value={autor.nombreCompleto}
                onChange={(e) =>
                  handleAutorChange(index, "nombreCompleto", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="ORCID (Opcional)"
                value={autor.orcid}
                onChange={(e) =>
                  handleAutorChange(index, "orcid", e.target.value)
                }
              />
              {autores.length > 1 && (
                <button type="button" onClick={() => removeAutor(index)}>
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addAutor}>
            Añadir Autor
          </button>
        </div>

        <div>
          <label>Palabras Clave:</label>
          {palabrasClave.map((palabra, index) => (
            <div key={index}>
              <input
                type="text"
                value={palabra}
                onChange={(e) =>
                  handlePalabraClaveChange(index, e.target.value)
                }
                required
              />
              {palabrasClave.length > 1 && (
                <button type="button" onClick={() => removePalabraClave(index)}>
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPalabraClave}>
            Añadir Palabra Clave
          </button>
        </div>

        <div>
          <label>Unidad Académica:</label>
          <input
            type="text"
            value={unidadAcademica}
            onChange={(e) => setUnidadAcademica(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Directores:</label>
          {directores.map((director, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Nombre Completo"
                value={director.nombreCompleto}
                onChange={(e) =>
                  handleDirectorChange(index, "nombreCompleto", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="ORCID (Opcional)"
                value={director.orcid}
                onChange={(e) =>
                  handleDirectorChange(index, "orcid", e.target.value)
                }
              />
              {directores.length > 1 && (
                <button type="button" onClick={() => removeDirector(index)}>
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDirector}>
            Añadir Director
          </button>
        </div>

        <div>
          <label>Grado:</label>
          <input
            type="text"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Resumen:</label>
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>URL del Documento:</label>
          <input
            type="url"
            value={documentoUrl}
            onChange={(e) => setDocumentoUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Fecha de Publicación:</label>
          <input
            type="date"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
          />
        </div>

        <button type="submit">{ttId ? "Actualizar" : "Crear"} TT</button>
      </form>
    </div>
  );
};

export default TTForm;
