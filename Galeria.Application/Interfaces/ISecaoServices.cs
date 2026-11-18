using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Interfaces
{
    public interface ISecaoServices
    {
        Task<GaleriaSecaoResponse> CadastrarSecao(SecaoCreateRequest model);
        Task<GaleriaSecaoResponse> EditarSecao(SecaoEditRequest model);
        Task<GaleriaSecaoResponse> ExcluirSecao(int id);
    }
}
