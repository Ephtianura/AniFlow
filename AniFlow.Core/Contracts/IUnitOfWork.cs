namespace AniFlow.Core.Contracts
{
    public interface IUnitOfWork
    {
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
