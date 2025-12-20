using AnimeApp.Application.Dto.Requests.User;
using FluentValidation;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserUpdateValidator : AbstractValidator<UserUpdateRequest>
    {
        public UserUpdateValidator()
        {
            RuleFor(u => u.Nickname)
                .MaximumLength(100)
                .When(u => !string.IsNullOrEmpty(u.Nickname))
                .WithMessage("Maximum name length is 100 characters.");

            RuleFor(u => u.Email)
                .EmailAddress()
                .When(u => !string.IsNullOrEmpty(u.Email))
                .WithMessage("Invalid email format");

            RuleFor(u => u.Password)
                .MinimumLength(8)
                .Matches("^[a-zA-Z0-9]*$")
                .When(u => !string.IsNullOrEmpty(u.Password))
                .WithMessage("Password must contain only Latin letters and digits");
        }
    }
}