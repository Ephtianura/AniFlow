namespace AnimeApp.Application.Dto.Requests.Anime
{
    /// <summary>
    /// Результат оновлення пов'язаних аніме.
    /// </summary>
    /// <param name="Current">
    /// Поточний список зв'язків після застосування змін.
    /// </param>
    /// <param name="Updated">
    /// Зв'язки, які були додані або змінили свій тип.
    /// </param>
    /// <param name="Deleted">
    /// Зв'язки, які були видалені.
    /// </param>
    public record RelatedUpdateResult
        (
            List<RelatedAnimeItem> Current, // Актуальний список
            List<RelatedAnimeItem> Updated,
            List<RelatedAnimeItem> Deleted
        );
}
