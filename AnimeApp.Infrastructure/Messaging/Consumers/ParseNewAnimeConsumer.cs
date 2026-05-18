using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Services.Importing;
using MassTransit;

namespace AnimeApp.Infrastructure.Messaging.Consumers
{
    public class ParseNewAnimeConsumer(AnimeImportService service): IConsumer<ParseNewAnimeCommand>
    {
        public async Task Consume(ConsumeContext<ParseNewAnimeCommand> context) =>
            await service.ParseNewAnime(context.Message);
    }
}
