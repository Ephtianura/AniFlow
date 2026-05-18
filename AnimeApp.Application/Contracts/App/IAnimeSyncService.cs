using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeSyncService
    {
        Task<CreatedCountResult> DumpMoonDbToCatalog();
        Task CheckLastUpdated();
        Task SeedDbFromCatalog();
        Task<CreateUpdateResult> SeedDbWithGenres();
    }
}