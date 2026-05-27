using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using MassTransit;

namespace AnimeApp.Infrastructure.Messaging.Consumers
{
    public class UpdateAnimeConsumer(IAnimeImportService service): IConsumer<UpdateAnimeCommand>
    {
        public async Task Consume(ConsumeContext<UpdateAnimeCommand> context) =>
            await service.UpdateTechFields(context.Message);
    }
}
