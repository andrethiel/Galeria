using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Request.Create
{
    public class ClienteCreateRequest
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
    }
}
