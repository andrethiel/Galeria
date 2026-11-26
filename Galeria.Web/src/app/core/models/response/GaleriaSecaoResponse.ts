import { GaleriaImagemResponse } from './GaleriaImagemResponse';

export interface GaleriaSecaoResponse {
  id: number;
  guid: string;
  nome: string;
  imagens?: GaleriaImagemResponse[];
}
