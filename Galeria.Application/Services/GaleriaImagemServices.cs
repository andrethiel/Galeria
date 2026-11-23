using Amazon.S3;
using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Application.Utils;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Galeria.Application.Services
{
    public class GaleriaImagemServices(
        IGaleriaImagemRepository galeriaImagemRepository,
        IGaleriaSecaoRepository galeriaSecaoRepository,
        IGaleriaRepository galeriaRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor,
        IR2StorageService _r2StorageService) : IGaleriaImagemServices
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

            await unitOfWork.BeginTransactionAsync();

            try
            {
                var nomeArquivo = await _r2StorageService.UploadAsync(model.Arquivo, galeriaCliente.Cliente.Nome);

                var imagem = GaleriaImagem.Criar(model.GaleriaSecaoId, nomeArquivo.Key);

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
                    Url = ArquivoImagem.FormataURL(imagemInserida.NomeArquivo, httpContextAccessor),
                };
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                //ArquivoImagem.DeletaImagem(nomeArquivo);
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
                        Url = ArquivoImagem.FormataURL(imagem.NomeArquivo, httpContextAccessor),
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

            ArquivoImagem.DeletaImagem(imagem.NomeArquivo);

            return new GaleriaImagemResponse
            {
                Id = imagem.Id,
                Guid = imagem.Guid,
                GaleriaId = galeriaId,
                GaleriaSecaoId = imagem.GaleriaSecaoId,
                NomeArquivo = imagem.NomeArquivo,
            };
        }
    }
}
