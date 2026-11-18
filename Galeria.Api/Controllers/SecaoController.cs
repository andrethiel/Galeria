using Galeria.Api.Controllers.Response;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Galeria.Api.Controllers
{
    [ApiController]
    public class SecaoController(ISecaoServices _secaoServices) : ControllerBase
    {
        [HttpPost]
        [Route("SecaoCadastrar")]
        public async Task<IActionResult> CadastrarSecao([FromBody] SecaoCreateRequest model)
        {
            var secao = await _secaoServices.CadastrarSecao(model);
            return Ok(BaseResponseFactory.Success(secao));
        }

        [HttpPut]
        [Route("SecaoEditar")]
        public async Task<IActionResult> EditarSecao([FromBody] SecaoEditRequest model)
        {
            var secao = await _secaoServices.EditarSecao(model);
            return Ok(BaseResponseFactory.Success(secao));
        }
    }
}
