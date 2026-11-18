using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Galeria.Domain.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Infrastructure.Context
{
    public class DataContext : DbContext, IUnitOfWork
    {
        private IDbContextTransaction? _transaction;
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().Ignore(x => x.DataCriacao).Ignore(x => x.DataExclusao).Ignore(x => x.DataAtualizacao);
            modelBuilder.Entity<Domain.Models.Galeria>().Ignore(x => x.DataExclusao);
            modelBuilder.Entity<GaleriaSecao>().Ignore(x => x.DataExclusao);
            modelBuilder.Entity<GaleriaImagem>().Ignore(x => x.DataCriacao).Ignore(x => x.DataExclusao).Ignore(x => x.DataAtualizacao);
            modelBuilder.Entity<Domain.Models.Galeria>()
                .Property(x => x.Status)
                .HasConversion<byte>();
        }

        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Domain.Models.Galeria> Galeria { get; set; }
        public DbSet<GaleriaSecao> GaleriaSecao { get; set; }
        public DbSet<GaleriaImagem> GaleriaImagem { get; set; }


        public async Task BeginTransactionAsync()
        {
            _transaction = await Database.BeginTransactionAsync();
        }

        public Task<int> SaveChangesAsync() => base.SaveChangesAsync();

        public async Task CommitTransactionAsync()
        {
            if (_transaction is null) return;
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction is null) return;
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
}
