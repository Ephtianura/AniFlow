using AniFlow.Application.Contracts.Commands;

namespace AniFlow.Application.Contracts.App
{
    public interface IAnimeImportService
    {
        Task ParseNewAnime(ParseNewAnimeCommand request);
        Task UpdateTechFields(UpdateAnimeCommand context);
    }
}