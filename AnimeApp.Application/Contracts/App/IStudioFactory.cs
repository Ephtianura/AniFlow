using AnimeApp.Application.Dto.External;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.App
{
    public interface IStudioFactory
    {
        Task<Studio?> CreateStudioFromRaw(CompanyDto studioRaw);
        Task<Studio?> GetStudioFromRaw(List<CompanyDto>? raw);
    }
}