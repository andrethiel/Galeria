using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;

namespace Galeria.Application.Interfaces
{
    public interface IGaleriaImagemServices
    {
        Task<GaleriaImagemResponse> Upload(ImagemCreateRequest model);
        Task<List<GaleriaImagemResponse>> ListarPorSecao(int galeriaId, int galeriaSecaoId);
    }
}
