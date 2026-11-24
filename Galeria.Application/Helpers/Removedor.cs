using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Galeria.Application.Helpers
{
    public class Removedor
    {
        public static string RemoverAcentos(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return texto;

            var normalized = texto.Normalize(NormalizationForm.FormD);

            var resultado = new string(
                normalized
                    .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    .ToArray()
            );

            return resultado.Normalize(NormalizationForm.FormC);
        }
    }
}
