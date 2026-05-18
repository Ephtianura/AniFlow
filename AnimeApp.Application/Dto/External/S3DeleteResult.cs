namespace AnimeApp.Application.Dto.External
{
    public class S3DeleteResult
    {
        public List<string> Deleted { get; set; } = [];
        public List<S3DeleteError> Errors { get; set; } = [];
    }

    public class S3DeleteError
    {
        public string Key { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string? Message { get; set; }
    }
}
