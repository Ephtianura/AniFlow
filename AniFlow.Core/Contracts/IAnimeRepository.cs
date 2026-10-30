using AniFlow.Core.Filters;
using AniFlow.Core.Models;

namespace AniFlow.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task<Anime?> GetByIdAsync(int id, CancellationToken ct);
        Task<Anime?> GetFullByIdAsync(int id, CancellationToken ct);
        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter, CancellationToken ct);

        /// <summary> Повертає рандомне аніме </summary>
        Task<Anime?> GetRandomAsync(CancellationToken ct);
        Task<string> GetRandomSlugAsync();
        Task<List<int>> GetAllMixedIdsAsync(CancellationToken ct);

        void Add(Anime anime);
        void Update(Anime anime);
        Task DeleteAsync(Anime anime);

        Task<Anime?> GetByMoonIdAsync(int moonId);
        Task<Anime?> GetByMalIdAsync(int malId);
        Task<Anime?> GetWithGenresStudioByIdAsync(int id);
        Task<Anime?> GetWithRelateds(int relatedId);
        Task<(bool Exists, List<string>? Screenshots)> GetScreenshots(int id, CancellationToken ct);
    }
}