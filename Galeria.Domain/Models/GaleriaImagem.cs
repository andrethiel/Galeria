using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class GaleriaImagem : Base
    {
        public int GaleriaSecaoId { get; set; }
        public string NomeArquivo { get; set; }
        public bool? ImagemPrincipal { get; set; }
        public string NomeOriginal { get; set; }

        private GaleriaImagem() { }

        public static GaleriaImagem Criar(int galeriaSecaoId, string nomeArquivo, string nomeOriginal, bool? imagemPrincipal)
        {
            return new GaleriaImagem
            {
                GaleriaSecaoId = galeriaSecaoId,
                NomeArquivo = nomeArquivo,
                NomeOriginal = nomeOriginal,
                ImagemPrincipal = imagemPrincipal
            };
        }

        public void AtualizarPrincipal(int id)
        {
            Id = id;
            ImagemPrincipal = true;
        }

        public void RemoverPrincipal()
        {
            ImagemPrincipal = null;
        }
    }
}
