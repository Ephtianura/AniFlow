using AniFlow.Application.Contracts.App;
using AniFlow.Application.Contracts.Commands;
using MassTransit;

namespace AniFlow.Infrastructure.Messaging.Consumers
{
    public class ParseNewAnimeConsumer(IAnimeImportService service): IConsumer<ParseNewAnimeCommand>
    {
        public async Task Consume(ConsumeContext<ParseNewAnimeCommand> context) =>
            await service.ParseNewAnime(context.Message);
    }
}
