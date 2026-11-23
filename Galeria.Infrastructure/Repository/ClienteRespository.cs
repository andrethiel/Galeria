using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Galeria.Infrastructure.Repository
{
    public class ClienteRepository(IRepositoryBase<Cliente> _repositoryBase) : IClienteRepository
    {
        public async Task<List<Cliente>> FiltrarCliente(Expression<Func<Cliente, bool>> filter, Func<IQueryable<Cliente>, IIncludableQueryable<Cliente, object>> include = null) =>
           await _repositoryBase.Filtrar(filter, include);

        public async Task<Cliente> InserirCliente(Cliente model) => await _repositoryBase.Inserir(model);

        public async Task<Cliente> EditarCliente(Cliente model) => await _repositoryBase.Editar(model);

        public Cliente AdicionarCliente(Cliente model) => _repositoryBase.Adicionar(model);

        public async Task<Cliente> ObterClientePorId(int id) => await _repositoryBase.ObterPorId(id);
    }   
}
