using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Requests.User
{
    public record UpdateUserAnimeRequest(
                                    MyListEnum? MyList,
                                           int? Rating
                                );
}