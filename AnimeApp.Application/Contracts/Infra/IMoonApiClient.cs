using AnimeApp.Application.Dto.External;

namespace AnimeApp.Application.Contracts.Infra
{
    public interface IMoonApiClient
    {
        /// <summary> Парсить всі айді аніме із бази MoonPlayer </summary>
        Task<List<AnimeIdDto>> GetAllAnimeIdsAsync();

        /// <summary> Повертає повну інформацію про аніме по MoonId </summary>
        Task<AnimeFullRaw> GetFullAnimeInfo(int moonId);

        /// <summary> Повертає інформацію про всі серії аніме по MalID </summary>
        Task<List<VoiceEpisodeSet>> GetEpisodes(int malId);

        /// <summary> Повертає список 100 останніх опублікованих епізодів </summary>
        Task<List<EpisodeRecent>> LastAnimeUpdated();
        Task<TagsDto> GetAllTags();
    }
}