using AniFlow.Application.Contracts.App;
using AniFlow.Application.Contracts.Commands;
using MassTransit;

namespace AniFlow.Infrastructure.Messaging.Consumers
{
    public class UpdateAnimeConsumer(IAnimeImportService service): IConsumer<UpdateAnimeCommand>
    {
        public async Task Consume(ConsumeContext<UpdateAnimeCommand> context) =>
            await service.UpdateTechFields(context.Message);
    }
}
