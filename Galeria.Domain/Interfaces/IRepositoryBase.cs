using Galeria.Domain.Models;
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
        TEntity Adicionar(TEntity model);
        Task<List<TEntity>> InserirRange(List<TEntity> model);
        Task<TEntity?> Editar(TEntity model);
        Task<TEntity?> Deletar(TEntity model);
        Task<List<TEntity>> Listar(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null, int page = 0, int pageSize = 0);
        Task<List<TEntity>> ListarPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<TEntity?> ObterPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<TEntity?> ObterPorGuid(Guid Guid, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null);
        Task<List<TEntity>> Filtrar(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null, int page = 0, int pageSize = 0);
    }
}
