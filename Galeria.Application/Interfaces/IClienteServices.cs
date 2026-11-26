using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Interfaces
{
    public interface IClienteServices
    {
        Task<ClienteResponse> InserirCliente(ClienteCreateRequest model);
        Task<ClienteResponse> EditarCliente(ClienteEditRequest model);
        Task<ClienteGaleriaSessaoResponse> InserirClienteComGaleria(ClienteGaleriaCreateRequest model);
        List<SelectItemtResponse<int>> ObterTipoEnsaios();
    }
}
