using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Domain.Interfaces
{
    public interface IGaleriaRepository
    {
        public Task<Models.Galeria> CadastroGaleria(Models.Galeria model);
        public Task<List<Models.Galeria>> FiltrarGalerias(Expression<Func<Models.Galeria, bool>> filter, Func<IQueryable<Models.Galeria>, IIncludableQueryable<Models.Galeria, object>> include = null);
    }
}
