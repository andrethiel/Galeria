using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Services
{
    public class GaleriaServices(IGaleriaRepository _galeriaRepository) : IGaleriaServices
    {
        public async Task<GaleriaResponse> CadastroGaleria(GaleriaCreateRequest model)
        {
            var galeria = await _galeriaRepository.FiltrarGalerias(g => g.ClienteId == model.ClienteId && g.Status == Domain.Enums.StatusGaleria.Publicada);

            if(galeria.Any())
            {
                throw new ServicesException("Cliente já possui uma galeria publicada.");
            }

            var galeriaModel = Domain.Models.Galeria.Criar(model.ClienteId, null, model.Status, null, null, null, null);

            var insertedGaleria = await _galeriaRepository.CadastroGaleria(galeriaModel);
            return MapResponse(insertedGaleria);
        }

        public async Task<List<GaleriaResponse>> ListarGalerias()
        {
            var galerias = await _galeriaRepository.FiltrarGalerias(
                _ => true,
                query => query.Include(galeria => galeria.GaleriaSecao));
            return galerias.Select(MapResponse).ToList();
        }

        public async Task<GaleriaResponse?> ObterGaleria(int id)
        {
            var galerias = await _galeriaRepository.FiltrarGalerias(
                galeria => galeria.Id == id,
                query => query.Include(x => x.Cliente).Include(galeria => galeria.GaleriaSecao));

            var galeria = galerias.FirstOrDefault();
            return galeria is null ? null : MapResponse(galeria);
        }

        private GaleriaResponse MapResponse(Domain.Models.Galeria model)
        {
            return new GaleriaResponse
            {
                Id = model.Id,
                Guid = model.Guid,
                ClienteId = model.ClienteId,
                Slug = model.Slug,
                Status = model.Status,
                DataPublicacao = model.DataPublicacao,
                DataExpiracao = model.DataExpiracao,
                Secoes = model.GaleriaSecao?.Select(secao => new GaleriaSecaoResponse
                {
                    Id = secao.Id,
                    Guid = secao.Guid,
                    Nome = secao.Nome,
                }).ToList() ?? new List<GaleriaSecaoResponse>(),
                Cliente = model.Cliente is null ? null : new ClienteResponse
                {
                    Id = model.Cliente.Id,
                    Guid = model.Cliente.Guid,
                    Nome = model.Cliente.Nome,
                    Email = model.Cliente.Email,
                }
            };
        }
    }
}
