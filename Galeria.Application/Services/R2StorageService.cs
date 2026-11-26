using Amazon.S3;
using Amazon.S3.Model;
using Galeria.Application.DTOs;
using Galeria.Application.DTOs.Response;
using Galeria.Application.Exceptions;
using Galeria.Application.Interfaces;
using Galeria.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Text;

namespace Galeria.Application.Services
{
    public class R2StorageService : IR2StorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly CloudflareR2Settings _settings;

        public R2StorageService(
            IAmazonS3 s3Client,
            IOptions<CloudflareR2Settings> settings)
        {
            _s3Client = s3Client;
            _settings = settings.Value;
        }

        public async Task DeleteAsync(string nomeArquivo)
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = nomeArquivo
            };

            await _s3Client.DeleteObjectAsync(request);
        }

        public async Task<R2UploadResult> UploadAsync(IFormFile arquivo, string pasta)
        {
            if (arquivo == null || arquivo.Length == 0)
                throw new ArgumentException("Arquivo inválido.");

            var extensao = Path.GetExtension(arquivo.FileName).ToLower();
            var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            if (!extensoesPermitidas.Contains(extensao))
                throw new Exception("Formato de imagem não suportado.");

            if (arquivo.Length > 20 * 1024 * 1024)
                throw new ArgumentException("Arquivo excede 20 MB.");

            var contentType = extensao switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                _ => throw new ArgumentException("Formato inválido.")
            };

            var nomeArquivo = $"{Guid.NewGuid():N}{extensao}";

            var key = $"{pasta.Trim('/')}/{nomeArquivo}";

            await using var stream = arquivo.OpenReadStream();


            var request = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                InputStream = stream,
                ContentType = contentType,
                DisablePayloadSigning = true,
                DisableDefaultChecksumValidation = true
            };

            await _s3Client.PutObjectAsync(request);

            return new R2UploadResult
            {
                Key = key,
                NomeArquivo = nomeArquivo,
                Tamanho = arquivo.Length,
                ContentType = contentType,
                NomeOriginal = arquivo.FileName
            };
        }
    }
}
