using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using AnimeApplication.Core.Enums;
using System;
using System.Collections.Generic;

namespace AnimeApp.API.Dto
{
    public class AnimeResponse
    {
        public int Id { get; set; } = 0;
        public List<AnimeTitle>? Titles { get; set; } = new();
        public DateTime? AiredOn { get; set; } = null;
        public DateTime? ReleasedOn { get; set; } = null;
        public double Score { get; set; } = 0;
        public int TotalScores { get; set; } = 0;
        public int Episodes { get; set; } = 0;
        public int EpisodesAired { get; set; } = 0;
        public int Duration { get; set; } = 0;
        public SeasonEnum Season { get; set; } = SeasonEnum.Unknown;
        public int Year { get; set; } = 0;
        public AnimeRatingEnum Rating { get; set; } = AnimeRatingEnum.Unknown;
        public AnimeKindEnum Kind { get; set; } = AnimeKindEnum.Unknown;
        public AnimeStatusEnum Status { get; set; } = AnimeStatusEnum.Unknown;
        public string Description { get; set; } = string.Empty;
        public string? PosterUrl { get; set; } = null;
        public List<string>? ScreenshotsUrls { get; set; } = new();
        public string Url { get; set; } = string.Empty;
        public StudioInAnimeResponse? Studio { get; set; } = null;
        public List<Genre>? Genres { get; set; } = new();
        public List<AnimeRelatedResponse>? Relateds { get; set; } = new();
    }
}
