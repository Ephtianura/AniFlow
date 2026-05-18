using Serilog;

namespace AnimeApp.API.Extensions
{
    public static class SerilogExtensions
    {
        public static WebApplicationBuilder AddSerilogLogging(this WebApplicationBuilder builder)
        {
            builder.Host.UseSerilog((context, loggerConfig) =>
            {
                loggerConfig
                    .ReadFrom.Configuration(context.Configuration)
                    .Enrich.FromLogContext();
            });

            return builder;
        }
    }
}
