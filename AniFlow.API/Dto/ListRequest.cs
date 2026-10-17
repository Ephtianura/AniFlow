using AniFlow.Core.Enums;

namespace AniFlow.API.Dto
{
    public record ListRequest(MyListEnum? myList, bool? isFavorite = null);
}