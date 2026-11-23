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
        public Task<ClienteResponse> InserirCliente(ClienteCreateRequest model);
        public Task<ClienteResponse> EditarCliente(ClienteEditRequest model);
        public Task<ClienteGaleriaSessaoResponse> InserirClienteComGaleria(ClienteGaleriaCreateRequest model);
    }
}
