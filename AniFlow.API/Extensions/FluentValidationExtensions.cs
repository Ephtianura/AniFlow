using AniFlow.Application.Validation.AnimeValidator;
using FluentValidation;
using FluentValidation.AspNetCore;

namespace AniFlow.API.Extensions
{
    public static class FluentValidationExtensions
    {
        public static IServiceCollection AddValidation(this IServiceCollection services)
        {
            services
                .AddFluentValidationAutoValidation()
                .AddFluentValidationClientsideAdapters();
            //builder.Services.AddValidatorsFromAssemblyContaining<UserRegisterValidator>();

            services.AddValidatorsFromAssemblyContaining<AnimeCreateValidator>();

            return services;
        }
    }
}
