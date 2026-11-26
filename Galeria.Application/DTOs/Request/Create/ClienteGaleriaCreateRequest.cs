namespace Galeria.Application.DTOs.Request.Create
{
    public class ClienteGaleriaCreateRequest
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Slug { get; set; }
    }
}
