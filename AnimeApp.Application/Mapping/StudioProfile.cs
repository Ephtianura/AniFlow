using AnimeApp.Application.Mapping;
using AnimeApp.Application.Dto.Responses;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Dto.Responses.Studio;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;



namespace AnimeApp.Application.Mapping
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
