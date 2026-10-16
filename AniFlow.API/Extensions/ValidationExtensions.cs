using Microsoft.AspNetCore.Mvc;
using AniFlow.API.Filters;

namespace AniFlow.API.Extensions
{
    public static class ValidationExtensions
    {
        public static IServiceCollection AddCustomValidation(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                var builtInFactory = options.InvalidModelStateResponseFactory;

                options.InvalidModelStateResponseFactory = context =>
                {
                    var hasAllowInvalidAttribute = context.ActionDescriptor.EndpointMetadata
                        .Any(em => em is AllowInvalidModelStateAttribute);

                    if (hasAllowInvalidAttribute)
                    {
                        context.ModelState.Clear();
                        return null!; 
                    }

                    return builtInFactory(context);
                };
            });

            return services;
        }
    }
}