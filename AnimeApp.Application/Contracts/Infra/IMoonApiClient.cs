using AnimeApp.Application.Dto.External;

namespace AnimeApp.Application.Contracts.Infra
{
    public interface IMoonApiClient
    {
        /// <summary> Парсить всі айді аніме із бази MoonPlayer </summary>
        Task<AnimeIdList> GetAnimeIdsAsync(int page, int limit = 100);

        /// <summary> Повертає повну інформацію про аніме по MoonId </summary>
        Task<AnimeFullRaw> GetFullAnimeInfo(int moonId);

        /// <summary> Повертає інформацію про всі серії аніме по MalID </summary>
        Task<List<VoiceEpisodeSet>> GetEpisodes(int malId);

        /// <summary> Повертає список останніх опублікованих епізодів </summary>
        Task<List<EpisodeRecent>> LastAnimeUpdated(int page = 1, int limit = 100);
    }
}