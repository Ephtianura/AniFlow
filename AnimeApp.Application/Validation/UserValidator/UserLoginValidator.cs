using AnimeApp.Application.Dto.User;
using FluentValidation;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserLoginValidator : AbstractValidator<LoginUserRequest>

    {
        public UserLoginValidator()
        {
            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(u => u.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches("^[a-zA-Z0-9]*$").WithMessage("Password must contain only Latin letters and digits");
        }
    }
}
