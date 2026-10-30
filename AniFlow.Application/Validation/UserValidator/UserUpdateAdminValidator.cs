using AniFlow.Application.Dto.Requests.User;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniFlow.Application.Validation.UserValidator
{
    public class UserUpdateAdminValidator : AbstractValidator<UserUpdateAdminRequest>
    {
        public UserUpdateAdminValidator()
        {
            RuleFor(u => u.Nickname)
            .MaximumLength(100)
            .When(u => !string.IsNullOrWhiteSpace(u.Nickname))
            .WithMessage("Maximum name length is 100 characters");

            RuleFor(u => u.Email)
                .EmailAddress()
                .When(u => !string.IsNullOrWhiteSpace(u.Email))
                .WithMessage("Invalid email format");

            RuleFor(x => x.Role)
                .IsInEnum().When(x => x.Role.HasValue)
                .WithMessage("Invalid role");
        }
    }

}
