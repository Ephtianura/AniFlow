using AnimeApp.Core.Contracts;
using AnimeApp.Core.Dto;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    public class UserFriendRepository(AnimeAppDbContext db) : IUserFriendRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<UserFriend?> GetExistAsync(int senderId, int receiverId) =>
            await _dbContext.UserFriends.FirstOrDefaultAsync(uf =>
                (uf.SenderId == senderId && uf.ReceiverId == receiverId) ||
                (uf.SenderId == receiverId && uf.ReceiverId == senderId));

        public async Task<UserFriend?> GetPendingRequestAsync(int senderId, int receiverId) =>
            await _dbContext.UserFriends.FirstOrDefaultAsync(uf =>
                uf.SenderId == senderId &&
                uf.ReceiverId == receiverId &&
                uf.Status == FriendStatus.Pending);

        public async Task<List<PendingRawRequestDto>> GetPendingRequestsForReceiverAsync(int receiverId)
        {
            return await _dbContext.UserFriends
                .Where(uf => uf.ReceiverId == receiverId && uf.Status == FriendStatus.Pending)
                .Select(uf => new PendingRawRequestDto(
                    uf.Sender.Id,
                    uf.Sender.Nickname,
                    uf.Sender.AvatarFileName,
                    uf.CreatedAt
                ))
                .ToListAsync();
        }

        public async Task<List<FriendRawDto>> GetFriendsListAsync(int userId)
        {
            return await _dbContext.UserFriends
                .Where(uf => (uf.SenderId == userId || uf.ReceiverId == userId)
                             && uf.Status == FriendStatus.Accepted)
                .Select(uf => new
                {
                    FriendUser = uf.SenderId == userId ? uf.Receiver : uf.Sender,
                    uf.AcceptedAt
                })
                .OrderByDescending(x => x.AcceptedAt)
                .Select(f => new FriendRawDto(
                    f.FriendUser.Id,
                    f.FriendUser.Nickname,
                    f.FriendUser.AvatarFileName,
                    f.FriendUser.BannerFileName,
                    f.AcceptedAt
                ))
                .ToListAsync();
        }
        public async Task AddAsync(UserFriend userFriend) => 
            await _dbContext.UserFriends.AddAsync(userFriend);
        public void Update(UserFriend userFriend) => 
            _dbContext.UserFriends.Update(userFriend);
        public void Delete(UserFriend userFriend) => 
            _dbContext.UserFriends.Remove(userFriend);
    }
}


