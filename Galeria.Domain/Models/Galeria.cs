using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class Galeria : Base
    {
        public int ClienteId { get; private set; }
        public string Slug { get; private set; } = string.Empty;
        public StatusGaleria Status { get; private set; }
        public string SenhaHash { get; private set; } = string.Empty;
        public string Token { get; private set; } = string.Empty;
        public DateTime? DataPublicacao { get; private set; }
        public DateTime? DataExpiracao { get; private set; }
        public List<GaleriaSecao> GaleriaSecao { get; set; }

        protected Galeria()
        {
        }

        private Galeria(
            int clienteId,
            string slug,
            StatusGaleria status,
            string senhaHash,
            string token,
            DateTime? dataPublicacao,
            DateTime? dataExpiracao)
        {
            Guid = Guid.NewGuid();
            DataCriacao = DateTime.Now;
            AtualizarDados(clienteId, slug, status, senhaHash, token, dataPublicacao, dataExpiracao);
        }

        public static Galeria Criar(
            int clienteId,
            string slug,
            StatusGaleria status,
            string senhaHash,
            string token,
            DateTime? dataPublicacao,
            DateTime? dataExpiracao)
        {
            return new Galeria(clienteId, slug, status, senhaHash, token, dataPublicacao, dataExpiracao);
        }

        public void Atualizar(
            int clienteId,
            string slug,
            StatusGaleria status,
            string senhaHash,
            string token,
            DateTime? dataPublicacao,
            DateTime? dataExpiracao)
        {
            AtualizarDados(clienteId, slug, status, senhaHash, token, dataPublicacao, dataExpiracao);
            DataAtualizacao = DateTime.Now;
        }

        private void AtualizarDados(
            int clienteId,
            string slug,
            StatusGaleria status,
            string senhaHash,
            string token,
            DateTime? dataPublicacao,
            DateTime? dataExpiracao)
        {
            ClienteId = clienteId;
            Slug = slug?.Trim() ?? string.Empty;
            Status = status;
            SenhaHash = senhaHash?.Trim() ?? string.Empty;
            Token = token?.Trim() ?? string.Empty;
            DataPublicacao = dataPublicacao;
            DataExpiracao = dataExpiracao;
        }
    }
}
