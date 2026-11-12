using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Domain.Interfaces
{
    public interface IRepositoryBase<TEntity>
    {
        Task<TEntity?> Inserir(TEntity model);
        Task<List<TEntity>> InserirRange(List<TEntity> model);
        Task<TEntity?> Editar(TEntity model);
        Task<List<TEntity>> Listar(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<List<TEntity>> ListarPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<TEntity?> ObterPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<TEntity?> ObterPorGuid(Guid Guid, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        //Task<TEntity?> ObterPorTenant(int tenantId);
        Task<List<TEntity>> Filtrar(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
    }
}
