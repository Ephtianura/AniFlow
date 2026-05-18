using AnimeApp.Application.Dto.External;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeFactory
    {
        Task<Anime> BuildAnimeFromRaw(AnimeFullRaw raw);
    }
}