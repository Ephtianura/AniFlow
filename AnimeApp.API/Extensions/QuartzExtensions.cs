using AnimeApp.Infrastructure.QuartzTimers;
using Quartz;

namespace AnimeApp.API.Extensions
{
    public static class QuartzExtensions
    {
        public static IServiceCollection AddQuartzJobs(this IServiceCollection services)
        {
            services.AddQuartz(q =>
            {
                var recalcJobKey = new JobKey("RecalculateAnimeRatingsJob");
                q.AddJob<RecalculateAnimeRatingsJob>(opts => opts.WithIdentity(recalcJobKey));

                q.AddTrigger(opts => opts
                    .ForJob(recalcJobKey)
                    .WithIdentity("RecalculateAnimeStatsTrigger")
                    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(3, 0))
                );

                // Поки нехай не працює
                //var syncJobKey = new JobKey("SyncAnimeJob");
                //q.AddJob<CheckAnimeUpdatesJob>(opts => opts.WithIdentity(syncJobKey));

                //q.AddTrigger(opts => opts
                //    .ForJob(syncJobKey)
                //    .WithIdentity("CheckAnimeUpdatesTrigger")
                //    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(4, 0))
                //);

            });

            services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);

            return services;
        }
    }
}
