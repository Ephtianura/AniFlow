using AnimeApp.Application.Dto.Responses.User;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public record AnimeUserResponse(
                AnimeResponse Anime,
                UserAnimeStatus? UserStatus
                );
}