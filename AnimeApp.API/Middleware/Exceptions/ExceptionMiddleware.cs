using System.Net;
using AnimeApp.Application.Exceptions;
using FluentValidation;

namespace AnimeApp.API.Middleware.Exceptions
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, _logger, _env);
            }
        }

        private static async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception,
            ILogger logger,
            IHostEnvironment env)
        {

            HttpStatusCode status;
            string message;

            if (exception is ValidationException validationEx)
            {
                status = HttpStatusCode.BadRequest;
                message = string.Join("; ", validationEx.Errors.Select(e => e.ErrorMessage));
            }
            else
            {
                status = ExceptionGroups.Groups
                    .FirstOrDefault(g => g.Value.Contains(exception.GetType()))
                    .Key;

                if (status == 0)
                {
                    status = HttpStatusCode.InternalServerError;
                    logger.LogError(exception, "Unhandled exception");

                    message = env.IsDevelopment()
                        ? exception.Message
                        : "Internal server error";
                }
                else
                {
                    message = exception.Message;
                }
            }

            context.Response.StatusCode = (int)status;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = message });
        }
    }
}
