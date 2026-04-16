using System.Net;
using AnimeApp.Application.Exceptions;

namespace AnimeApp.API.Middleware.Exceptions;

public static class ExceptionGroups
{
    public static readonly Dictionary<HttpStatusCode, Type[]> Groups = new()
    {
        // Групи виключень по статусам
        [HttpStatusCode.BadRequest] = // 400
        [
            typeof(InvalidOperationException),
            typeof(ArgumentException),
            typeof(AuthenticationException),
            typeof(InvalidUserIdFormatException),
            typeof(ArgumentNullException),
            typeof(ArgumentOutOfRangeException)
        ],
        [HttpStatusCode.Unauthorized] = // 401
        [
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
            typeof(EntityAlreadyExistsException),
            typeof(EmailAlreadyExistsException),
        ],
        [HttpStatusCode.FailedDependency] = // 424
        [
            typeof(FailedDependency)
        ]
    };
}
