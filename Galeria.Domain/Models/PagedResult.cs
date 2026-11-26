using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Domain.Models
{
    public class PagedResult<TResult>
    {
        public List<TResult> Items { get; set; } = [];
        public int TotalItems { get; set; }
    }
}
