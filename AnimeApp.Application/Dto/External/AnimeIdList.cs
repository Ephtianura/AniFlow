namespace AnimeApp.Application.Dto.External
{

    public class AnimeIdList
    {
        public List<AnimeIdDto> AnimeList { get; set; } = [];
        public int LastPage { get; set; }
    }

    public class AnimeIdDto
    {
        public int MoonId { get; set; }
        public int? MalId { get; set; }
        public int? AnilistId { get; set; }
    }
}
