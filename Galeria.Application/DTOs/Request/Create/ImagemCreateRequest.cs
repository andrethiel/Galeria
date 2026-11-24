using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request.Create
{
    public class ImagemCreateRequest
    {
        public int GaleriaId { get; set; }
        public int GaleriaSecaoId { get; set; }
        public bool? ImagemPrincipal { get; set; }
        public IFormFile Arquivo { get; set; }
    }
}
