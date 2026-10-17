using AniFlow.Application.Dto.Responses.User;

namespace AniFlow.Application.Dto.Responses.Anime
{
    public record AnimeUserResponse(
                AnimeResponse Anime,
                UserAnimeStatus? UserStatus
                );
}