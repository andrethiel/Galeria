using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaRepository(IRepositoryBase<Domain.Models.Galeria> _repositoryBase) : IGaleriaRepository
    {
        public async Task<Domain.Models.Galeria> CadastroGaleria(Domain.Models.Galeria model) => await _repositoryBase.Inserir(model);

        public Domain.Models.Galeria AdicionarGaleria(Domain.Models.Galeria model) => _repositoryBase.Adicionar(model);

        public async Task<List<Domain.Models.Galeria>> FiltrarGalerias(Expression<Func<Domain.Models.Galeria, bool>> filter, Func<IQueryable<Domain.Models.Galeria>, IIncludableQueryable<Domain.Models.Galeria, object>> include = null, int page = 0, int pageSize = 0) =>
            await _repositoryBase.Filtrar(filter, include, page, pageSize);
        public async Task<List<Domain.Models.Galeria>> ListarGalerias(Func<IQueryable<Domain.Models.Galeria>, IIncludableQueryable<Domain.Models.Galeria, object>> include = null, int page = 0, int pageSize = 0) =>
            await _repositoryBase.Listar(include, page, pageSize);

        public async Task<Domain.Models.Galeria> ObterGaleriaPorId(int id, Func<IQueryable<Domain.Models.Galeria>, IIncludableQueryable<Domain.Models.Galeria, object>> include = null) =>
            await _repositoryBase.ObterPorId(id, include);

        public async Task<Domain.Models.Galeria> EditarGaleria(Domain.Models.Galeria model) => await _repositoryBase.Editar(model);

        public async Task ExcluirGaleria(Domain.Models.Galeria model) => await _repositoryBase.Deletar(model);
    }
}
