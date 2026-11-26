using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class GaleriaSecao: Base
    {
        public int GaleriaId { get; set; }
        public string Nome { get; set; }
        public Galeria Galeria { get; set; }
        public List<GaleriaImagem> GaleriaImagem { get; set; }

        protected GaleriaSecao()
        {
        }

        public static GaleriaSecao Criar(int galeriaId, string nome)
        {
            return new GaleriaSecao
            {                
                GaleriaId = galeriaId,
                Nome = nome,
            };
        }
    }
}
