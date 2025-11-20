using AnimeApp.Application.Dto.User;
using FluentValidation;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserRegisterValidator : AbstractValidator<RegisterUserRequest>

    {
        public UserRegisterValidator()
        {
            RuleFor(u => u.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MaximumLength(100).WithMessage("Maximum name length is 100 characters.");

            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                     .NotEmpty().WithMessage("Password is required")
                     .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                     .Matches("^[a-zA-Z0-9]*$").WithMessage("Password must contain only Latin letters and digits");
        }
    }
}
