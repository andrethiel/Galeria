using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Domain.Interfaces
{
    public interface IClienteRepository
    {
        public Task<Cliente> InserirCliente(Cliente model);
        public Task<List<Cliente>> FiltrarCliente(Expression<Func<Cliente, bool>> filter, Func<IQueryable<Cliente>, IIncludableQueryable<Cliente, object>> include = null);
    }
}
