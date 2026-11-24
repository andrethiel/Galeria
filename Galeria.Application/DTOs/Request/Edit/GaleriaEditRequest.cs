using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request.Edit
{
    public class GaleriaEditRequest
    {
        public int Id { get; set; }
        public string Slug { get; set; }
        public string DataPublicacao { get; set; }
        public string DataExpiracao { get; set; }
        public int TipoEnsaio { get; set; }
    }
}
