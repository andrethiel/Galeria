import { ClienteResponse } from './response/ClienteResponse';
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
  nome: string;
  image: string;
  secoes?: GaleriaSecaoResponse[];
  cliente?: ClienteResponse;
}
