
using AnimeApp.Application.Dto.Anime;
using FluentValidation;

namespace AnimeApp.Application.Validation.AnimeValidator
{ 
    public class AnimeTitleRequestValidator : AbstractValidator<AnimeTitleRequest>
    {
        public AnimeTitleRequestValidator()
        {
            RuleFor(t => t.Value)
                .NotEmpty()
                .WithMessage("Title value cannot be empty.");

            RuleFor(t => t.Language)
                .IsInEnum()
                .WithMessage("Invalid title language.");

            RuleFor(t => t.Type)
                .IsInEnum()
                .WithMessage("Invalid title type.");
        }
    }

}
