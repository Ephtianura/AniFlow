using AniFlow.Application.Contracts.App;
using Quartz;

namespace AniFlow.Infrastructure.QuartzTimers
{
    public class RecalculateAnimeRatingsJob(IAnimeStatsService animeStatsService) : IJob
    {
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;
        public async Task Execute(IJobExecutionContext context) =>
            await _animeStatsService.RecalculateAnimeStats();
    }
}
