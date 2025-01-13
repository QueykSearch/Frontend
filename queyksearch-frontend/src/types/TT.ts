export interface Autor {
  nombreCompleto: string;
  orcid?: string;
  _id?: string;
}

export interface Director {
  nombreCompleto: string;
  orcid?: string;
  _id?: string;
}

export interface TT {
  _id: string;
  titulo: string;
  autores: Autor[];
  palabrasClave: string[];
  unidadAcademica: string;
  directores: Director[];
  grado: string;
  resumen: string;
  documentoUrl: string;
  filename?: string;
  fechaPublicacion?: string; // ISO String
  __v?: number;
  status?: string;
  createdBy?: string;
}
