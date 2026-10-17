using AniFlow.Application.Dto.External;
using AniFlow.Application.Dto.Responses.Anime;
using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.App
{
    public interface IGengesFactory
    {
        Task<List<Genre>> BuildGenresFromRaw(TagsDto raw);
        Task<List<Genre>> GetGenresFromRaw(List<GenreRawDto> raw);
        Task<CreateUpdateResult> ImportGenresFromRaw(TagsDto raw);
        Task<CreateUpdateResult> ImportGenres();
    }
}