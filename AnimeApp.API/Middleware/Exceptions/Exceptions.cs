namespace AnimeApp.Application.Exceptions
{
    
    // Коли з токена не вдалося витягти userId (відсутня claim)    
    public class MissingUserIdClaimException : UnauthorizedAccessException
    {
        public MissingUserIdClaimException()
            : base("Unable to determine user (no userId in token).") { }
    }

    
    // Коли userId у токені має невірний формат (не Guid)    
    public class InvalidUserIdFormatException : ArgumentException
    {
        public InvalidUserIdFormatException()
            : base("Invalid user ID format.") { }
    }
    public class FailedDependency : ArgumentException
    {
        public FailedDependency(string message)
            : base(message) { }
    }
}
