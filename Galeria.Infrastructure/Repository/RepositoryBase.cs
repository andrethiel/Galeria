using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Galeria.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Infrastructure.Repository
{
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : Base
    {
        private readonly DataContext _context;
        public readonly DbSet<TEntity> _DbSet;
        public RepositoryBase(DataContext context)
        {
            _context = context;
            _DbSet = _context.Set<TEntity>();
        }
        private IQueryable<TEntity> AplicarInclude(IQueryable<TEntity> query, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include)
        {
            if (include != null)
            {
                query = include(query);
            }

            return query;
        }

        private IQueryable<TEntity> CriarQuery(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null)
        {
            IQueryable<TEntity> query = _DbSet;

            return AplicarInclude(query, include);
        }

        public async Task<TEntity?> Editar(TEntity model)
        {
            _DbSet.Update(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<List<TEntity>> Filtrar(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null) =>
            await CriarQuery(include).Where(filter).AsNoTracking().ToListAsync();

        public async Task<TEntity?> Inserir(TEntity model)
        {
            _DbSet.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public TEntity Adicionar(TEntity model)
        {
            _DbSet.Add(model);
            return model;
        }

        public async Task<List<TEntity>> InserirRange(List<TEntity> models)
        {
            _DbSet.AddRange(models);
            await _context.SaveChangesAsync();
            return models;
        }

        public async Task<List<TEntity>> Listar(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null) =>
            await CriarQuery(include).AsNoTracking().ToListAsync();

        public async Task<List<TEntity>> ListarPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null) => 
            await CriarQuery(include).Where(x => x.Id == id).AsNoTracking().ToListAsync();

        public async Task<TEntity?> ObterPorGuid(Guid Guid, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null) =>
            await CriarQuery(include).AsNoTracking().FirstOrDefaultAsync(x => x.Guid == Guid);

        public async Task<TEntity?> ObterPorId(int id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null) =>
            await CriarQuery(include).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    }
}
