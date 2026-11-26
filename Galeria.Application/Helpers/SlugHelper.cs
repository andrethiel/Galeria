using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Galeria.Application.Helpers
{
    public static class SlugHelper
    {
        public static string Gerar(string texto)
        {
            texto = texto.ToLowerInvariant();

            var normalized = texto.Normalize(NormalizationForm.FormD);

            var sb = new StringBuilder();

            foreach (var c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);

                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            var semAcentos = sb.ToString();

            semAcentos = Regex.Replace(semAcentos, @"[^a-z0-9\s-]", "");

            semAcentos = Regex.Replace(semAcentos, @"\s+", "-");

            semAcentos = Regex.Replace(semAcentos, @"-+", "-");

            return semAcentos.Trim('-');
        }
    }
}
