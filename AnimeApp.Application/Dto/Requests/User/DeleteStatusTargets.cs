namespace AnimeApp.Application.Dto.Requests.User
{
        public record DeleteStatusTargets(
            bool MyList = false,
            bool Rating = false,
            bool IsFavorite = false
        );
}

