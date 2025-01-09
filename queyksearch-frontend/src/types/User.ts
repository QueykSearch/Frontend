export type Role = "visitor" | "user" | "gestor";

export interface User {
  _id: string;
  nombreCompleto: string;
  email: string;
  roles: Role[];
  fechaRegistro: string; // ISO String
  ultimoLogin?: string; // ISO String
}
