using Galeria.Domain.Models;

namespace Galeria.Domain.Interfaces
{
    public interface IGaleriaImagemRepository
    {
        GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem);
        Task<GaleriaImagem?> ObterGaleriaImagem(int id);
        Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId);
    }
}
