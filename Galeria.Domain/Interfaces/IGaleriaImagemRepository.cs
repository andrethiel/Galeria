using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Galeria.Domain.Interfaces
{
    public interface IGaleriaImagemRepository
    {
        GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem);
        Task<GaleriaImagem?> ObterGaleriaImagem(int id, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null);
        Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId);
        Task<GaleriaImagem> ObterImagemPorId(int id);
        Task<List<GaleriaImagem>> FiltarImagens(Expression<Func<GaleriaImagem, bool>> filter, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null);
        Task<GaleriaImagem> EditarGaleriaImagem(GaleriaImagem model);
        void ExcluirGaleriaImagem(GaleriaImagem imagem);
    }
}
