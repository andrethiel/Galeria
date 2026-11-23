using Galeria.Application.DTOs.Request.Create;
using Galeria.Application.DTOs.Request.Edit;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Domain.Interfaces;
using Galeria.Domain.Models;
using Galeria.Application.Utils;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Galeria.Application.Services
{
    public class SecaoServices(
        IGaleriaSecaoRepository _galeriaSecaoRepository,
        IGaleriaImagemRepository _galeriaImagemRepository,
        IUnitOfWork _unitOfWork) : ISecaoServices
    {
        public async Task<GaleriaSecaoResponse> CadastrarSecao(SecaoCreateRequest model)
        {
            var filter = await _galeriaSecaoRepository.FiltrarGaleriaSecao(x => x.Nome == model.Nome && x.GaleriaId == model.GaleriaId);

            if(filter.Any())
                throw new ServicesException("Já existe uma seção com o mesmo nome para esta galeria.");

            var galeriaSecao = GaleriaSecao.Criar(model.GaleriaId, model.Nome);
            var insertedGaleriaSecao = _galeriaSecaoRepository.AdicionarGaleriaSecao(galeriaSecao);
            await _unitOfWork.SaveChangesAsync();

            return MapResponse(insertedGaleriaSecao);
        }

        public async Task<GaleriaSecaoResponse> EditarSecao(SecaoEditRequest model)
        {
            var secao = await _galeriaSecaoRepository.ObterGaleriaSecaoPorId(model.Id);
            if (secao is null)
                throw new ServicesException("Seção não encontrada.");

            secao.Nome = model.Nome.Trim();
            var secaoEditada = await _galeriaSecaoRepository.EditarGaleriaSecao(secao);
            return MapResponse(secaoEditada);
        }

        public async Task<GaleriaSecaoResponse> ExcluirSecao(int id)
        {
            var secao = await _galeriaSecaoRepository.ObterGaleriaSecaoPorId(id, x => x.Include(x => x.GaleriaImagem));
            if (secao is null)
                throw new ServicesException("Seção não encontrada.");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                foreach (var imagem in secao.GaleriaImagem)
                    _galeriaImagemRepository.ExcluirGaleriaImagem(imagem);

                _galeriaSecaoRepository.ExcluirGaleriaSecao(secao);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }

            foreach (var imagem in secao.GaleriaImagem)
                ArquivoImagem.DeletaImagem(imagem.NomeArquivo);

            return MapResponse(secao);
        }

        private GaleriaSecaoResponse MapResponse(GaleriaSecao model)
        {
            return new GaleriaSecaoResponse
            {
                Id = model.Id,
                Guid = model.Guid,
                Nome = model.Nome
            };
        }
    }
}
