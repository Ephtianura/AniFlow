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

                    x.AddConsumers(typeof(ParseNewAnimeConsumer).Assembly);
                    x.AddConsumers(typeof(UpdateAnimeConsumer).Assembly);

                    x.UsingRabbitMq((context, cfg) =>
                    {
                        cfg.Host(configuration["RabbitMQ:Host"], "/", h =>
                        {
                            h.Username(configuration["RabbitMQ:Username"]!);
                            h.Password(configuration["RabbitMQ:Password"]!);
                        });

                        cfg.ReceiveEndpoint("parse-new-anime", e =>
                        {
                            e.ConcurrentMessageLimit = 5;
                            e.PrefetchCount = 5;

                            e.UseMessageRetry(r =>
                                r.Interval(1, TimeSpan.FromSeconds(5)));

                            e.SetQuorumQueue();

                            e.ConfigureConsumer<ParseNewAnimeConsumer>(context);
                        });

                        cfg.ReceiveEndpoint("update-new-anime", e =>
                        {
                            e.ConcurrentMessageLimit = 5;
                            e.PrefetchCount = 1;

                            e.UseMessageRetry(r =>
                                r.Interval(1, TimeSpan.FromSeconds(5)));

                            e.SetQuorumQueue();

                            e.ConfigureConsumer<UpdateAnimeConsumer>(context);
                        });

                    });
                });

                return services;
            }
        }
    }
