import { ClienteResponse } from './ClienteResponse';
import { GaleriaSecaoResponse } from './GaleriaSecaoResponse';

export interface GaleriaResponse {
  id: number;
  guid: string;
  status: number;
  clienteId?: number;
  slug: string | null;
  dataPublicacao: Date | null;
  dataExpiracao: Date | null;
  imagemPrincipal?: string | null;
  nome: string;
  image: string;
  secoes?: GaleriaSecaoResponse[];
  cliente?: ClienteResponse;
  totalImagens: number;
}
