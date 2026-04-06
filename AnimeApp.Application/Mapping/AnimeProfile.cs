namespace AnimeApp.Application.Mapping
{
    using AnimeApp.Application.Dto.Requests.Anime;
    using AnimeApp.Application.Dto.Responses;
    using AnimeApp.Application.Dto.Responses.Anime;
    using AnimeApp.Application.Dto.Responses.Studio;
    using AnimeApp.Core.Filters;
    using AnimeApp.Core.Models;
    using AutoMapper;

    public class AnimeProfile : Profile
    {
        public AnimeProfile()
        {
            CreateMap<Anime, AnimeResponse>()
             .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
             .ForMember(dest => dest.ScreenshotsUrls, opt => opt.Ignore())
             .ForMember(dest => dest.Relateds, opt => opt.MapFrom((src, dest, _, ctx) =>
                 src.Relateds
                     .Where(r => r.RelatedAnime != null)
                     .Select(r => new AnimeRelatedResponse
                     {
                         Id = r.RelatedAnime.Id,
                         RelationKind = r.Type,
                         Titles = ctx.Mapper.Map<List<TitleResponse>>(r.RelatedAnime.Titles),
                         Url = r.RelatedAnime.Url,
                         PosterUrl = r.RelatedAnime.PosterFileName,
                         Score = r.RelatedAnime.Score,
                         Episodes = r.RelatedAnime.Episodes,
                         Year = r.RelatedAnime.Year,
                         Rating = r.RelatedAnime.Rating,
                         Kind = r.RelatedAnime.Kind,
                         Status = r.RelatedAnime.Status,
                     }).ToList()))
             .ForMember(dest => dest.Studio, opt => opt.MapFrom(src => src.Studio));


            CreateMap<Anime, AnimesResponse>()
                .ForMember(dest => dest.PosterUrl, opt => opt.Ignore());

            CreateMap<Studio, StudioInAnimeResponse>();

            CreateMap<AnimeTitle, TitleResponse>();
            CreateMap<Genre, GenreResponse>();


            CreateMap<AnimeTitle, AnimeTitleRequest>().ReverseMap();



            CreateMap<PagedResult<Anime>, PagedResultResponse<AnimeResponse>>()
                .ConvertUsing(new PagedResultConverter<Anime, AnimeResponse>());
        }
    }

}
