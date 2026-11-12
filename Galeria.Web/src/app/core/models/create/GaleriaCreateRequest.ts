export interface GaleriaCreateRequest {
  clienteId: number | null;
  slug: string | null;
  dataPublicacao: Date | null;
  dataExpiracao: Date | null;
}
