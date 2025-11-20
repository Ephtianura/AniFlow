using AnimeApp.Application.Dto.User;
using FluentValidation;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateValidator()
        {
            RuleFor(u => u.FullName)
                .MaximumLength(100)
                .When(u => !string.IsNullOrEmpty(u.FullName))
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

            RuleFor(u => u.Phone)
                .Matches(@"^\+?[0-9]*$")
                .MaximumLength(20)
                .When(u => !string.IsNullOrEmpty(u.Phone))
                .WithMessage("Phone can contain only digits and optional leading +");
        }
    }
}