using System.Collections.Generic;

namespace Galeria.Application.DTOs.Response
{
    public class GaleriaCliente
    {
        public string Slug { get; set; }
        public string ImagemPrincipal { get; set; } = string.Empty;
        public List<GaleriaClienteSecaoResponse> Secoes { get; set; } = new();
    }
    public class GaleriaClienteSecaoResponse
    {
        public string Nome { get; set; } = string.Empty;
        public List<GaleriaClienteImagemResponse> Imagens { get; set; } = new();
    }
    public class GaleriaClienteImagemResponse
    {
        public string Url { get; set; } = string.Empty;
    }
}
