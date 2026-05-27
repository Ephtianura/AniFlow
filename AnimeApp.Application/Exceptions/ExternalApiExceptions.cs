namespace AnimeApp.Application.Exceptions
{
    /// <summary> Помилка при зверенні до сторонніх API </summary>
    public class ExternalApiException(string message, Exception? inner = null) : Exception(message, inner){}

    /// <summary> Помилка на стороні API </summary>
    public class ExternalApiHttpException(string message, Exception? inner = null) : ExternalApiException(message, inner);

    /// <summary> Таймаут. API Довго не відповідає </summary>
    public class ExternalApiTimeoutException(string message, Exception? inner = null) : ExternalApiException(message, inner);

    /// <summary> Некоректний або неочікуваний формат відповіді API </summary>
    public class ExternalApiInvalidResponseException(string message, Exception? inner = null) : ExternalApiException(message, inner);

    /// <summary> Пуста відповідь </summary>
    public class ExternalApiEmptyResponseException(string message, Exception? inner = null) : ExternalApiException(message, inner);
}