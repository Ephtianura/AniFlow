
namespace AnimeApp.Application.Exceptions
{
    /// <summary> Вже існує ел. адреса </summary>
    public class EmailAlreadyExistsException : Exception
    {
        public EmailAlreadyExistsException(string email)
            : base($"User with email '{email}' already exists.") { }
    }

    /// <summary> Невдала авторизація </summary>
    public class AuthenticationException : Exception
    {
        public AuthenticationException()
            : base("Invalid email or password.") { }
    }

    public class NotFoundException : Exception
    {
        public NotFoundException(string entityName, int id)
            : base($"{entityName} with id {id} not found.") { }
        public NotFoundException(string entityName)
            : base($"{entityName} not found.") { }
    }

    public class BadRequestException : Exception
    {
        public BadRequestException(string message)
            : base(message) { }
    }
    public class AlreadyExistsException : Exception
    {
        public AlreadyExistsException()
            : base() { }
        public AlreadyExistsException(string message)
            : base(message) { }
        public AlreadyExistsException(string entityName, object key)
            : base($"{entityName} with key '{key}' already exists.") { }
    }
}
