using AnimeApp.Core.Contracts;

namespace AnimeApp.DataAccess.Repositories
{
    public class UnitOfWork(AnimeAppDbContext context) : IUnitOfWork
    {
        private readonly AnimeAppDbContext _dbContext = context;

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
            await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
