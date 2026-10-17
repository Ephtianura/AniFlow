using AniFlow.Core.Enums;

namespace AniFlow.API.Extensions.Dto
{
    public record ListRequest(MyListEnum? myList, bool? isFavorite = null);
}