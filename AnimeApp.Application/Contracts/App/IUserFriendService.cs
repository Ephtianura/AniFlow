using AnimeApp.Application.Dto.Responses.User;

namespace AnimeApp.Application.Contracts.App
{
    public interface IUserFriendService
    {
        Task AcceptFriendshipAsync(int currentUserId, int friendId);
        Task<List<FriendResponse>> GetFriendsListAsync(int currentUserId);
        Task<List<PendingRequestResponse>> GetIncomingRequestsAsync(int currentUserId);
        Task RemoveFriendshipOrRequestAsync(int currentUserId, int targetUserId);
        Task SendFriendRequestAsync(int currentUserId, int targetUserId);
    }
}