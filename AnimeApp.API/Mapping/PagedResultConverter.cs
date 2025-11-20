using AutoMapper;
using AnimeApp.Core.Filters;
using AnimeApp.API.Dto;

namespace AnimeApp.API.Mapping
{
    public class PagedResultConverter<TSource, TDestination>
        : ITypeConverter<PagedResult<TSource>, PagedResultResponse<TDestination>>
    {
        public PagedResultResponse<TDestination> Convert(
            PagedResult<TSource> source,
            PagedResultResponse<TDestination> destination,
            ResolutionContext context)
        {
            return new PagedResultResponse<TDestination>
            {
                Items = context.Mapper.Map<List<TDestination>>(source.Items),
                TotalCount = source.TotalCount,
                Page = source.Page,
                PageSize = source.PageSize,
                TotalPages = source.TotalPages
            };
        }
    }
}
