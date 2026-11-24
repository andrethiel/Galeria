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
        Task<Models.Galeria> CadastroGaleria(Models.Galeria model);
        Task<Models.Galeria> EditarGaleria(Models.Galeria model);
        Models.Galeria AdicionarGaleria(Models.Galeria model);
        Task<Domain.Models.Galeria> ObterGaleriaPorId(int id, Func<IQueryable<Domain.Models.Galeria>, IIncludableQueryable<Domain.Models.Galeria, object>> include = null);
        Task<List<Models.Galeria>> FiltrarGalerias(Expression<Func<Models.Galeria, bool>> filter, Func<IQueryable<Models.Galeria>, IIncludableQueryable<Models.Galeria, object>> include = null);
    }
}
