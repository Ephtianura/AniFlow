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
                var jobKey = new JobKey("RecalculateAnimeRatingsJob");

                q.AddJob<RecalculateAnimeRatingsJob>(opts => opts.WithIdentity(jobKey));

                q.AddTrigger(opts => opts
                    .ForJob(jobKey)
                    .WithIdentity("RecalculateAnimeStatsTrigger")
                    .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(3, 0))
                );
            });

            services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);
            return services;
        }
    }
}
