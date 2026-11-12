export interface GaleriaResponse {
  id: number;
  guid: string;
  clienteId: number;
  slug: string;
  status: number;
  senhaHash: string;
  token: string;
  dataPublicacao: Date | null;
  dataExpiracao: Date | null;
}
