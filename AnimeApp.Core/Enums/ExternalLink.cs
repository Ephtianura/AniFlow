namespace AnimeApp.Core.Enums
{
    public record ExternalLink(
        string Url,
        string Text,
        string? Type
    );
}