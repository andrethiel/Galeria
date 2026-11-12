using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Galeria.Domain.Models
{
    public class Base
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime? DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public DateTime? DataExclusao { get; set; }
    }
}
