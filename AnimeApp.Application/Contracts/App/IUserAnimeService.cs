using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.App
{
    public interface IUserAnimeService
    {
        Task<UserAnimeListResponse> GetUserAnimesAsync(int userId, MyListEnum? status, bool? isFavorite = null);
        Task<UserAnimeStatus> GetUserAnimeStatusAsync(int userId, int animeId);
        Task<UserProfileResponse> GetUserProfileAsync(int userId);
        Task RemoveUserStatusAsync(int userId, int animeId, DeleteStatusTargets target);
        Task UpdateAnimeStatusAsync(UpdateUserAnimeCommand request);
    }
}