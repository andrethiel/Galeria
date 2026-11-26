using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;

namespace Galeria.Application.Interfaces
{
    public interface IGaleriaImagemServices
    {
        Task<GaleriaImagemResponse> Upload(ImagemCreateRequest model);
        Task<GaleriaImagemResponse> ImagemPrincipal(int idImagem);
        Task<List<GaleriaSecaoResponse>> ListarPorSecao(int galeriaId, int galeriaSecaoId);
        Task<GaleriaImagemResponse> Excluir(int galeriaId, int id);
    }
}
