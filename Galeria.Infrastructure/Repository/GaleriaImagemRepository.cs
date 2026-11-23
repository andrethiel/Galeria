using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaImagemRepository(IRepositoryBase<GaleriaImagem> repositoryBase) : IGaleriaImagemRepository
    {
        public GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem) => repositoryBase.Adicionar(imagem);

        public Task<GaleriaImagem?> ObterGaleriaImagem(int id, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null) => repositoryBase.ObterPorId(id, include);

        public Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId) => repositoryBase.ListarPorId(galeriaSecaoId);

        public void ExcluirGaleriaImagem(GaleriaImagem imagem) => repositoryBase.Excluir(imagem);
    }
}
