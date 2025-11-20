//using AutoMapper;
//using AnimeApp.Core.Filters;
//using AnimeApp.Core.Models;
//using AnimeApp.API.Dto;
//using AnimeApp.API.Dto.User;

//namespace AnimeApp.API.Mapping
//{
//    public class UserProfile : Profile
//    {
//        public UserProfile()
//        {
//            CreateMap<User, GetUserResponse>().ReverseMap();
//            CreateMap<User, GetUserAdminResponse>().ReverseMap();

//            CreateMap<PagedResult<User>, PagedResultResponse<GetUserAdminResponse>>()
//                .ConvertUsing(new PagedResultConverter<User, GetUserAdminResponse>());
//        }
//    }
//}
