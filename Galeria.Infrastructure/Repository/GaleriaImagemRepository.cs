using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaImagemRepository(IRepositoryBase<GaleriaImagem> repositoryBase) : IGaleriaImagemRepository
    {
        public GaleriaImagem InserirGaleriaImagem(GaleriaImagem imagem) => repositoryBase.Adicionar(imagem);

        public Task<GaleriaImagem?> ObterGaleriaImagem(int id) => repositoryBase.ObterPorId(id);

        public Task<List<GaleriaImagem>> ListarPorSecao(int galeriaSecaoId) =>
            repositoryBase.Filtrar(x => x.GaleriaSecaoId == galeriaSecaoId);
    }
}
