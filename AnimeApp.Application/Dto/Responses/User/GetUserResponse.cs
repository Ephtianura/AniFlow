namespace AnimeApp.Application.Dto.Responses.User
{
    public record GetUserMeResponse(
      int Id,
      string Nickname,
      string Email,
      int Role
        //DateTimeOffset RegistrationDate
  );
}
