using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Domain.Interfaces
{
    public interface IGaleriaSecaoRepository
    {
        GaleriaSecao AdicionarGaleriaSecao(GaleriaSecao galeriaSecao);
        Task<GaleriaSecao> ObterGaleriaSecaoPorId(int id, Func<IQueryable<GaleriaSecao>, IIncludableQueryable<GaleriaSecao, object>> include = null);
        Task<List<GaleriaSecao>> FiltrarGaleriaSecao(Expression<Func<GaleriaSecao, bool>> filter, Func<IQueryable<GaleriaSecao>, IIncludableQueryable<GaleriaSecao, object>> include = null);
        Task<GaleriaSecao?> EditarGaleriaSecao(GaleriaSecao secao);
        void ExcluirGaleriaSecao(GaleriaSecao secao);
    }
}
