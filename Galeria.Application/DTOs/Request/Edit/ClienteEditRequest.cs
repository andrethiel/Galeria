using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request.Edit
{
    public class ClienteEditRequest
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
    }
}
