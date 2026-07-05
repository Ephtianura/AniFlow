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
                    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(3, 0)) // Щоночі о 3:00
                );

                var syncJobKey = new JobKey("SyncAnimeJob");
                q.AddJob<CheckAnimeUpdatesJob>(opts => opts.WithIdentity(syncJobKey));
                q.AddTrigger(opts => opts
                    .ForJob(syncJobKey)
                    .WithIdentity("CheckAnimeUpdatesTrigger")
                    .WithSchedule(CronScheduleBuilder.CronSchedule("0 15 0/12 ? * *")) // Раз на 12 годин о nn:15
                );

                var flushGlobalJobKey = new JobKey("FlushMetricsJob");
                q.AddJob<FlushGlobalMetricsJob>(opts => opts.WithIdentity(flushGlobalJobKey));
                q.AddTrigger(opts => opts
                    .ForJob(flushGlobalJobKey)
                    .WithIdentity("FlushMetricsTrigger")
                    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(23, 59)) // Щовечора о 23:59 
                );

                var flushAnimeViewsMetricsJobKey = new JobKey("FlushAnimeStatsTrigger");
                q.AddJob<FlushAnimeViewMetricsJob>(opts => opts.WithIdentity(flushAnimeViewsMetricsJobKey));
                q.AddTrigger(opts => opts
                    .ForJob(flushAnimeViewsMetricsJobKey)
                    .WithIdentity("FlushAnimeStatsTrigger")
                    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(23, 59)) // Щовечора о 23:59 
                );
            });

            services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);

            return services;
        }
    }
}
