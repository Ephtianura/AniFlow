using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Filters;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeQueryService
    {
        /// <summary> Повертає аніме по ID </summary>
        /// <exception cref="NotFoundException"></exception>
        Task<AnimeResponse> GetByIdAsync(int id);

        /// <summary> Повертає рандомне аніме </summary>
        /// <exception cref="NotFoundException"></exception>
        Task<AnimeResponse> GetRandomAsync();

        /// <summary> Повертає аніме за фільтром </summary>
        Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter);

        /// <summary> Повертає список ID всіх аніме </summary>
        Task<List<int>> GetIdsAsync();
    }

    public interface IAnimeCommandService
    {
        /// <summary> Створює аніме </summary>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="NotFoundException"></exception>
        Task<AnimeResponse> CreateAsync(AnimeCreateRequest request);

        /// <summary> Оновлює інформацію про аніме </summary>
        /// <exception cref="NotFoundException"></exception>
        Task<AnimeResponse> UpdateAsync(int id, AnimeUpdateRequest request);

        /// <summary> Оновлює файли аніме (скріншоти, постер) </summary>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="NotFoundException"></exception>
        Task<AnimeResponse> UpdateFilesAsync(int id, AnimeUpdateFilesRequest request);

        /// <summary> Видаляє аніме </summary>
        /// <exception cref="NotFoundException"></exception>
        Task DeleteAsync(int id);
    }
}