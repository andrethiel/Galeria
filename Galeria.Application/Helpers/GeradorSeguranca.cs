using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Galeria.Application.Helpers
{
    public static class GeradorSeguranca
    {
        private const string CaracteresSenha =
       "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        /// <summary>
        /// Gera uma senha aleatória para download das fotografias.
        /// </summary>
        public static string GerarSenha(int tamanho = 8)
        {
            if (tamanho < 6)
                throw new ArgumentException("A senha deve ter pelo menos 6 caracteres.");

            var senha = new char[tamanho];

            for (int i = 0; i < tamanho; i++)
            {
                int indice = RandomNumberGenerator.GetInt32(
                    CaracteresSenha.Length
                );

                senha[i] = CaracteresSenha[indice];
            }

            return new string(senha);
        }

        /// <summary>
        /// Gera um token criptograficamente seguro para acesso à galeria.
        /// </summary>
        public static string GerarToken()
        {
            byte[] bytes = RandomNumberGenerator.GetBytes(32);

            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .TrimEnd('=');
        }
    }
}
