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
    public class GaleriaServices(IGaleriaRepository _galeriaRepository) : IGaleriaServices
    {
        public async Task<GaleriaResponse> CadastroGaleria(GaleriaCreateRequest model)
        {
            var galeria = await _galeriaRepository.FiltrarGalerias(g => g.ClienteId == model.ClienteId && g.Status == Domain.Enums.StatusGaleria.Publicada);

            if(galeria.Any())
            {
                throw new ServicesException("Cliente já possui uma galeria publicada.");
            }

            var galeriaModel = Domain.Models.Galeria.Criar(model.ClienteId, model.Slug, model.Status, null, null, null, null);

            var insertedGaleria = await _galeriaRepository.CadastroGaleria(galeriaModel);
            return MapResponse(insertedGaleria);
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
                SenhaHash = model.SenhaHash,
                Token = model.Token,
                DataPublicacao = model.DataPublicacao,
                DataExpiracao = model.DataExpiracao
            };
        }
    }
}
