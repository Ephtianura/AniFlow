namespace AniFlow.Application.Contracts.Commands
{
    public record UpdateAnimeCommand(
        int MoonId,
        DateTime DatePublished
    );
}