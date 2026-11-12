using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Response
{
    public class ClienteResponse
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
    }
}
