using Amazon.S3;
using Galeria.Application.DTOs;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Helpers;
using Galeria.Application.Interfaces;
using Galeria.Application.Utils;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Galeria.Application.Services
{
    public class GaleriaImagemServices(
        IGaleriaImagemRepository galeriaImagemRepository,
        IGaleriaSecaoRepository galeriaSecaoRepository,
        IGaleriaRepository galeriaRepository,
        IUnitOfWork unitOfWork,
        IR2StorageService _r2StorageService, 
        IOptions<CloudflareR2Settings> settings) : IGaleriaImagemServices
    {

        public async Task<GaleriaImagemResponse> Upload(ImagemCreateRequest model)
        {
            if (model.GaleriaId <= 0)
                throw new ServicesException("A galeria informada é inválida.");

            if (model.GaleriaSecaoId <= 0)
                throw new ServicesException("A seção informada é inválida.");

            if (model.Arquivo is null || model.Arquivo.Length == 0)
                throw new ServicesException("Nenhuma imagem foi informada.");

            var secao = await galeriaSecaoRepository.ObterGaleriaSecaoPorId(model.GaleriaSecaoId);
            if (secao is null || secao.GaleriaId != model.GaleriaId)
                throw new ServicesException("A seção não pertence à galeria informada.");

            var galeriaCliente = await galeriaRepository.ObterGaleriaPorId(model.GaleriaId, y => y.Include(cliente => cliente.Cliente));

            var imagemFilter = await galeriaImagemRepository.FiltarImagens(x => x.NomeOriginal == model.Arquivo.FileName && x.GaleriaSecaoId == model.GaleriaSecaoId);

            if (imagemFilter.Any())
                throw new ServicesException("Imagem já inserida");

            await unitOfWork.BeginTransactionAsync();

            var nomeArquivo = new R2UploadResult();

            try
            {
                nomeArquivo = await _r2StorageService.UploadAsync(model.Arquivo, galeriaCliente.ClienteId.ToString());

                var imagem = GaleriaImagem.Criar(model.GaleriaSecaoId, nomeArquivo.Key, nomeArquivo.NomeOriginal, model.ImagemPrincipal);

                var imagemInserida = galeriaImagemRepository.InserirGaleriaImagem(imagem);
                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CommitTransactionAsync();


                return new GaleriaImagemResponse
                {
                    Id = imagemInserida.Id,
                    Guid = imagemInserida.Guid,
                    GaleriaId = model.GaleriaId,
                    NomeArquivo = imagemInserida.NomeArquivo,
                    GaleriaSecaoId = imagemInserida.GaleriaSecaoId,
                    Url = ArquivoImagem.FormataURLR2(imagemInserida.NomeArquivo, settings.Value.URLApi),
                    ImagemPrincipal = imagemInserida.ImagemPrincipal,
                };
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                await _r2StorageService.DeleteAsync(nomeArquivo.Key);
                throw;
            }

        }

        public async Task<List<GaleriaSecaoResponse>> ListarPorSecao(int galeriaId, int galeriaSecaoId)
        {
            var secoes = await galeriaSecaoRepository.FiltrarGaleriaSecao(
                x => x.GaleriaId == galeriaId,
                x => x.Include(g => g.GaleriaImagem));

            if (!secoes.Any(x => x.Id == galeriaSecaoId))
                throw new ServicesException("A seção não pertence à galeria informada.");

            return secoes.Select(secao => new GaleriaSecaoResponse
            {
                Id = secao.Id,
                Guid = secao.Guid,
                Nome = secao.Nome,
                Imagens = secao.GaleriaImagem
                    .OrderBy(imagem => imagem.Id)
                    .Select(imagem => new GaleriaImagemResponse
                    {
                        Id = imagem.Id,
                        Guid = imagem.Guid,
                        GaleriaId = galeriaId,
                        GaleriaSecaoId = secao.Id,
                        NomeArquivo = imagem.NomeArquivo,
                        Url = ArquivoImagem.FormataURLR2(imagem.NomeArquivo, settings.Value.URLApi),
                        ImagemPrincipal = imagem.ImagemPrincipal,
                    })
                    .ToList(),
            }).ToList();
        }

        public async Task<GaleriaImagemResponse> Excluir(int galeriaId, int id)
        {
            var imagem = await galeriaImagemRepository.ObterGaleriaImagem(id);
            if (imagem is null)
                throw new ServicesException("Imagem não encontrada.");

            var secao = await galeriaSecaoRepository.ObterGaleriaSecaoPorId(imagem.GaleriaSecaoId);

            if (secao is null || secao.GaleriaId != galeriaId)
                throw new ServicesException("A imagem não pertence à galeria informada.");

            await unitOfWork.BeginTransactionAsync();
            try
            {
                galeriaImagemRepository.ExcluirGaleriaImagem(imagem);
                await unitOfWork.SaveChangesAsync();
                await unitOfWork.CommitTransactionAsync();
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }

            await _r2StorageService.DeleteAsync(imagem.NomeArquivo);

            return MapResponse(imagem, galeriaId);
        }

        public async Task<GaleriaImagemResponse> ImagemPrincipal(int idImagem)
        {
            var imagem = await galeriaImagemRepository.ObterImagemPorId(idImagem);

            if (imagem == null)
                throw new ServicesException("Imagem não encontrada");

            var imagensDaSecao = await galeriaImagemRepository.ListarPorSecao(imagem.GaleriaSecaoId);
            foreach (var imagemDaSecao in imagensDaSecao.Where(x => x.Id != imagem.Id && x.ImagemPrincipal == true))
            {
                imagemDaSecao.RemoverPrincipal();
                await galeriaImagemRepository.EditarGaleriaImagem(imagemDaSecao);
            }

            imagem.AtualizarPrincipal(imagem.Id);

            var imagemEntity = await galeriaImagemRepository.EditarGaleriaImagem(imagem);

            return MapResponse(imagemEntity);
        }

        public GaleriaImagemResponse MapResponse(GaleriaImagem imagem, int? galeriaId = null)
        {
            return new GaleriaImagemResponse
            {
                Id = imagem.Id,
                Guid = imagem.Guid,
                GaleriaSecaoId = imagem.GaleriaSecaoId,
                NomeArquivo = imagem.NomeArquivo,
                GaleriaId = galeriaId,
                ImagemPrincipal = imagem.ImagemPrincipal,
                Url = ArquivoImagem.FormataURLR2(imagem.NomeArquivo, settings.Value.URLApi),
            };
        }
    }
}
