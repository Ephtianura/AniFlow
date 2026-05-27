using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using MassTransit;

namespace AnimeApp.Infrastructure.Messaging.Consumers
{
    public class ParseNewAnimeConsumer(IAnimeImportService service): IConsumer<ParseNewAnimeCommand>
    {
        public async Task Consume(ConsumeContext<ParseNewAnimeCommand> context) =>
            await service.ParseNewAnime(context.Message);
    }
}
