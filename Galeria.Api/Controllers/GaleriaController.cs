using Galeria.Api.Controllers.Response;
using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
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

        [HttpPost]
        [Route("/EditarGaleria")]
        public async Task<IActionResult> EditarGaleria([FromBody] GaleriaEditRequest galeria)
        {
            var galeriaResponse = await _galeriaServices.EditarGaleria(galeria);
            return Ok(BaseResponseFactory.Success(galeriaResponse));
        }

        [HttpPost]
        [Route("/FiltrarGaleria")]
        public async Task<IActionResult> FiltrarGaleria([FromBody] GaleriaRequest galeria)
        {
            var galeriaResponse = await _galeriaServices.FiltrarGalerias(galeria);
            return Ok(BaseResponseFactory.Success(galeriaResponse));
        }

        [HttpGet]
        [Route("Galerias")]
        public async Task<IActionResult> ListarGalerias([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var galerias = await _galeriaServices.ListarGalerias(page, pageSize);
            return Ok(BaseResponseFactory.Success(galerias));
        }

        [HttpGet]
        [Route("Galerias/{id:int}")]
        public async Task<IActionResult> ObterGaleria(int id)
        {
            var galeria = await _galeriaServices.ObterGaleria(id);
            return Ok(BaseResponseFactory.Success(galeria));
        }

        [HttpDelete]
        [Route("Galerias/Excluir/{id:int}")]
        public async Task<IActionResult> Excluir(int id)
        {
            await _galeriaServices.ExcluirGaleria(id);
            return Ok(BaseResponseFactory.Success());
        }

        [HttpGet]
        [Route("Galerias/Publicar")]
        public async Task<IActionResult> Publicar(int idGaleria)
        {
            var galeria = await _galeriaServices.GaleriaPublicar(idGaleria);
            return Ok(BaseResponseFactory.Success(galeria));
        }
    }
}
