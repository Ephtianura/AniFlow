namespace AnimeApp.Application.Dto.External
{
    /// <summary>
    /// Набір серій, згрупованих за озвучкою.
    /// Використовується для структурування епізодів по різних варіантах озвучення.
    /// </summary>
    /// <param name="Voice">Назва озвучки або дубляжу.</param>
    /// <param name="Episodes">Список серій, що належать до цієї озвучки.</param>
    public record VoiceEpisodeSet(
        string Voice,
        List<EpisodeInfo> Episodes
    );

    /// <summary>
    /// Інформація про один епізод аніме.
    /// Містить базові дані для відображення та відтворення відео.
    /// </summary>
    /// <param name="Episode">Номер епізоду в сезоні.</param>
    /// <param name="VideoUrl">Посилання на відео.</param>
    /// <param name="Poster">Зображення-прев’ю епізоду (може бути відсутнім).</param>
    /// <param name="Subtitles">Чи доступні субтитри для цього епізоду.</param>
    public record EpisodeInfo(
        int Episode,
        string VideoUrl,
        string? Poster,
        bool Subtitles
    );
}