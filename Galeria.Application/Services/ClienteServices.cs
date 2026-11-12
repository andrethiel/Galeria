using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Services
{
    public class ClienteServices(IClienteRepository _clienteRepository) : IClienteServices
    {
        public async Task<ClienteResponse> InserirCliente(ClienteCreateRequest model)
        {
            var cliente = await _clienteRepository.FiltrarCliente(c => c.Email == model.Email && c.Nome == model.Nome);

            if(!cliente.Any())
            {
                throw new ServicesException("Cliente já cadastrado.");
            }

            var clienteModel = Cliente.Criar(model.Nome, model.Email, model.Telefone);

            var insertedCliente = await _clienteRepository.InserirCliente(clienteModel);
            return MapResponse(insertedCliente);
        }

        private ClienteResponse MapResponse(Cliente model)
        {
            return new ClienteResponse
            {
                Id = model.Id,
                Nome = model.Nome,
                Email = model.Email,
                Telefone = model.Telefone
            };
        }
    }
}
