namespace AnimeApp.Infrastructure.Exceptions
{
    /// <summary> Помилка на стороні API </summary>
    public class ExternalApiHttpException(string message, Exception? inner = null) : Exception(message, inner);

    /// <summary> Таймаут. API Довго не відповідає </summary>
    public class ExternalApiTimeoutException(string message, Exception? inner = null) : Exception(message, inner);

    /// <summary> Некоректний або неочікуваний формат відповіді API </summary>
    public class ExternalApiInvalidResponseException(string message, Exception? inner = null) : Exception(message, inner);

    /// <summary> Пуста відповідь </summary>
    public class ExternalApiEmptyResponseException(string message) : Exception(message);
}
