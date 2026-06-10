using AnimeApp.Core.Enums;

namespace AnimeApp.API.Dto
{
    public record ListRequest(MyListEnum? myList, bool? isFavorite = null);
}