using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Infrastructure.Repository
{
    public class GaleriaSecaoRepository(IRepositoryBase<GaleriaSecao> _repositoryBase) : IGaleriaSecaoRepository
    {
        public GaleriaSecao AdicionarGaleriaSecao(GaleriaSecao galeriaSecao) => _repositoryBase.Adicionar(galeriaSecao);

        public async Task<List<GaleriaSecao>> FiltrarGaleriaSecao(Expression<Func<GaleriaSecao, bool>> filter, Func<IQueryable<GaleriaSecao>, IIncludableQueryable<GaleriaSecao, object>> include = null) => 
            await _repositoryBase.Filtrar(filter, include);

        public Task<GaleriaSecao> ObterGaleriaSecaoPorId(int id, Func<IQueryable<GaleriaSecao>, IIncludableQueryable<GaleriaSecao, object>> include = null) => _repositoryBase.ObterPorId(id, include);

        public Task<GaleriaSecao?> EditarGaleriaSecao(GaleriaSecao secao) => _repositoryBase.Editar(secao);

    }
}
