using AnimeApp.Application.Dto.Requests.User;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserUpdateAdminValidator : AbstractValidator<UserUpdateAdminRequest>
    {
        public UserUpdateAdminValidator()
        {
            RuleFor(u => u.Nickname)
            .MaximumLength(100)
            .When(u => !string.IsNullOrEmpty(u.Nickname))
            .WithMessage("Maximum name length is 100 characters");

            RuleFor(u => u.Email)
                .EmailAddress()
                .When(u => !string.IsNullOrEmpty(u.Email))
                .WithMessage("Invalid email format");

            RuleFor(x => x.Role)
                .IsInEnum().When(x => x.Role.HasValue)
                .WithMessage("Invalid role");
        }
    }

}
