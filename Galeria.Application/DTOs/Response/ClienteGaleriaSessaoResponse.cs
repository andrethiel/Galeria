namespace Galeria.Application.DTOs.Response
{
    public class ClienteGaleriaSessaoResponse
    {
        public ClienteResponse Cliente { get; set; }
        public GaleriaResponse Galeria { get; set; }
        public GaleriaSecaoResponse GaleriaSecao { get; set; }
    }
}
