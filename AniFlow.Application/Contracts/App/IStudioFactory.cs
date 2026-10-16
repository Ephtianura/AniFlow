using AniFlow.Application.Dto.External;
using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.App
{
    public interface IStudioFactory
    {
        Task<Studio?> CreateStudioFromRaw(CompanyDto studioRaw);
        Task<Studio?> GetStudioFromRaw(List<CompanyDto>? raw);
    }
}