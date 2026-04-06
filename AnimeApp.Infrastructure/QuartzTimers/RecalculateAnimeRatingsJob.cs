using AnimeApp.Application.Contracts;
using Quartz;

namespace AnimeApp.Infrastructure.QuartzTimers
{
    public class RecalculateAnimeRatingsJob(IAnimeStatsService animeStatsService) : IJob
    {
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;
        public async Task Execute(IJobExecutionContext context) =>
            await _animeStatsService.RecalculateAnimeStats();
    }
}
