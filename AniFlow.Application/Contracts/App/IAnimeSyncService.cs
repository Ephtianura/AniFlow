using AniFlow.Application.Dto.Responses.Anime;

namespace AniFlow.Application.Contracts.App
{
    public interface IAnimeSyncService
    {
        Task<CreatedCountResult> DumpMoonDbToCatalog();
        Task CheckLastUpdated();
        Task SeedDbFromCatalog();
        Task<CreateUpdateResult> SeedDbWithGenres();
    }
}