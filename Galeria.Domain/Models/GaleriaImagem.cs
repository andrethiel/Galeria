using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class GaleriaImagem : Base
    {
        public int GaleriaSecaoId { get; set; }
        public string NomeArquivo { get; set; }

        private GaleriaImagem() { }

        public static GaleriaImagem Criar(int galeriaSecaoId, string nomeArquivo)
        {
            return new GaleriaImagem
            {
                GaleriaSecaoId = galeriaSecaoId,
                NomeArquivo = nomeArquivo
            };
        }
    }
}
