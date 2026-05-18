using AnimeApp.Application.Contracts.App;
using Quartz;

namespace AnimeApp.Infrastructure.QuartzTimers
{
    public class CheckAnimeUpdatesJob(IAnimeSyncService animeSyncService) : IJob
    {
        private readonly IAnimeSyncService _animeSyncService = animeSyncService;
        public async Task Execute(IJobExecutionContext context) =>
            await _animeSyncService.CheckLastUpdated();
    }
}
