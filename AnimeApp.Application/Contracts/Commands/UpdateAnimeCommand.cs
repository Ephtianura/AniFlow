namespace AnimeApp.Application.Contracts.Commands
{
    public record UpdateAnimeCommand(
        int MoonId,
        DateTime DatePublished
    );
}