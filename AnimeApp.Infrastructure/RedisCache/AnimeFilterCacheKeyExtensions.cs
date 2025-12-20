using AnimeApp.Core.Filters;

namespace AnimeApp.Infrastructure.RedisCache
{
    namespace AnimeApp.Core.Filters
    {
        public static class AnimeFilterCacheKeyExtensions
        {
            public static string ToCacheKey(this AnimeFilter f)
            {
                var genres = f.GenresId == null
                    ? "null"
                    : string.Join(",", f.GenresId.OrderBy(x => x));

                return string.Join("|",
                    $"search={f.Search}",
                    $"genres={genres}",
                    $"studio={f.StudioId}",
                    $"kind={f.Kind}",
                    $"status={f.Status}",
                    $"rating={f.Rating}",
                    $"season={f.Season}",
                    $"year={f.Year}",
                    $"airedFrom={f.AiredFrom:yyyyMMdd}",
                    $"airedTo={f.AiredTo:yyyyMMdd}",
                    $"releasedFrom={f.ReleasedFrom:yyyyMMdd}",
                    $"releasedTo={f.ReleasedTo:yyyyMMdd}",
                    $"minScore={f.MinScore}",
                    $"maxScore={f.MaxScore}",
                    $"minEp={f.MinEpisodes}",
                    $"maxEp={f.MaxEpisodes}",
                    $"sort={f.SortBy}",
                    $"desc={f.SortDesc}",
                    $"page={f.Page}",
                    $"size={f.PageSize}"
                );
            }
        }
    }

}
