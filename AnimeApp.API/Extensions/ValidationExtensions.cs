using Microsoft.AspNetCore.Mvc;
using AnimeApp.API.Filters;

namespace AnimeApp.API.Extensions
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