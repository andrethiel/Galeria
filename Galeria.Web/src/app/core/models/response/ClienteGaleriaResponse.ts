import { ClienteResponse } from './ClienteResponse';
import { GaleriaResponse } from './GaleriaResponse';
import { GaleriaSecaoResponse } from './GaleriaSecaoResponse';

export interface ClienteGaleriaResponse {
  cliente: ClienteResponse;
  galeria: GaleriaResponse;
  galeriaSecao: GaleriaSecaoResponse;
}
