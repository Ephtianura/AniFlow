using AnimeApp.Core.Enums;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    // ===================== ANIME =====================
    public class AnimeRepository : IAnimeRepository
    {
        private readonly AnimeAppDbContext _dbContext;
        public AnimeRepository(AnimeAppDbContext db) => _dbContext = db;

        public async Task<Anime?> GetByIdAsync(int id)
        {
            return await _dbContext.Animes
               .Include(a => a.Titles)
               .Include(a => a.Genres)
               .Include(a => a.Studio)
               .Include(a => a.Relateds)
                    .ThenInclude(r => r.RelatedAnime)
               .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Anime?> GetRandomAsync()
        {
            var count = await _dbContext.Animes.CountAsync();
            if (count == 0) return null;

            var index = new Random().Next(count);

            return await _dbContext.Animes
                .Include(a => a.Titles)
                .Include(a => a.Genres)
                .Include(a => a.Studio)
                .Include(a => a.Relateds)
                    .ThenInclude(r => r.RelatedAnime)
                .Skip(index)
                .FirstOrDefaultAsync();
        }


        public async Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter)
        {
            var query = _dbContext.Animes
                .Include(a => a.Titles)
                .Include(a => a.Genres)
                .Include(a => a.Studio)
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
            {
                query = query.Where(a => a.Genres.Any(g => filter.GenresId.Contains(g.Id)));
            }

            // =================== STUDIO ===================
            if (filter.StudioId.HasValue)
            {
                query = query.Where(a => a.StudiosId == filter.StudioId);
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
            query = filter.SortBy?.ToLower() switch
            {
                "title" => filter.SortDesc
                    ? query.OrderByDescending(a => a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault())
                    : query.OrderBy(a => a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault()),

                "score" => filter.SortDesc ? query.OrderByDescending(a => a.Score) : query.OrderBy(a => a.Score),
                "episodes" => filter.SortDesc ? query.OrderByDescending(a => a.Episodes) : query.OrderBy(a => a.Episodes),
                "airedon" => filter.SortDesc ? query.OrderByDescending(a => a.AiredOn) : query.OrderBy(a => a.AiredOn),
                "releasedon" => filter.SortDesc ? query.OrderByDescending(a => a.ReleasedOn) : query.OrderBy(a => a.ReleasedOn),
                _ => query.OrderBy(a => a.Id) // default
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
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddRangeAsync(IEnumerable<Anime> animes)
        {
            await _dbContext.Animes.AddRangeAsync(animes);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(Anime anime)
        {
            _dbContext.Animes.Update(anime);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Anime anime)
        {
            _dbContext.Animes.Remove(anime);
            await _dbContext.SaveChangesAsync();
        }
    }
}

