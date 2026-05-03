using AnimeApp.Application.Exceptions;
using AnimeApp.Infrastructure.Exceptions;
using System.Net;

namespace AnimeApp.API.Middleware.Exceptions;

public static class ExceptionGroups
{
    public static readonly Dictionary<HttpStatusCode, Type[]> Groups = new()
    {
        // Групи виключень по статусам
        [HttpStatusCode.BadRequest] = // 400
        [
            typeof(ArgumentException),
            typeof(AuthenticationException),
            typeof(ArgumentNullException),
            typeof(ArgumentOutOfRangeException)
        ],
        [HttpStatusCode.Unauthorized] = // 401
        [
            typeof(InvalidUserIdFormatException),
            typeof(UnauthorizedAccessException),
            typeof(MissingUserIdClaimException)
        ],
        [HttpStatusCode.NotFound] = // 404
        [
            typeof(KeyNotFoundException),
            typeof(FileNotFoundException),
            typeof(NotFoundException)
        ],
        [HttpStatusCode.Conflict] = // 409
        [
            typeof(AlreadyExistsException),
            typeof(EmailAlreadyExistsException),
        ],
        [HttpStatusCode.FailedDependency] = // 424
        [
            typeof(FailedDependency)
        ],
        [HttpStatusCode.BadGateway] = // 502
        [
            typeof(ExternalApiHttpException),
            typeof(ExternalApiInvalidResponseException),
            typeof(ExternalApiEmptyResponseException)
        ],
        [HttpStatusCode.GatewayTimeout] = // 504
        [
            typeof(ExternalApiTimeoutException)
        ]
    };
}
