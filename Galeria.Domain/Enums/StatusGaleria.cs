using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Galeria.Domain.Enums
{
    public enum StatusGaleria
    {
        [Description("Rascunho")]
        Rascunho = 1,
        [Description("Publicada")]
        Publicada = 2
    }
}
