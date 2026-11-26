using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request
{
    public class GaleriaRequest
    {
        public int? Id{ get; set; }
        public string NomeCliente { get; set; }
        public string Slug { get; set; }
        public int Status { get; set; }
        public int? TipoEnsaio { get; set; }
        public DateTime? DataPublicacao { get; set; }
        public DateTime? DataExpiracao { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
    }
}
