namespace AnimeApp.API.Dto.User
{
    public record GetUserResponse(
      Guid Id,
      string FullName,
      string Email,
      string? Phone
      //DateTimeOffset RegistrationDate,
      //DateTimeOffset UpdatedDate
  );
}
