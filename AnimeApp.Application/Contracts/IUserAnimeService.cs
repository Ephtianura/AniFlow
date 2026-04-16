using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IUserAnimeService
    {
        Task<UserAnimeListResponse> GetUserAnimeListAsync(int userId);
        Task<UserAnimeListResponse> GetUserAnimesByStatusAsync(int userId, MyListEnum? status);
        Task<UserAnimeStatus> GetUserAnimeStatusAsync(int userId, int animeId);
        Task<User> GetUserByIdAsync(int userId);
        Task<UserProfileResponse> GetUserProfileAsync(int userId);
        Task<User> GetUserWithAnimeByIdAsync(int userId);
        Task RemoveUserStatusAsync(int userId, int animeId, DeleteStatusTargets target);
        Task UpdateAnimeStatusAsync(UpdateUserAnimeCommand request);
    }
}