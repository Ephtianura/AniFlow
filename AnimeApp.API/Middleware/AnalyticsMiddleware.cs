using StackExchange.Redis;

namespace AnimeApp.API.Middleware
{
    /// <summary>
    /// Тимчасово
    /// </summary>
    public class AnalyticsMiddleware(RequestDelegate next, IConnectionMultiplexer redisConnection)
    {
        private readonly RequestDelegate _next = next;
        private readonly IDatabase _redis = redisConnection.GetDatabase();

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Method == "OPTIONS")
            {
                await _next(context);
                return;
            }

            var path = context.Request.Path.Value?.ToLower();
            if (path != null && (path.Contains(".") || path.StartsWith("/assets") || path.StartsWith("/_next")))
            {
                await _next(context);
                return;
            }

            var currentSecond = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var rpsKey = $"metrics:rps:{currentSecond}";

            await _redis.StringIncrementAsync(rpsKey);
            await _redis.KeyExpireAsync(rpsKey, TimeSpan.FromSeconds(10));

            await _next(context);
        }
    }
}