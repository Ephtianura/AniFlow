using AnimeApp.Application.Contracts.Commands;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeImportService
    {
        Task ParseNewAnime(ParseNewAnimeCommand request);
        Task UpdateTechFields(UpdateAnimeCommand context);
    }
}