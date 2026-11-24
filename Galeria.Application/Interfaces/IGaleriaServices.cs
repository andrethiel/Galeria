using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Interfaces
{
    public interface IGaleriaServices
    {
        Task<GaleriaResponse> CadastroGaleria(GaleriaCreateRequest model);
        Task<GaleriaResponse> EditarGaleria(GaleriaEditRequest model);
        Task<List<GaleriaResponse>> ListarGalerias();
        Task<GaleriaResponse?> ObterGaleria(int id);
        Task<GaleriaResponse> GaleriaPublicar(int idGaleria);
    }
}
