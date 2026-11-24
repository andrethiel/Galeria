using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Response
{
    public class R2UploadResult
    {
        public string Key { get; set; }
        public string NomeArquivo { get; set; }
        public string NomeOriginal { get; set; }
        public long Tamanho { get; set; }
        public string ContentType { get; set; }
    }
}
