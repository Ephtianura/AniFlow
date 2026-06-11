using AnimeApp.API.Helpers;
using AnimeApp.DataAccess;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

//public interface ISystemClient
//{
//    Task OnNotificationReceived(NotificationDto notification);
//    Task OnUnreadNotificationsCountChanged(int count);
//}

namespace AnimeApp.API.Hubs
{
    public class OnlineHub(
        IConnectionMultiplexer redisConnection,
        IHubContext<OnlineHub> hubContext,
        IServiceScopeFactory scopeFactory) : Hub
    {
        private readonly IDatabase _redis = redisConnection.GetDatabase();
        private readonly IHubContext<OnlineHub> _hubContext = hubContext;
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

        private const string RedisUsersHashKey = "metrics:online:active_users";
        private const string RedisGuestsHashKey = "metrics:online:active_guests";

        private const string RedisUserLastOnlineKeyPrefix = "user:last_online:";

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            string visitorId = UserIdentificationService.GetUniqueVisitorId(httpContext);

            if (visitorId.StartsWith("user_"))
            {
                await _redis.HashIncrementAsync(RedisUsersHashKey, visitorId, 1);

                string userIdStr = visitorId.Replace("user_", "");
                await _redis.KeyDeleteAsync($"{RedisUserLastOnlineKeyPrefix}{userIdStr}");
            }
            else
            {
                await _redis.HashIncrementAsync(RedisGuestsHashKey, visitorId, 1);
            }

            await HandleOnlineMetrics();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            string visitorId = UserIdentificationService.GetUniqueVisitorId(httpContext);

            if (visitorId.StartsWith("user_"))
            {
                long remainingTabs = await _redis.HashIncrementAsync(RedisUsersHashKey, visitorId, -1);

                if (remainingTabs <= 0)
                {
                    await _redis.HashDeleteAsync(RedisUsersHashKey, visitorId);

                    string userIdStr = visitorId.Replace("user_", "");
                    if (int.TryParse(userIdStr, out int userId))
                    {
                        await HandleUserDisconnectAsync(userId);
                    }
                }
            }
            else
            {
                long remainingTabs = await _redis.HashIncrementAsync(RedisGuestsHashKey, visitorId, -1);
                if (remainingTabs <= 0)
                {
                    await _redis.HashDeleteAsync(RedisGuestsHashKey, visitorId);
                }
            }

            await HandleOnlineMetrics();
            await base.OnDisconnectedAsync(exception);
        }

        private async Task HandleUserDisconnectAsync(int userId)
        {
            var disconnectTime = DateTime.UtcNow;

            string cacheKey = $"{RedisUserLastOnlineKeyPrefix}{userId}";
            string isoDateString = disconnectTime.ToString("o"); 
            await _redis.StringSetAsync(cacheKey, isoDateString, TimeSpan.FromDays(7));

            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AnimeAppDbContext>();

                var user = await dbContext.Users.FindAsync(userId);
                if (user != null)
                {
                    user.ChangeLastOnline(disconnectTime);
                    await dbContext.SaveChangesAsync();
                }
            }
        }

        private async Task HandleOnlineMetrics()
        {
            long activeUsersCount = await _redis.HashLengthAsync(RedisUsersHashKey);
            long activeGuestsCount = await _redis.HashLengthAsync(RedisGuestsHashKey);
            long activeUsersNow = activeUsersCount + activeGuestsCount;

            await _hubContext.Clients.All.SendAsync("UpdateOnlineCount", new
            {
                total = activeUsersNow,
                users = activeUsersCount,
                guests = activeGuestsCount
            });

            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var peakKey = $"metrics:online:peak:{today}";
            var currentPeak = await _redis.StringGetAsync(peakKey);

            if (!currentPeak.HasValue || activeUsersNow > int.Parse(currentPeak))
            {
                await _redis.StringSetAsync(peakKey, activeUsersNow, TimeSpan.FromDays(2));
            }

            await _redis.StringIncrementAsync($"metrics:online:sum:{today}", activeUsersNow);
            await _redis.StringIncrementAsync($"metrics:online:ticks:{today}");
        }
    }
}