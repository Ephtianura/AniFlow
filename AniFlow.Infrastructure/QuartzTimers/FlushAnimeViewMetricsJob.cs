using AniFlow.Application.Contracts; 
using Quartz;

namespace AniFlow.Infrastructure.QuartzTimers
{
    [DisallowConcurrentExecution]
    public class FlushAnimeViewMetricsJob(IStatsService dashboardStatsService) : IJob
    {
        private readonly IStatsService _dashboardStatsService = dashboardStatsService;

        public async Task Execute(IJobExecutionContext context) => 
            await _dashboardStatsService.FlushDailyAnimeEpisodeStatsAsync();
    }
}