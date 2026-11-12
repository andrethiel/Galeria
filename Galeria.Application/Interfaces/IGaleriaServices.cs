using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Interfaces
{
    public interface IGaleriaServices
    {
        Task<GaleriaResponse> CadastroGaleria(GaleriaCreateRequest model);
    }
}
