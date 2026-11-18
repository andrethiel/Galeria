namespace Galeria.Application.DTOs.Response
{
    public class GaleriaImagemResponse
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public int GaleriaId { get; set; }
        public int GaleriaSecaoId { get; set; }
        public string NomeArquivo { get; set; }
        public string Url { get; set; }
    }
}
