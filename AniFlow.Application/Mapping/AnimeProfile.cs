namespace AniFlow.Application.Mapping
{
    using AniFlow.Application.Dto.Requests.Anime;
    using AniFlow.Application.Dto.Responses;
    using AniFlow.Application.Dto.Responses.Anime;
    using AniFlow.Application.Dto.Responses.Studio;
    using AniFlow.Core.Filters;
    using AniFlow.Core.Models;
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

            CreateMap<Studio, StudioAnimeResponse>(); 

            CreateMap<AnimeTitle, TitleResponse>();
            CreateMap<Genre, GenreResponse>();

            CreateMap<AnimeOst, AnimeOstResponse>();
            CreateMap<AnimeVideo, AnimeVideoResponse>();


            CreateMap<AnimeTitle, AnimeTitleRequest>().ReverseMap();



            CreateMap<PagedResult<Anime>, PagedResultResponse<AnimeResponse>>()
                .ConvertUsing(new PagedResultConverter<Anime, AnimeResponse>());
        }
    }

}
