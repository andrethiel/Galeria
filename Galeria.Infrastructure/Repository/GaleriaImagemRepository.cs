using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaImagemRepository(IRepositoryBase<GaleriaImagem> repositoryBase) : IGaleriaImagemRepository
    {
        public GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem) => repositoryBase.Adicionar(imagem);

        public Task<GaleriaImagem?> ObterGaleriaImagem(int id, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null) => repositoryBase.ObterPorId(id, include);

        public Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId) =>
            repositoryBase.Filtrar(imagem => imagem.GaleriaSecaoId == galeriaSecaoId);

        public void ExcluirGaleriaImagem(GaleriaImagem imagem) => repositoryBase.Deletar(imagem);

        public Task<GaleriaImagem> ObterImagemPorId(int id) => repositoryBase.ObterPorId(id);

        public Task<GaleriaImagem> EditarGaleriaImagem(GaleriaImagem model) => repositoryBase.Editar(model);

        public Task<List<GaleriaImagem>> FiltarImagens(Expression<Func<GaleriaImagem, bool>> filter, Func<IQueryable<GaleriaImagem>, IIncludableQueryable<GaleriaImagem, object>> include = null) =>
             repositoryBase.Filtrar(filter, include);
    }
}
