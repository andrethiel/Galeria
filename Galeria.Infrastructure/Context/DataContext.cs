using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Infrastructure.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().Ignore(x => x.DataCriacao).Ignore(x => x.DataExclusao).Ignore(x => x.DataAtualizacao);
        }

        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Domain.Models.Galeria> Galeria { get; set; }
    }
}
