using AniFlow.Application.Mapping;
using AniFlow.Application.Dto.Responses;
using AniFlow.Application.Dto.Responses.Anime;
using AniFlow.Application.Dto.Responses.Studio;
using AniFlow.Core.Filters;
using AniFlow.Core.Models;
using AutoMapper;
using AniFlow.Application.Contracts.Infra;



namespace AniFlow.Application.Mapping
{
    public class StudioProfile : Profile
    {
        public StudioProfile()
        {
            CreateMap<Studio, StudioResponse>()
                .ForMember(dest => dest.PosterUrl, opt => opt.Ignore());

            CreateMap<Anime, AnimesResponse>()
                .ForMember(dest => dest.PosterUrl,
                    opt => opt.MapFrom(src => src.PosterFileName))
                .ForMember(dest => dest.Genres,
                    opt => opt.MapFrom(src => src.Genres))
                .ForMember(dest => dest.Titles,
                    opt => opt.MapFrom(src => src.Titles));

            CreateMap<PagedResult<Studio>, PagedResultResponse<StudioResponse>>()
                .ConvertUsing(new PagedResultConverter<Studio, StudioResponse>());


        }
    }

}
