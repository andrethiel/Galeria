using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.Interfaces;
using Galeria.Api.Controllers.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Galeria.Api.Controllers
{
    [ApiController]
    public class ImagemController(IGaleriaImagemServices imagemServices) : ControllerBase
    {
        [HttpPost]
        [Route("GaleriaImagem/Upload")]
        public async Task<IActionResult> Upload([FromForm] ImagemCreateRequest model)
        {
            var imagem = await imagemServices.Upload(model);
            return Ok(BaseResponseFactory.Success(imagem));
        }

        [HttpGet]
        [Route("GaleriaImagem/Galeria/{galeriaId:int}/Secao/{galeriaSecaoId:int}")]
        public async Task<IActionResult> ListarPorSecao(int galeriaId, int galeriaSecaoId)
        {
            var imagens = await imagemServices.ListarPorSecao(galeriaId, galeriaSecaoId);
            return Ok(BaseResponseFactory.Success(imagens));
        }

        [HttpDelete]
        [Route("GaleriaImagem/Galeria/{galeriaId:int}/{id:int}")]
        public async Task<IActionResult> Excluir(int galeriaId, int id)
        {
            var imagem = await imagemServices.Excluir(galeriaId, id);
            return Ok(BaseResponseFactory.Success(imagem));
        }
    }
}
