export interface TT {
  _id: string;
  titulo: string;
  autores: Array<{
    nombreCompleto: string;
    orcid?: string;
  }>;
  palabrasClave: string[];
  unidadAcademica: string;
  directores: Array<{
    nombreCompleto: string;
    orcid?: string;
  }>;
  grado: string;
  resumen: string;
  documentoUrl: string;
  fechaPublicacion?: string; // ISO String
}
