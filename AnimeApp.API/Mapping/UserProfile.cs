using AutoMapper;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AnimeApp.API.Dto;
using AnimeApp.API.Dto.User;
using AnimeApp.Application.Dto.User;

namespace AnimeApp.API.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserProfileResponse, UserProfileUrlsResponse>().ReverseMap();
            CreateMap<User, GetUserMeResponse>().ReverseMap();

            CreateMap<PagedResult<User>, PagedResultResponse<GetUserAdminResponse>>()
                .ConvertUsing(new PagedResultConverter<User, GetUserAdminResponse>());
        }
    }
}
