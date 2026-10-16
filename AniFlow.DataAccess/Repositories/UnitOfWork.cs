using AniFlow.Core.Contracts;

namespace AniFlow.DataAccess.Repositories
{
    public class UnitOfWork(AniFlowDbContext context) : IUnitOfWork
    {
        private readonly AniFlowDbContext _dbContext = context;

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
            await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
