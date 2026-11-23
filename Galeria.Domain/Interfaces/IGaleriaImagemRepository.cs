using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;

namespace Galeria.Domain.Interfaces
{
    public interface IGaleriaImagemRepository
    {
        GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem);
        Task<GaleriaImagem?> ObterGaleriaImagem(int id, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null);
        Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId);
        void ExcluirGaleriaImagem(GaleriaImagem imagem);
    }
}
