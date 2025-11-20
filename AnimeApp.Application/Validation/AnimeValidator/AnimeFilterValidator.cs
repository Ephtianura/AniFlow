using AnimeApp.Core.Filters;
using FluentValidation;

namespace AnimeApp.Application.Validation.AnimeValidator
{
    public class AnimeFilterValidator : AbstractValidator<AnimeFilter>
    {
        public AnimeFilterValidator()
        {
            // Search — min 3 chars
            RuleFor(f => f.Search)
                .MinimumLength(3)
                .When(f => !string.IsNullOrWhiteSpace(f.Search))
                .WithMessage("Search query must contain at least 2 characters.");

            // GenresId — only positive
            RuleFor(f => f.GenresId)
                .Must(list => list == null || list.All(id => id > 0))
                .WithMessage("GenresId must contain only positive IDs.");

            // StudioId — > 0
            RuleFor(f => f.StudioId)
                .GreaterThan(0)
                .When(f => f.StudioId.HasValue)
                .WithMessage("StudioId must be a positive number.");

            // Year — reasonable range
            RuleFor(f => f.Year)
                .InclusiveBetween(1900, DateTime.Now.Year + 10)
                .When(f => f.Year.HasValue)
                .WithMessage("Year must be between 1900 and the next year.");

            // Aired: From ≤ To
            RuleFor(f => f)
                .Must(f => !(f.AiredFrom.HasValue && f.AiredTo.HasValue && f.AiredFrom > f.AiredTo))
                .WithMessage("AiredFrom cannot be later than AiredTo.");

            // Released: From ≤ To
            RuleFor(f => f)
                .Must(f => !(f.ReleasedFrom.HasValue && f.ReleasedTo.HasValue && f.ReleasedFrom > f.ReleasedTo))
                .WithMessage("ReleasedFrom cannot be later than ReleasedTo.");

            // Score 0–10
            RuleFor(f => f.MinScore)
                .InclusiveBetween(0, 10)
                .When(f => f.MinScore.HasValue)
                .WithMessage("MinScore must be between 0 and 10.");

            RuleFor(f => f.MaxScore)
                .InclusiveBetween(0, 10)
                .When(f => f.MaxScore.HasValue)
                .WithMessage("MaxScore must be between 0 and 10.");

            // Score: Min ≤ Max
            RuleFor(f => f)
                .Must(f => !(f.MinScore.HasValue && f.MaxScore.HasValue && f.MinScore > f.MaxScore))
                .WithMessage("MinScore cannot be greater than MaxScore.");

            // Episodes: positive numbers
            RuleFor(f => f.MinEpisodes)
                .GreaterThanOrEqualTo(0)
                .When(f => f.MinEpisodes.HasValue)
                .WithMessage("MinEpisodes must be 0 or greater.");

            RuleFor(f => f.MaxEpisodes)
                .GreaterThanOrEqualTo(0)
                .When(f => f.MaxEpisodes.HasValue)
                .WithMessage("MaxEpisodes must be 0 or greater.");

            // Episodes: Min ≤ Max
            RuleFor(f => f)
                .Must(f => !(f.MinEpisodes.HasValue && f.MaxEpisodes.HasValue && f.MinEpisodes > f.MaxEpisodes))
                .WithMessage("MinEpisodes cannot be greater than MaxEpisodes.");

            // Sorting — only allowed fields
            RuleFor(f => f.SortBy)
                .Must(s => string.IsNullOrEmpty(s) ||
                    new[] { "Title", "Score", "Episodes", "AiredOn", "ReleasedOn" }
                    .Contains(s, StringComparer.OrdinalIgnoreCase))
                .WithMessage("SortBy must be one of: Title, Score, Episodes, AiredOn, ReleasedOn.");

            // Page > 0
            RuleFor(f => f.Page)
                .GreaterThan(0)
                .WithMessage("Page must be greater than 0.");

            // PageSize 1–100
            RuleFor(f => f.PageSize)
                .InclusiveBetween(1, 500)
                .WithMessage("PageSize must be between 1 and 100.");
        }
    }
}
