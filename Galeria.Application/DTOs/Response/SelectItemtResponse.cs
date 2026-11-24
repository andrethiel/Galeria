using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs.Response
{
    public class SelectItemtResponse<TValue>
    {
        public string Label { get; set; }
        public TValue Value { get; set; } = default!;
    }
}
