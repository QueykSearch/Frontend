import { TT } from "./TT";

export interface TTListResponse {
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: TT[];
  };
}
