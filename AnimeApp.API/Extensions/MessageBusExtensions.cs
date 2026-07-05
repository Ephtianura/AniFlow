    using AnimeApp.Infrastructure.Messaging.Consumers;
    using MassTransit;

    namespace AnimeApp.API.Extensions
    {
    public static class MessageBusExtensions
    {
        public static IServiceCollection AddMessageBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMassTransit(x =>
            {
                x.SetKebabCaseEndpointNameFormatter();

                x.AddConsumer<ParseNewAnimeConsumer>()
                    .Endpoint(e =>
                    {
                        e.ConcurrentMessageLimit = 5;
                        e.PrefetchCount = 5;
                    });

                x.AddConsumer<UpdateAnimeConsumer>()
                    .Endpoint(e =>
                    {
                        e.ConcurrentMessageLimit = 5;
                        e.PrefetchCount = 1;
                    });

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(configuration["RabbitMQ:Host"], "/", h =>
                    {
                        h.Username(configuration["RabbitMQ:Username"]!);
                        h.Password(configuration["RabbitMQ:Password"]!);
                    });

                    cfg.UseMessageRetry(r => r.Interval(1, TimeSpan.FromSeconds(5)));

                    cfg.ConfigureEndpoints(context);
                });
            });

            return services;
        }
    }
}
