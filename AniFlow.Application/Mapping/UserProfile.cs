using AutoMapper;
using AniFlow.Core.Filters;
using AniFlow.Core.Models;
using AniFlow.Application.Dto.Responses.User;
using AniFlow.Application.Dto.Requests.User;
using AniFlow.Application.Dto.Responses;

namespace AniFlow.Application.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserProfileResponse, UserProfileUrlsResponse>().ReverseMap();
            CreateMap<User, UserMeResponse>().ReverseMap();

            CreateMap<PagedResult<User>, PagedResultResponse<GetUserAdminResponse>>()
                .ConvertUsing(new PagedResultConverter<User, GetUserAdminResponse>());
        }
    }
}
