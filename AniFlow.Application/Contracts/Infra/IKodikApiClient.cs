using AniFlow.Application.Dto.External;

namespace AniFlow.Application.Contracts.Infra
{
    public interface IKodikApiClient
    {
        /// <summary> Повертає масив скріншотів і KodikId </summary>
        /// <remarks>ShikimoriId = MalId</remarks>
        /// <param name="shikimoriId">ShikimoriId = MalId</param>
        Task<KodikScreenshotsResult> GetScreenshots(int shikimoriId);
    }
}