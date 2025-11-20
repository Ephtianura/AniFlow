using AnimeApp.API.Dto;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;



namespace AnimeApp.API.Mapping
{
    public class StudioProfile : Profile
    {
        public StudioProfile()
        {
            CreateMap<Studio, StudioResponse>()
                .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
                .ForMember(dest => dest.Animes, opt => opt.Ignore());

            CreateMap<Anime, AnimesResponse>()
               .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
               .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
               .ForMember(dest => dest.Titles, opt => opt.MapFrom(src => src.Titles));

            CreateMap<PagedResult<Studio>, PagedResultResponse<StudioResponse>>()
                .ConvertUsing(new PagedResultConverter<Studio, StudioResponse>());
        }
    }

}
