export interface User {
  _id: string;
  nombreCompleto: string;
  email: string;
  roles: string[];
  fechaRegistro: string; // ISO String
  ultimoLogin?: string; // ISO String
}
