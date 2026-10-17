using AniFlow.Application.Contracts; 
using Quartz;

namespace AniFlow.Infrastructure.QuartzTimers
{
    [DisallowConcurrentExecution]
    public class FlushGlobalMetricsJob(IStatsService dashboardStatsService) : IJob
    {
        private readonly IStatsService _dashboardStatsService = dashboardStatsService;

        public async Task Execute(IJobExecutionContext context) => 
            await _dashboardStatsService.FlushDailyGlobalStatsAsync();
    }
}