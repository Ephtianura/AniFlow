using AutoMapper;
using AniFlow.Core.Filters;
using AniFlow.Application.Dto.Responses;

namespace AniFlow.Application.Mapping
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
