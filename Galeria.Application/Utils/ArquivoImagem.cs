using Microsoft.AspNetCore.Http;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Reflection;
using System.Text;

namespace Galeria.Application.Utils
{
    public class ArquivoImagem
    {
        public static string Imagem(IFormFile arquivo)
        {
            try
            {
                var extensao = Path.GetExtension(arquivo.FileName).ToLower();
                var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };

                if (!extensoesPermitidas.Contains(extensao))
                    throw new Exception("Formato de imagem não suportado.");

                string nomeArquivo = string.Format("{0}", $"{Guid.NewGuid()}.webp");
                string pastaDestino = Path.Combine(Directory.GetCurrentDirectory().Replace("wwwroot", ""), $"Imagens");

                Directory.CreateDirectory(pastaDestino);

                string caminhoCompleto = Path.Combine(pastaDestino, nomeArquivo);

                using var stream = arquivo.OpenReadStream();
                using var bitmap = SKBitmap.Decode(stream);

                if (bitmap == null)
                    throw new Exception("Arquivo de imagem inválido.");

                SKBitmap bitmapFinal = bitmap;
                SKBitmap? bitmapRedimensionado = null;

                try
                {

                    using var image = SKImage.FromBitmap(bitmapFinal);
                    using var data = image.Encode(SKEncodedImageFormat.Webp, 75);
                    using var output = File.Create(caminhoCompleto);

                    data.SaveTo(output);

                    return nomeArquivo;
                }
                finally
                {
                    bitmapRedimensionado?.Dispose();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static string FormataURL(string imagem, IHttpContextAccessor _httpContextAccessor)
        {
            if (string.IsNullOrEmpty(imagem))
            {
                return string.Empty;
            }

            var request = _httpContextAccessor.HttpContext.Request;

            return string.Format("{0}://{1}/Imagens/{2}", request.Scheme, request.Host, imagem);
            //return string.Format("https://api.revendafacilsemijoias.com.br/Imagens/{0}", imagem);
        }

        public static string RemoveURL(string imagem)
        {
            var arquivo = imagem.Split("/");

            return arquivo.Last().Trim();
        }

        public static void DeletaArquivo(string nomeArquivo, string categoria)
        {
            if (string.IsNullOrWhiteSpace(nomeArquivo))
                return;

            var caminho = Path.Combine(Directory.GetCurrentDirectory(), "Imagens", categoria, nomeArquivo);

            if (File.Exists(caminho))
            {
                File.Delete(caminho);
            }
        }

        public static void DeletaImagem(string nomeArquivo)
        {
            if (string.IsNullOrWhiteSpace(nomeArquivo))
                return;

            var pastaDestino = Path.Combine(Directory.GetCurrentDirectory().Replace("wwwroot", ""), "Imagens");
            var caminho = Path.Combine(pastaDestino, nomeArquivo);

            if (File.Exists(caminho))
                File.Delete(caminho);
        }

        public static string GetPastaAssembly()
        {
            string local = Assembly.GetExecutingAssembly().Location;
            return local.Substring(0, local.LastIndexOf(@"\"));
        }

        public static string FormataURLR2(string imagem, string url)
        {
            if (string.IsNullOrEmpty(imagem))
            {
                return string.Empty;
            }

            return string.Format("{0}/{1}", url, imagem);
            //return string.Format("https://api.revendafacilsemijoias.com.br/Imagens/{0}", imagem);
        }

    }
}

