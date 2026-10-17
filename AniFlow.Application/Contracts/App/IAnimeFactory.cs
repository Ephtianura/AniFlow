using AniFlow.Application.Dto.External;
using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.App
{
    public interface IAnimeFactory
    {
        Task<Anime> BuildAnimeFromRaw(AnimeFullRaw raw);
    }
}