using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaRepository(IRepositoryBase<Domain.Models.Galeria> _repositoryBase) : IGaleriaRepository
    {
        public Task<Domain.Models.Galeria> CadastroGaleria(Domain.Models.Galeria model) => _repositoryBase.Inserir(model);

        public Task<List<Domain.Models.Galeria>> FiltrarGalerias(Expression<Func<Domain.Models.Galeria, bool>> filter, Func<IQueryable<Domain.Models.Galeria>, IIncludableQueryable<Domain.Models.Galeria, object>> include = null) =>
            _repositoryBase.Filtrar(filter, include);
    }
}
