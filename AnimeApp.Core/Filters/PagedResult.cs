namespace AnimeApp.Core.Filters
{
    public class PagedResult<T>(
        IReadOnlyList<T> items,
        int totalCount,
        int page,
        int pageSize)
    {
        public IReadOnlyList<T> Items { get; } = items;
        public int TotalCount { get; } = totalCount;
        public int Page { get; } = page;
        public int PageSize { get; } = pageSize;
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);

        public bool HasNext => Page < TotalPages;
        public bool HasPrevious => Page > 1;
    }
}
