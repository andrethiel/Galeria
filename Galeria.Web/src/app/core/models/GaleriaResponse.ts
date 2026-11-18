import { GaleriaSecaoResponse } from './response/GaleriaSecaoResponse';

export interface GaleriaResponse {
  id?: number;
  guid: string;
  clienteId?: number;
  slug?: string | null;
  status?: number;
  senhaHash?: string | null;
  token?: string | null;
  dataPublicacao?: string | null;
  dataExpiracao?: string | null;
  /** Campos usados pelos cards enquanto a API não os disponibiliza. */
  nome: string;
  image: string;
  secoes?: GaleriaSecaoResponse[];
}
