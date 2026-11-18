using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Interfaces;
using Galeria.Application.Utils;
using Galeria.Application.Exceptions;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Galeria.Application.Services
{
    public class GaleriaImagemServices(
        IGaleriaImagemRepository galeriaImagemRepository,
        IGaleriaSecaoRepository galeriaSecaoRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor) : IGaleriaImagemServices
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

            var nomeArquivo = string.Empty;
            await unitOfWork.BeginTransactionAsync();

            try
            {
                nomeArquivo = ArquivoImagem.Imagem(model.Arquivo);

                var imagem = GaleriaImagem.Criar(model.GaleriaSecaoId, nomeArquivo);

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
                ArquivoImagem.DeletaImagem(nomeArquivo);
                throw;
            }

        }

        public async Task<List<GaleriaImagemResponse>> ListarPorSecao(int galeriaId, int galeriaSecaoId)
        {
            var secao = await galeriaSecaoRepository.ObterGaleriaSecaoPorId(galeriaSecaoId, x => x.Include(g => g.GaleriaImagem));
            if (secao is null || secao.GaleriaId != galeriaId)
                throw new ServicesException("A seção não pertence à galeria informada.");

            var imagens = new List<GaleriaImagemResponse>();

            foreach (var imagem in secao.GaleriaImagem.OrderBy(x => x.Id))
            {
                imagens.Add(new GaleriaImagemResponse
                {
                    Id = imagem.Id,
                    Guid = imagem.Guid,
                    GaleriaId = galeriaId,
                    GaleriaSecaoId = imagem.GaleriaSecaoId,
                    NomeArquivo = imagem.NomeArquivo,
                    Url = ArquivoImagem.FormataURL(imagem.NomeArquivo, httpContextAccessor),
                });
            }

            return imagens;
        }
    }
}
