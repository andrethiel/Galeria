using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.Exceptions
{
    public class ServicesException : Exception
    {
        public ServicesException(string message) : base(message)
        {
        }
        public ServicesException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
