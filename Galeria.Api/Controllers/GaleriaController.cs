using Galeria.Api.Controllers.Response;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Galeria.Api.Controllers
{
    [ApiController]
    public class GaleriaController(IGaleriaServices _galeriaServices) : ControllerBase
    {
        [HttpPost]
        [Route("/CadastrarGaleria")]
        public async Task<IActionResult> CadastrarGaleria([FromBody] GaleriaCreateRequest galeria)
        {
            var galeriaResponse = await _galeriaServices.CadastroGaleria(galeria);
            return Ok(BaseResponseFactory.Success(galeriaResponse));
        }
    }
}
