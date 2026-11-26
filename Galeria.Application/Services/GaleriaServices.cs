using Galeria.Application.DTOs;
using Galeria.Application.DTOs.Request;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Helpers;
using Galeria.Application.Interfaces;
using Galeria.Application.Utils;
using Galeria.Domain.Enums;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using LinqKit;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Text;

namespace Galeria.Application.Services
{
    public class GaleriaServices(
        IGaleriaRepository _galeriaRepository,
        IOptions<CloudflareR2Settings> settings,
        IR2StorageService _r2StorageService) : IGaleriaServices
    {
        public async Task<GaleriaResponse> CadastroGaleria(GaleriaCreateRequest model)
        {
            var galeria = await _galeriaRepository.FiltrarGalerias(g => g.ClienteId == model.ClienteId && g.Status == Domain.Enums.StatusGaleria.Publicada);

            if (galeria.Any())
            {
                throw new ServicesException("Cliente já possui uma galeria publicada.");
            }

            var galeriaModel = Domain.Models.Galeria.Criar(model.ClienteId, null, model.Status, null, null, null, null);

            var insertedGaleria = await _galeriaRepository.CadastroGaleria(galeriaModel);
            return MapResponse(insertedGaleria);
        }

        public async Task<GaleriaResponse> EditarGaleria(GaleriaEditRequest model)
        {
            var galeria = await _galeriaRepository.ObterGaleriaPorId(model.Id, x => x.Include(y => y.Cliente));

            if (galeria == null)
                throw new ServicesException("Galeria não encontrada");

            if (galeria.Status == Domain.Enums.StatusGaleria.Publicada)
                throw new ServicesException("Galeria já publicada");

            galeria.Atualizar(model.Id, SlugHelper.Gerar($"{galeria.Cliente.Nome}-{galeria.Cliente.TipoEnsaio.ToString()}"), galeria.Status, Convert.ToDateTime(model.DataPublicacao), Convert.ToDateTime(model.DataExpiracao));

            var galeriaEntity = await _galeriaRepository.EditarGaleria(galeria);

            return MapResponse(galeriaEntity);
        }

        public async Task<GaleriaResponse> GaleriaPublicar(int idGaleria)
        {
            var galeria = await _galeriaRepository.ObterGaleriaPorId(idGaleria, x => x.Include(y => y.Cliente));

            if (galeria == null)
                throw new ServicesException("Galeria não encontrada");

            if (galeria.Slug == null)
                throw new ServicesException("Galeria sem nome");

            galeria.PublicarGaleria(idGaleria);

            var galeriaEntity = await _galeriaRepository.EditarGaleria(galeria);

            return MapResponse(galeriaEntity);
        }

        public async Task<PaginacaoResponse<GaleriaResponse>> ListarGalerias(int page, int pageSize)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var resultado = await _galeriaRepository.ListarGalerias(x => x.Include(y => y.GaleriaSecao).ThenInclude(x => x.GaleriaImagem), page, pageSize);
            return new PaginacaoResponse<GaleriaResponse>
            {
                Items = resultado.Select(galeria => MapResponse(galeria)).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalItems = resultado.Count(),
                HasNextPage = page * pageSize < resultado.Count(),
            };
        }

        public async Task<GaleriaResponse?> ObterGaleria(int id)
        {
            var galerias = await _galeriaRepository.FiltrarGalerias(
                galeria => galeria.Id == id,
                query => query.Include(x => x.Cliente).Include(galeria => galeria.GaleriaSecao));

            var galeria = galerias.FirstOrDefault();
            return galeria is null ? null : MapResponse(galeria);
        }

        private GaleriaResponse MapResponse(Domain.Models.Galeria model, bool incluirCliente = true)
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
                TotalImagens = model.GaleriaSecao is null ? 0 : TotalImagens(model.GaleriaSecao),
                ImagemPrincipal = model.GaleriaSecao is null ? "" : ImagemPrincipal(model.GaleriaSecao),
                Secoes = model.GaleriaSecao?.Select(secao => new GaleriaSecaoResponse
                {
                    Id = secao.Id,
                    Guid = secao.Guid,
                    Nome = secao.Nome,
                }).ToList() ?? new List<GaleriaSecaoResponse>(),
                Cliente = !incluirCliente || model.Cliente is null ? null : new ClienteResponse
                {
                    Id = model.Cliente.Id,
                    Guid = model.Cliente.Guid,
                    Nome = model.Cliente.Nome,
                    Email = model.Cliente.Email,
                }
            };
        }

        private string ImagemPrincipal(List<GaleriaSecao> secoes)
        {
            var imagemPrincipal = secoes?
                .SelectMany(secao => secao.GaleriaImagem ?? new List<GaleriaImagem>())
                .FirstOrDefault(x => x.ImagemPrincipal == true);

            // Se não houver uma imagem marcada, usa a primeira imagem disponível.
            imagemPrincipal ??= secoes?
                .SelectMany(secao => secao.GaleriaImagem ?? new List<GaleriaImagem>())
                .FirstOrDefault();
            if (imagemPrincipal is null) {
                return string.Empty;
            }

            return ArquivoImagem.FormataURLR2(imagemPrincipal.NomeArquivo, settings.Value.URLApi);
        }
        private int TotalImagens(List<GaleriaSecao> galerias)
        {
            return galerias?.Sum(x => x.GaleriaImagem?.Count ?? 0) ?? 0;
        }

        public async Task ExcluirGaleria(int id)
        {
            var galeria = await _galeriaRepository.ObterGaleriaPorId(id, x => x.Include(x => x.GaleriaSecao).ThenInclude(x => x.GaleriaImagem));

            if (galeria is null)
                throw new ServicesException("Galeria não encontrada");

            var arquivos = galeria.GaleriaSecao
                .SelectMany(secao => secao.GaleriaImagem ?? new List<GaleriaImagem>())
                .Select(imagem => imagem.NomeArquivo)
                .ToList();

            await _galeriaRepository.ExcluirGaleria(galeria);

            foreach (var arquivo in arquivos)
                await _r2StorageService.DeleteAsync(arquivo);
        }

        public async Task<PaginacaoResponse<GaleriaResponse>> FiltrarGalerias(GaleriaRequest model)
        {
            var filter = PredicateBuilder.New<Domain.Models.Galeria>(true);

            if (!string.IsNullOrEmpty(model.NomeCliente))
                filter = filter.And(x => x.Cliente.Nome.Contains(model.NomeCliente));

            if (model.TipoEnsaio.HasValue)
                filter = filter.And(x => x.Cliente.TipoEnsaio == (TipoEnsaio)model.TipoEnsaio.Value);

            if (model.DataPublicacao.HasValue)
                filter = filter.And(x => x.DataPublicacao == model.DataPublicacao);

            var galerias = await _galeriaRepository.FiltrarGalerias(
                filter,
                x => x.Include(y => y.GaleriaSecao).ThenInclude(x => x.GaleriaImagem));

            if (!galerias.Any())
                return new PaginacaoResponse<GaleriaResponse>();



            return new PaginacaoResponse<GaleriaResponse>
            {
                Items = galerias.Select(galeria => MapResponse(galeria, false)).ToList()
            };
        }

        public async Task<GaleriaCliente> GaleriaCliente(string senha, string token)
        {
            var galerias = await _galeriaRepository.FiltrarGalerias(x => x.SenhaHash == senha && x.Token == token, y => y.Include(x => x.GaleriaSecao).ThenInclude(x => x.GaleriaImagem));

            if (!galerias.Any())
                throw new ServicesException("Galeria não encontrada");

            return galerias.Select(x => new GaleriaCliente
            {
                ImagemPrincipal = ImagemPrincipal(x.GaleriaSecao),
                Secoes = x.GaleriaSecao?.Select(secao => new GaleriaClienteSecaoResponse
                {
                    Nome = secao.Nome,
                    Imagens = secao.GaleriaImagem?.Select(imagem => new GaleriaClienteImagemResponse
                    {
                        Url = ArquivoImagem.FormataURLR2(imagem.NomeArquivo, settings.Value.URLApi)
                    }).ToList() ?? new List<GaleriaClienteImagemResponse>()
                }).ToList() ?? new List<GaleriaClienteSecaoResponse>()
            }).FirstOrDefault();
        }
    }
}
