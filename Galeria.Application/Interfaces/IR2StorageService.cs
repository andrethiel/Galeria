using Galeria.Application.DTOs.Response;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Interfaces
{
    public interface IR2StorageService
    {
        Task<R2UploadResult> UploadAsync(IFormFile arquivo, string pasta);
        string GerarUrlUpload(string key, string contentType);
    }
}
