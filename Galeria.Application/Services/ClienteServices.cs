using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using Galeria.Application.Helpers;
using Galeria.Application.DTOs.Request.Edit;

namespace Galeria.Application.Services
{
    public class ClienteServices(
        IClienteRepository _clienteRepository,
        IGaleriaRepository _galeriaRepository,
        IGaleriaSecaoRepository _galeriaSecaoRepository,
        IUnitOfWork _unitOfWork) : IClienteServices
    {
        public async Task<ClienteResponse> InserirCliente(ClienteCreateRequest model)
        {
            var cliente = await _clienteRepository.FiltrarCliente(c => c.Email == model.Email && c.Nome == model.Nome);

            if(cliente.Any())
            {
                throw new ServicesException("Cliente já cadastrado.");
            }

            var clienteModel = Cliente.Criar(model.Nome, model.Email, model.Telefone);

            var insertedCliente = await _clienteRepository.InserirCliente(clienteModel);
            return MapResponse(insertedCliente);
        }

        public async Task<ClienteGaleriaSessaoResponse> InserirClienteComGaleria(ClienteGaleriaCreateRequest model)
        {
            var clienteExistente = await _clienteRepository.FiltrarCliente(c => c.Email == model.Email);

            if (clienteExistente.Any())
            {
                throw new ServicesException("Cliente já cadastrado.");
            }

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var cliente = Cliente.Criar(model.Nome, model.Email, model.Telefone);
                var insertedCliente = _clienteRepository.AdicionarCliente(cliente);
                await _unitOfWork.SaveChangesAsync();

                var galeria = Domain.Models.Galeria.Criar(
                    insertedCliente.Id,
                    null,
                    StatusGaleria.Rascunho,
                    GeradorSeguranca.GerarSenha(),
                    GeradorSeguranca.GerarToken(),
                    null,
                    null);

                var galeriaModel = _galeriaRepository.AdicionarGaleria(galeria);
                await _unitOfWork.SaveChangesAsync();

                var secao = GaleriaSecao.Criar(galeriaModel.Id, "Seção Inicial");

                var insertedSecao = _galeriaSecaoRepository.AdicionarGaleriaSecao(secao);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitTransactionAsync();

                return new ClienteGaleriaSessaoResponse
                {
                    Cliente = MapResponse(cliente),
                    Galeria = MapGaleriaResponse(galeriaModel),
                    GaleriaSecao = MapGaleriaSecaoResponse(insertedSecao)
                };
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<ClienteResponse> EditarCliente(ClienteEditRequest model)
        {
            var cliente = await _clienteRepository.ObterClientePorId(model.Id);

            if (cliente == null)
            {
                throw new ServicesException("Cliente não encontrado.");
            }

            var emailCliente = await _clienteRepository.FiltrarCliente(x => x.Email == model.Email);

            if (emailCliente.Where(x => x.Id != model.Id).Any())
            {
                throw new ServicesException("Já existe um email cadastrado");
            }

            var telefone = model.Telefone.Replace("/\\D/g", "");

            cliente.Atualizar(model.Nome, model.Email,telefone);

            var clienteAtualizado = await _clienteRepository.EditarCliente(cliente);

            return MapResponse(clienteAtualizado);
        }

        private ClienteResponse MapResponse(Cliente model)
        {
            return new ClienteResponse
            {
                Id = model.Id,
                Guid = model.Guid,
                Nome = model.Nome,
                Email = model.Email,
                Telefone = model.Telefone
            };
        }

        private GaleriaResponse MapGaleriaResponse(Domain.Models.Galeria model)
        {
            return new GaleriaResponse
            {
                Id = model.Id,
                Guid = model.Guid,
                ClienteId = model.ClienteId,
                Slug = model.Slug,
                Status = model.Status,
                SenhaHash = model.SenhaHash,
                Token = model.Token,
                DataPublicacao = model.DataPublicacao,
                DataExpiracao = model.DataExpiracao
            };
        }
        private GaleriaSecaoResponse MapGaleriaSecaoResponse(GaleriaSecao model)
        {
            return new GaleriaSecaoResponse
            {
                Id = model.Id,
                Guid = model.Guid,
                Nome = model.Nome
            };
        }

        public List<SelectItemtResponse<int>> ObterTipoEnsaios()
        {
            var lista = Enum.GetValues<TipoEnsaio>().Select(x => new SelectItemtResponse<int>
            {
                Label = EnumDescription.GetDescription(x),
                Value = (int)x
            }).ToList();

            return lista;
        }
    }
}
