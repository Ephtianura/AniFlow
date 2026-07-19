using AnimeApp.Core.Enums;

namespace AnimeApp.API.Extensions.Dto
{
    public record ListRequest(MyListEnum? myList, bool? isFavorite = null);
}