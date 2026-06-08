using AnimeApp.API.Helpers;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace AnimeApp.API.Hubs
{
    public class OnlineHub(IConnectionMultiplexer redisConnection, IHubContext<OnlineHub> hubContext) : Hub
    {
        private readonly IDatabase _redis = redisConnection.GetDatabase();
        private readonly IHubContext<OnlineHub> _hubContext = hubContext;

        private const string RedisUsersHashKey = "metrics:online:active_users";
        private const string RedisGuestsHashKey = "metrics:online:active_guests";

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            string visitorId = UserIdentificationService.GetUniqueVisitorId(httpContext);

            // Наш сервис возвращает строки типа "user_123" или "guest_cookie_GUID"
            if (visitorId.StartsWith("user_"))
            {
                await _redis.HashIncrementAsync(RedisUsersHashKey, visitorId, 1);
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

        private async Task HandleOnlineMetrics()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            long activeUsersCount = await _redis.HashLengthAsync(RedisUsersHashKey);
            long activeGuestsCount = await _redis.HashLengthAsync(RedisGuestsHashKey);
            long activeUsersNow = activeUsersCount + activeGuestsCount;

            await _hubContext.Clients.All.SendAsync("UpdateOnlineCount", new
            {
                total = activeUsersNow,
                users = activeUsersCount,
                guests = activeGuestsCount
            });

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