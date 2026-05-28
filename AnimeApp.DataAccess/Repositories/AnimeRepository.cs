using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;
using static AnimeApp.Core.Filters.AnimeFilter;

namespace AnimeApp.DataAccess.Repositories
{
    // ===================== ANIME =====================
    public class AnimeRepository(AnimeAppDbContext db) : IAnimeRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<Anime?> GetByIdAsync(int id)
        {
            return await _dbContext.Animes
                .AsNoTracking()
                .AsSplitQuery()
                .Include(a => a.Titles)
                .Include(a => a.Genres)
                .Include(a => a.Studio)
                .Include(a => a.Music)
                    .ThenInclude(v => v.Videos)
                .Include(a => a.Promos.Where(p => p.AnimeOstId == null))
                .Include(a => a.Relateds)
                    .ThenInclude(r => r.RelatedAnime)

                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public Task<Anime?> GetByMoonIdAsync(int moonId) =>
         _dbContext.Animes.FirstOrDefaultAsync(a => a.MoonId == moonId);

        public Task<Anime?> GetByMalIdAsync(int malId) =>
          _dbContext.Animes.FirstOrDefaultAsync(a => a.MalId == malId);

        public async Task<Anime?> GetRandomAsync()
        {
            var ids = await _dbContext.Animes.Select(a => a.Id).ToListAsync();
            if (ids.Count == 0) return null;

            var randomId = ids[Random.Shared.Next(ids.Count)];

            return await GetByIdAsync(randomId);
        }

        public async Task<string?> GetRandomSlugAsync()
        {
            using var connection = _dbContext.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = "SELECT \"Url\" FROM \"Animes\" ORDER BY RANDOM() LIMIT 1";

            var result = await command.ExecuteScalarAsync();
            return result as string;
        }

        public async Task<List<int>> GetAllMixedIdsAsync()
        {
            var allIds = await _dbContext.Animes
                .AsNoTracking()
                .Select(x => x.Id)
                .ToListAsync();

            Random rng = Random.Shared;
            int n = allIds.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                int value = allIds[k];
                allIds[k] = allIds[n];
                allIds[n] = value;
            }

            return allIds;
        }

      

        public async Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter)
        {
            filter.Normalize();
            var query = _dbContext.Animes
                .Include(a => a.Titles)
                .Include(a => a.Genres)
                .Include(a => a.Studio)
                .AsNoTracking()
                .AsQueryable();

            // =================== SEARCH ===================
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim().ToLower();
                query = query.Where(a =>
                    a.Titles.Any(t =>
                        t.Value.ToLower().Contains(term)
                    )
                );
            }

            // =================== GENRES ===================
            if (filter.GenresId != null && filter.GenresId.Any())
                query = query.Where(a =>
                    a.Genres.Any(g => filter.GenresId.Contains(g.Id)));

            if (filter.GenresSlugs != null && filter.GenresSlugs.Any())
                query = query.Where(a =>
                    a.Genres.Any(g => filter.GenresSlugs.Contains(g.Slug)));

            // =================== STUDIO ===================
            if (filter.StudioId.HasValue)
            {
                query = query.Where(a => a.StudiosId == filter.StudioId);
            }
            else if (!string.IsNullOrWhiteSpace(filter.StudioSlug))
            {
                query = query.Where(a => a.Studio != null && a.Studio.Slug == filter.StudioSlug);
            }

            // =================== ENUM FILTERS ===================
            if (filter.Kind.HasValue)
                query = query.Where(a => a.Kind == filter.Kind);

            if (filter.Status.HasValue)
                query = query.Where(a => a.Status == filter.Status);

            if (filter.Rating.HasValue)
                query = query.Where(a => a.Rating == filter.Rating);

            if (filter.Season.HasValue)
                query = query.Where(a => a.Season == filter.Season);

            if (filter.Year.HasValue)
                query = query.Where(a => a.Year == filter.Year);

            // =================== DATE FILTERS ===================
            if (filter.AiredFrom.HasValue)
                query = query.Where(a => a.AiredOn >= filter.AiredFrom);

            if (filter.AiredTo.HasValue)
                query = query.Where(a => a.AiredOn <= filter.AiredTo);

            if (filter.ReleasedFrom.HasValue)
                query = query.Where(a => a.ReleasedOn >= filter.ReleasedFrom);

            if (filter.ReleasedTo.HasValue)
                query = query.Where(a => a.ReleasedOn <= filter.ReleasedTo);

            // =================== SCORE / EPISODES ===================
            if (filter.MinScore.HasValue)
                query = query.Where(a => a.Score >= filter.MinScore);

            if (filter.MaxScore.HasValue)
                query = query.Where(a => a.Score <= filter.MaxScore);

            if (filter.MinEpisodes.HasValue)
                query = query.Where(a => a.Episodes >= filter.MinEpisodes);

            if (filter.MaxEpisodes.HasValue)
                query = query.Where(a => a.Episodes <= filter.MaxEpisodes);

            // =================== SORTING ===================
            query = filter.SortBy switch
            {
                AnimeSortBy.Title => filter.SortDesc
                    ? query.OrderByDescending(a => a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault())
                    : query.OrderBy(a => a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault()),

                AnimeSortBy.Score => filter.SortDesc
                    ? query.OrderByDescending(a => a.Score).ThenBy(a => a.Id)
                    : query.OrderBy(a => a.Score).ThenBy(a => a.Id),
                AnimeSortBy.Episodes => filter.SortDesc
                    ? query.OrderByDescending(a => a.Episodes).ThenBy(a => a.Id)
                    : query.OrderBy(a => a.Episodes).ThenBy(a => a.Id),
                AnimeSortBy.AiredOn => filter.SortDesc
                    ? query.OrderByDescending(a => a.AiredOn).ThenBy(a => a.Id)
                    : query.OrderBy(a => a.AiredOn).ThenBy(a => a.Id),
                AnimeSortBy.ReleasedOn => filter.SortDesc
                    ? query.OrderByDescending(a => a.ReleasedOn).ThenBy(a => a.Id)
                    : query.OrderBy(a => a.ReleasedOn).ThenBy(a => a.Id),
                AnimeSortBy.CreatedAt => filter.SortDesc
                    ? query.OrderByDescending(a => a.CreatedAt).ThenBy(a => a.Id)
                    : query.OrderBy(a => a.CreatedAt).ThenBy(a => a.Id),
                AnimeSortBy.UpdatedAt => filter.SortDesc
                   ? query.OrderByDescending(a => a.UpdatedAt).ThenBy(a => a.Id)
                   : query.OrderBy(a => a.UpdatedAt).ThenBy(a => a.Id),

                _ => query.OrderBy(a => a.Score).ThenBy(a => a.Id) // default
            };



            // =================== PAGINATION ===================
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<Anime>(items, totalCount, filter.Page, filter.PageSize);
        }



        public async Task AddAsync(Anime anime)
        {
            await _dbContext.Animes.AddAsync(anime);
        }
        public async Task UpdateAsync(Anime anime)
        {
            _dbContext.Animes.Update(anime);
        }

        public async Task DeleteAsync(Anime anime)
        {
            _dbContext.Animes.Remove(anime);
            await _dbContext.SaveChangesAsync();
        }

     
    }
}

