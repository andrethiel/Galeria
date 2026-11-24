using Galeria.Api.Controllers.Response;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Galeria.Api.Controllers
{
    [ApiController]
    public class ClienteController(IClienteServices _clienteService) : ControllerBase
    {
        [HttpPost]
        [Route("/CadastrarCliente")]
        public async Task<IActionResult> CadastrarCliente([FromBody] ClienteCreateRequest cliente)
        {
            var clienteResponse = await _clienteService.InserirCliente(cliente);
            return Ok(BaseResponseFactory.Success(clienteResponse));
        }

        [HttpPost]
        [Route("/CadastrarClienteComGaleria")]
        public async Task<IActionResult> CadastrarClienteComGaleria([FromBody] ClienteGaleriaCreateRequest cliente)
        {
            var response = await _clienteService.InserirClienteComGaleria(cliente);
            return Ok(BaseResponseFactory.Success(response));
        }

        [HttpPost]
        [Route("/EditarCliente")]
        public async Task<IActionResult> EditarCliente([FromBody] ClienteEditRequest cliente)
        {
            var clienteResponse = await _clienteService.EditarCliente(cliente);
            return Ok(BaseResponseFactory.Success(clienteResponse));
        }

        [HttpGet]
        [Route("/ObterTipoEnsaios")]
        public async Task<IActionResult> ObterTipoEnsaios()
        {
            var clienteResponse = _clienteService.ObterTipoEnsaios();
            return Ok(BaseResponseFactory.Success(clienteResponse));
        }
    }
}
