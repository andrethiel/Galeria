using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Response
{
    public class GaleriaResponse
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public int ClienteId { get; set; }
        public string Slug { get; set; }
        public StatusGaleria Status { get; set; }
        public string SenhaHash { get; set; }
        public string Token { get; set; }
        public DateTime? DataPublicacao { get; set; }
        public DateTime? DataExpiracao { get; set; }
        public List<GaleriaSecaoResponse> Secoes { get; set; } = new();
    }
}
