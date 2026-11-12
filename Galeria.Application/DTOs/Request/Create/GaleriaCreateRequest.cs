using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request.Create
{
    public class GaleriaCreateRequest
    {
        public int ClienteId { get; set; }
        public string Slug { get; set; }
        public StatusGaleria Status { get; set; } = StatusGaleria.Rascunho;
        public string SenhaHash { get; set; }
        public string Token { get; set; }
        public DateTime? DataPublicacao { get; set; }
        public DateTime? DataExpiracao { get; set; }
    }
}
