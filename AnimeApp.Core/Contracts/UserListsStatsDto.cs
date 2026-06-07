using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Contracts
{
    public class UserListsStatsDto
    {
        public int TotalFavoritesCount { get; set; }

        public int TotalRatedCount { get; set; }

        public List<UserListTypeStatItem> ByListType { get; set; } = [];
    }

    public record UserListTypeStatItem(MyListEnum ListType, int Count);
}
