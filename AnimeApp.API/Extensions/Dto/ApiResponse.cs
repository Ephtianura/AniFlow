namespace AnimeApp.API.Extensions.Dto
{
    public record ApiResponse(string Message);
    public class ApiResponse<T>(string Message, T Data)
    {
        public string Message { get; set; } = Message;
        public T Data { get; set; } = Data;
    }
}
