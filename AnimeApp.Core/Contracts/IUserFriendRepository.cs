using AnimeApp.Core.Dto;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserFriendRepository
    {
        Task AddAsync(UserFriend userFriend);
        void Delete(UserFriend userFriend);
        Task<UserFriend?> GetExistAsync(int senderId, int receiverId);
        Task<UserFriend?> GetPendingRequestAsync(int senderId, int receiverId);
        void Update(UserFriend userFriend);
        Task<List<PendingRawRequestDto>> GetPendingRequestsForReceiverAsync(int receiverId);
        Task<List<FriendRawDto>> GetFriendsListAsync(int userId);
    }
}