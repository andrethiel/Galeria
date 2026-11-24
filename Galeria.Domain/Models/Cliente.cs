using Galeria.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class Cliente : Base
    {
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public string Telefone { get; private set; }
        public TipoEnsaio TipoEnsaio { get; set; }

        protected Cliente()
        {
        }

        private Cliente(string nome, string email, string telefone)
        {
            Guid = Guid.NewGuid();
            DataCriacao = DateTime.Now;
            AtualizarDados(nome, email, telefone);
        }

        public static Cliente Criar(string nome, string email, string telefone)
        {
            return new Cliente(nome, email, telefone);
        }

        public void Atualizar(string nome, string email, string telefone)
        {
            AtualizarDados(nome, email, telefone);
            DataAtualizacao = DateTime.Now;
        }

        private void AtualizarDados(string nome, string email, string telefone)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("O nome do cliente é obrigatório.", nameof(nome));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("O e-mail do cliente é obrigatório.", nameof(email));

            Nome = nome.Trim();
            Email = email.Trim();
            Telefone = telefone?.Trim() ?? string.Empty;
        }

    }
}
