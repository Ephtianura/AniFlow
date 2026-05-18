using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.App
{
    public interface IGengesFactory
    {
        Task<List<Genre>> BuildGenresFromRaw(TagsDto raw);
        Task<List<Genre>> GetGenresFromRaw(List<GenreRawDto> raw);
        Task<CreateUpdateResult> ImportGenresFromRaw(TagsDto raw);
        Task<CreateUpdateResult> ImportGenres();
    }
}