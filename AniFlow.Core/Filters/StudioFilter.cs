public class StudioFilter
{
    public string? Search { get; set; }  // Пошук по імені
    public string? SortBy { get; set; }  // Сортування по "Name"
    public bool SortDesc { get; set; } = false;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}