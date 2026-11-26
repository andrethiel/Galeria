namespace Galeria.Application.DTOs.Response
{
    public class PaginacaoResponse<T>
    {
        public List<T> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool HasNextPage { get; set; }
        public int TotalItems { get; set; }
    }
}
