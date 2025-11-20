using System.Net;
using AnimeApp.Application.Exceptions;

namespace AnimeApp.API.Middleware.Exceptions;

public static class ExceptionGroups
{
    public static readonly Dictionary<HttpStatusCode, Type[]> Groups = new()
    {
        // Групи виключень по статусам
        [HttpStatusCode.NotFound] =
        [
            typeof(KeyNotFoundException),
            typeof(FileNotFoundException),
            typeof(EntityNotFoundException)
        ],
        [HttpStatusCode.Conflict] =
        [
            typeof(EntityAlreadyExistsException),
        ],
        [HttpStatusCode.Unauthorized] =
        [
            typeof(UnauthorizedAccessException),
            typeof(MissingUserIdClaimException)
        ],
        [HttpStatusCode.BadRequest] =
        [
            typeof(InvalidOperationException),
            typeof(ArgumentException),
            typeof(EmailAlreadyExistsException),
            typeof(AuthenticationException),
            typeof(InvalidUserIdFormatException)            
        ],
        [HttpStatusCode.FailedDependency] =
        [
            typeof(FailedDependency)
        ]
    };
}
