export interface GaleriaImagemResponse {
  id: number;
  guid: string;
  galeriaId: number;
  galeriaSecaoId: number;
  nomeArquivo: string;
  imagemPrincipal?: boolean | null;
  url: string;
}
