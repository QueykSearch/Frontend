// src/components/TT/TTForm.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { Autor, Director } from "../../types/TT";
import { TTSingleResponse } from "../../types/TTSingleResponse";
import { useAuth } from "../../context/AuthContext";
import "./TTForm.css"; // Importar el CSS

const TTForm: React.FC = () => {
  const { ttId } = useParams<{ ttId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Definición de estados con tipos explícitos
  const [titulo, setTitulo] = useState<string>("");
  const [autores, setAutores] = useState<Autor[]>([
    { nombreCompleto: "", orcid: "" },
  ]);
  const [palabrasClave, setPalabrasClave] = useState<string[]>([""]);
  const [unidadAcademica, setUnidadAcademica] = useState<string>("");
  const [directores, setDirectores] = useState<Director[]>([
    { nombreCompleto: "", orcid: "" },
  ]);
  const [grado, setGrado] = useState<string>("");
  const [resumen, setResumen] = useState<string>("");
  const [file, setFile] = useState<File | null>(null); // PDF
  const [fechaPublicacion, setFechaPublicacion] = useState<string>("");

  // Nuevo: estado para mostrar loader durante la extracción
  const [isExtractingMetadata, setIsExtractingMetadata] = useState<boolean>(false);

  // Cargar Datos si es Edición
  useEffect(() => {
    if (ttId) {
      const fetchTT = async () => {
        try {
          const response = await api.get<TTSingleResponse>(`/tts/${ttId}`);
          const tt = response.data.data;

          setTitulo(tt.titulo || "");

          if (tt.autores && Array.isArray(tt.autores)) {
            setAutores(
              tt.autores.map((a) => ({
                nombreCompleto: a.nombreCompleto || "",
                orcid: a.orcid || "",
              }))
            );
          }

          if (tt.palabrasClave && Array.isArray(tt.palabrasClave)) {
            setPalabrasClave(tt.palabrasClave);
          }

          setUnidadAcademica(tt.unidadAcademica || "");

          if (tt.directores && Array.isArray(tt.directores)) {
            setDirectores(
              tt.directores.map((d) => ({
                nombreCompleto: d.nombreCompleto || "",
                orcid: d.orcid || "",
              }))
            );
          }

          setGrado(tt.grado || "");
          setResumen(tt.resumen || "");

          if (tt.fechaPublicacion) {
            setFechaPublicacion(tt.fechaPublicacion.substring(0, 10));
          }
        } catch (error) {
          console.error("Error al obtener el TT:", error);
          alert("Error al obtener el TT");
        }
      };
      fetchTT();
    }
  }, [ttId]);

  // Manejo de Autores
  const handleAutorChange = (index: number, field: keyof Autor, value: string) => {
    const newAutores = [...autores];
    newAutores[index][field] = value;
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

  // Manejo de Directores
  const handleDirectorChange = (index: number, field: keyof Director, value: string) => {
    const newDirectores = [...directores];
    newDirectores[index][field] = value;
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

  // Manejo de Palabras Clave
  const handlePalabraClaveChange = (index: number, value: string) => {
    const newPC = [...palabrasClave];
    newPC[index] = value;
    setPalabrasClave(newPC);
  };
  const addPalabraClave = () => {
    setPalabrasClave([...palabrasClave, ""]);
  };
  const removePalabraClave = (index: number) => {
    const newPC = [...palabrasClave];
    newPC.splice(index, 1);
    setPalabrasClave(newPC);
  };

  // Manejar la subida de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Manejo de EXTRAER METADATA (IA)
  const handleFillWithAI = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo PDF primero.");
      return;
    }
    try {
      setIsExtractingMetadata(true); // Mostrar loader

      // Crear FormData con el archivo
      const formData = new FormData();
      formData.append("file", file);

      // Llamamos al endpoint de metadata con IA
      const response = await api.post("/tts/metadata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.data) {
        const meta = response.data.data;
        console.log("Metadata extraída (IA):", meta);

        // Actualizar los campos del formulario
        if (meta.titulo) setTitulo(meta.titulo);

        if (meta.autores && Array.isArray(meta.autores)) {
          setAutores(
            meta.autores.map((a: any) => ({
              nombreCompleto: a.nombreCompleto || "",
              orcid: a.orcid || "",
            }))
          );
        }
        if (meta.palabrasClave && Array.isArray(meta.palabrasClave)) {
          setPalabrasClave(meta.palabrasClave);
        }
        if (meta.unidadAcademica) setUnidadAcademica(meta.unidadAcademica);

        if (meta.directores && Array.isArray(meta.directores)) {
          setDirectores(
            meta.directores.map((d: any) => ({
              nombreCompleto: d.nombreCompleto || "",
              orcid: d.orcid || "",
            }))
          );
        }
        if (meta.grado) setGrado(meta.grado);
        if (meta.resumen) setResumen(meta.resumen);

        // Manejo de fecha
        if (meta.fechaPublicacion) {
          const possibleYear = meta.fechaPublicacion.trim();
          if (/^\d{4}$/.test(possibleYear)) {
            setFechaPublicacion(`${possibleYear}-01-01`);
          } else {
            setFechaPublicacion(possibleYear.substring(0, 10));
          }
        }

        alert("La IA completó el formulario con éxito");
      } else {
        alert("No se recibió metadata válida desde la IA");
      }
    } catch (error: any) {
      console.error("Error al extraer metadata (IA):", error);
      alert("Error al extraer metadata con IA");
    } finally {
      setIsExtractingMetadata(false);
    }
  };

  // Manejo de ENVÍO del Formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Crear `FormData`
    const formData = new FormData();

    if (file) formData.append("file", file);
    formData.append("titulo", titulo);
    formData.append("unidadAcademica", unidadAcademica);
    formData.append("grado", grado);
    formData.append("resumen", resumen);
    formData.append("autores", JSON.stringify(autores));
    formData.append("directores", JSON.stringify(directores));
    formData.append("palabrasClave", JSON.stringify(palabrasClave));
    if (fechaPublicacion) {
      formData.append("fechaPublicacion", fechaPublicacion);
    }
    formData.append("createdBy", user._id);

    try {
      if (ttId) {
        // Actualizar TT
        const jsonData = {
          titulo,
          unidadAcademica,
          grado,
          resumen,
          autores,
          directores,
          palabrasClave,
          fechaPublicacion,
        };

        await api.put(`/tts/${ttId}`, jsonData, {
          headers: { "Content-Type": "application/json" },
        });

        alert("TT actualizado con éxito");
      } else {
        // Crear TT
        await api.post("/tts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("TT creado con éxito");
      }
      navigate("/tts");
    } catch (err) {
      console.error("Error al guardar el TT:", err);
      alert("Error al guardar el TT");
    }
  };

  return (
    <div className="ttform-container">
      <h2 className="ttform-title">{ttId ? "Editar" : "Crear"} Trabajo de Titulación</h2>

      {/* Loader simple mientras extraemos metadata */}
      {isExtractingMetadata && (
        <div style={{ marginBottom: "10px", color: "blue" }}>
          Extrayendo metadata con IA, por favor espera...
        </div>
      )}

      <form className="ttform-form" onSubmit={handleSubmit}>
        {/* Subida de PDF (moverlo al inicio) */}
        <div className="ttform-group">
          <label>Archivo PDF del TT:</label>
          <input
            className="ttform-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          {/* Botón súper llamativo para IA */}
          <button
            type="button"
            className="ttform-ai-button"
            onClick={handleFillWithAI}
            disabled={isExtractingMetadata}
          >
            {isExtractingMetadata ? "Extrayendo..." : "Rellenar con IA"}
          </button>
        </div>

        {/* TÍTULO */}
        <div className="ttform-group">
          <label>Título:</label>
          <input
            className="ttform-input"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        {/* Autores */}
        <div className="ttform-group">
          <label>Autores:</label>
          {autores.map((autor, index) => (
            <div className="ttform-repetible-item" key={index}>
              <input
                className="ttform-input"
                type="text"
                placeholder="Nombre Completo"
                value={autor.nombreCompleto}
                onChange={(e) => handleAutorChange(index, "nombreCompleto", e.target.value)}
                required
              />
              <input
                className="ttform-input"
                type="text"
                placeholder="ORCID (Opcional)"
                value={autor.orcid}
                onChange={(e) => handleAutorChange(index, "orcid", e.target.value)}
              />
              {autores.length > 1 && (
                <button
                  className="ttform-delete-button"
                  type="button"
                  onClick={() => removeAutor(index)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button className="ttform-inline-button" type="button" onClick={addAutor}>
            + Autor
          </button>
        </div>

        {/* Palabras Clave */}
        <div className="ttform-group">
          <label>Palabras Clave:</label>
          {palabrasClave.map((pc, idx) => (
            <div className="ttform-repetible-item" key={idx}>
              <input
                className="ttform-input"
                type="text"
                value={pc}
                onChange={(e) => handlePalabraClaveChange(idx, e.target.value)}
                required={idx === 0}
              />
              {palabrasClave.length > 1 && (
                <button
                  className="ttform-delete-button"
                  type="button"
                  onClick={() => removePalabraClave(idx)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            className="ttform-inline-button"
            type="button"
            onClick={addPalabraClave}
          >
            + Palabra Clave
          </button>
        </div>

        <div className="ttform-group">
          <label>Unidad Académica:</label>
          <input
            className="ttform-input"
            type="text"
            value={unidadAcademica}
            onChange={(e) => setUnidadAcademica(e.target.value)}
            required
          />
        </div>

        {/* Directores */}
        <div className="ttform-group">
          <label>Directores:</label>
          {directores.map((director, index) => (
            <div className="ttform-repetible-item" key={index}>
              <input
                className="ttform-input"
                type="text"
                placeholder="Nombre Completo"
                value={director.nombreCompleto}
                onChange={(e) => handleDirectorChange(index, "nombreCompleto", e.target.value)}
                required
              />
              <input
                className="ttform-input"
                type="text"
                placeholder="ORCID (Opcional)"
                value={director.orcid}
                onChange={(e) => handleDirectorChange(index, "orcid", e.target.value)}
              />
              {directores.length > 1 && (
                <button
                  className="ttform-delete-button"
                  type="button"
                  onClick={() => removeDirector(index)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            className="ttform-inline-button"
            type="button"
            onClick={addDirector}
          >
            + Director
          </button>
        </div>

        <div className="ttform-group">
          <label>Grado:</label>
          <input
            className="ttform-input"
            type="text"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            required
          />
        </div>

        <div className="ttform-group">
          <label>Resumen:</label>
          <textarea
            className="ttform-textarea"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
          />
        </div>

        {/* Fecha de Publicación (opcional) */}
        <div className="ttform-group">
          <label>Fecha de Publicación:</label>
          <input
            className="ttform-input"
            type="date"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
          />
        </div>

        <button className="ttform-button" type="submit">
          {ttId ? "Actualizar" : "Crear"} TT
        </button>
      </form>
    </div>
  );
};

export default TTForm;
