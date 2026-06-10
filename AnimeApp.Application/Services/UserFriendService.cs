using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using StackExchange.Redis;

namespace AnimeApp.Application.Services
{
    public class UserFriendService(
        IUserRepository userRepository, 
        IUserFriendRepository userFriendsRep, 
        IUnitOfWork unitOfWork, 
        IS3FileStorageService fileStorage,
        IConnectionMultiplexer redis) : IUserFriendService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IUserFriendRepository _userFriendsRep = userFriendsRep;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IDatabase _redis = redis.GetDatabase();


        public async Task SendFriendRequestAsync(int currentUserId, int targetUserId)
        {
            var targetUserExists = await _userRepository.ExistsAsync(targetUserId);

            if (!targetUserExists)
                throw new NotFoundException("User");

            var existingLink = await _userFriendsRep.GetExistAsync(currentUserId, targetUserId);

            if (existingLink != null)
                throw new BadRequestException("Зв'язок між користувачами вже існує або очікує підтвердження.");

            var newRequest = UserFriend.Create(senderId: currentUserId, receiverId: targetUserId);

            await _userFriendsRep.AddAsync(newRequest);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task AcceptFriendshipAsync(int currentUserId, int friendId)
        {
            var targetUserExists = await _userRepository.ExistsAsync(friendId);

            if (!targetUserExists)
                throw new NotFoundException("User");

            var request = await _userFriendsRep.GetPendingRequestAsync(senderId: friendId, receiverId: currentUserId)
                ?? throw new NotFoundException("User friend link");

            request.Accept(currentUserId);

            _userFriendsRep.Update(request);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task RemoveFriendshipOrRequestAsync(int currentUserId, int targetUserId)
        {
            var existingLink = await _userFriendsRep.GetExistAsync(currentUserId, targetUserId)
                ?? throw new NotFoundException("Зв'язок між користувачами не знайдено.");

            _userFriendsRep.Delete(existingLink);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<PendingRequestResponse>> GetIncomingRequestsAsync(int currentUserId)
        {
            var requests = await _userFriendsRep.GetPendingRequestsForReceiverAsync(currentUserId);
            if (requests.Count == 0) return [];

            var batch = _redis.CreateBatch();
            var tasks = new Task<bool>[requests.Count];

            for (int i = 0; i < requests.Count; i++)
            {
                tasks[i] = batch.HashExistsAsync("metrics:online:active_users", $"user_{requests[i].UserId}");
            }

            batch.Execute();

            bool[] onlineStatuses = await Task.WhenAll(tasks);

            var response = new List<PendingRequestResponse>(requests.Count);
            for (int i = 0; i < requests.Count; i++)
            {
                var r = requests[i];
                response.Add(new PendingRequestResponse(
                    r.UserId,
                    r.Nickname,
                    !string.IsNullOrWhiteSpace(r.AvatarFileName) ? _fileStorage.GetUrl(r.AvatarFileName) : null,
                    r.CreatedAt,
                    onlineStatuses[i] 
                ));
            }

            return response;
        }

        public async Task<List<FriendResponse>> GetFriendsListAsync(int currentUserId)
        {
            var friends = await _userFriendsRep.GetFriendsListAsync(currentUserId);
            if (friends.Count == 0) return [];

            var batch = _redis.CreateBatch();
            var tasks = new Task<bool>[friends.Count];

            for (int i = 0; i < friends.Count; i++)
            {
                tasks[i] = batch.HashExistsAsync("metrics:online:active_users", $"user_{friends[i].UserId}");
            }

            batch.Execute();

            bool[] onlineStatuses = await Task.WhenAll(tasks);

            var response = new List<FriendResponse>(friends.Count);
            for (int i = 0; i < friends.Count; i++)
            {
                var f = friends[i];
                response.Add(new FriendResponse(
                    f.UserId,
                    f.Nickname,
                    !string.IsNullOrWhiteSpace(f.AvatarFileName) ? _fileStorage.GetUrl(f.AvatarFileName) : null,
                    !string.IsNullOrWhiteSpace(f.BannerFileName) ? _fileStorage.GetUrl(f.BannerFileName) : null,
                    f.AcceptedAt,
                    onlineStatuses[i] 
                ));
            }

            return response;
        }

    }
}
