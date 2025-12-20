using AutoMapper;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses;

namespace AnimeApp.Application.Mapping
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
