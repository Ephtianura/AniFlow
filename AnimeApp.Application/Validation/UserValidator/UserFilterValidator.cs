using AnimeApp.Core.Filters;
using FluentValidation;
using System;

namespace AnimeApp.Application.Validation.UserValidator
{
    public class UserFilterValidator : AbstractValidator<UserFilter>
    {
        public UserFilterValidator()
        {
            // 🔹 Пошук — необов’язковий, але якщо задано, то мінімум 2 символи
            RuleFor(f => f.Search)
                .MinimumLength(2)
                .When(f => !string.IsNullOrWhiteSpace(f.Search))
                .WithMessage("Пошуковий запит має містити щонайменше 2 символи");

            // 🔹 Дати — перевірка, щоб 'RegisteredFrom' не була пізніше 'RegisteredTo'
            RuleFor(f => f)
                .Must(f => !(f.RegisteredFrom.HasValue && f.RegisteredTo.HasValue && f.RegisteredFrom > f.RegisteredTo))
                .WithMessage("'Дата від' не може бути пізніше, ніж 'Дата до'");

            // 🔹 Сортування — якщо вказано, то лише дозволені поля
            RuleFor(f => f.SortBy)
                .Must(s => string.IsNullOrEmpty(s) ||
                           new[] { "FullName", "Email", "RegistrationDate" }
                               .Contains(s, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Поле сортування має бути одним із: FullName, Email, RegistrationDate");

            // 🔹 Номер сторінки — не може бути меншим за 1
            RuleFor(f => f.Page)
                .GreaterThan(0)
                .WithMessage("Номер сторінки має бути більшим за 0");

            // 🔹 Розмір сторінки — лише від 1 до 100
            RuleFor(f => f.PageSize)
                .InclusiveBetween(1, 100)
                .WithMessage("Розмір сторінки має бути в межах від 1 до 100");
        }
    }
}
