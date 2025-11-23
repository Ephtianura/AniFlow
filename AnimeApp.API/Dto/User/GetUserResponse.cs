namespace AnimeApp.API.Dto.User
{
    public record GetUserMeResponse(
      int Id,
      string Nickname,
      string Email,
      int Role
        //DateTimeOffset RegistrationDate
  );
}
