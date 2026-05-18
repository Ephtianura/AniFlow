using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Services.Importing;
using MassTransit;

namespace AnimeApp.Infrastructure.Messaging.Consumers
{
    public class UpdateAnimeConsumer(AnimeImportService service): IConsumer<UpdateAnimeCommand>
    {
        public async Task Consume(ConsumeContext<UpdateAnimeCommand> context) =>
            await service.UpdateTechFields(context.Message);
    }
}
