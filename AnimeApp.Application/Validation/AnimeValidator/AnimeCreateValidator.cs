using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Core.Enums;
using FluentValidation;
using System.Text.RegularExpressions;

namespace AnimeApp.Application.Validation.AnimeValidator
{
    public class AnimeCreateValidator : AbstractValidator<AnimeCreateRequest>
    {
        public AnimeCreateValidator()
        {
            // =================== Titles ===================
            RuleFor(r => r.Titles)
                .NotEmpty()
                .WithMessage("At least one title is required.");

            RuleForEach(r => r.Titles)
                .SetValidator(new AnimeTitleRequestValidator());

            RuleFor(x => x.Titles)
                .Must(titles => titles.Any(t =>
                    t.Type == TitleType.Official &&
                    t.Language == TitleLanguage.Romaji))
                .WithMessage("Anime must contain an official Romaji title.");

            RuleFor(x => x.Titles)
                .Must(titles =>
                {
                    var romajiTitle = titles.FirstOrDefault(t =>
                        t.Type == TitleType.Official &&
                        t.Language == TitleLanguage.Romaji);

                    return romajiTitle == null ||
                           Regex.IsMatch(
                               romajiTitle.Value,
                               @"^[A-Za-z0-9\s\-'!?:;.,&()]+$");
                })
                .WithMessage("Official Romaji title must contain only Latin characters.");

            // =================== StudioId ===================
            RuleFor(r => r.StudiosId)
                .GreaterThan(0)
                .When(r => r.StudiosId.HasValue)
                .WithMessage("StudioId must be a positive number.");

            // =================== GenresIds ===================
            RuleFor(r => r.GenresIds)
                .Must(ids => ids == null || ids.All(id => id > 0))
                .WithMessage("GenresIds must contain only positive IDs.");

            // =================== Dates ===================
            RuleFor(r => r)
                .Must(r =>
                    !r.AiredOn.HasValue ||
                    !r.ReleasedOn.HasValue ||
                    r.AiredOn <= r.ReleasedOn)
                .WithMessage("AiredOn cannot be later than ReleasedOn.");

            // =================== Enums ===================
            RuleFor(r => r.Kind)
                .IsInEnum()
                .When(r => r.Kind.HasValue)
                .WithMessage("Invalid anime kind.");

            RuleFor(r => r.Status)
                .IsInEnum()
                .When(r => r.Status.HasValue)
                .WithMessage("Invalid anime status.");

            RuleFor(r => r.Rating)
                .IsInEnum()
                .When(r => r.Rating.HasValue)
                .WithMessage("Invalid anime rating.");

            RuleFor(r => r.Source)
                .IsInEnum()
                .When(r => r.Source.HasValue)
                .WithMessage("Invalid anime source.");

            // =================== Score ===================
            RuleFor(r => r.Score)
                .InclusiveBetween(0, 10)
                .When(r => r.Score > 0)
                .WithMessage("Score must be between 0 and 10.");

            // =================== Episodes ===================
            RuleFor(r => r.Episodes)
                .GreaterThan(0)
                .When(r => r.Episodes.HasValue)
                .WithMessage("Episodes must be a positive number.");

            RuleFor(r => r.EpisodesAired)
                .GreaterThanOrEqualTo(0)
                .When(r => r.EpisodesAired.HasValue)
                .WithMessage("EpisodesAired must be zero or a positive number.");

            RuleFor(r => r)
                .Must(r =>
                    !r.Episodes.HasValue ||
                    !r.EpisodesAired.HasValue ||
                    r.EpisodesAired <= r.Episodes)
                .WithMessage("EpisodesAired cannot be greater than total Episodes.");

            // =================== Duration ===================
            RuleFor(r => r.Duration)
                .GreaterThan(0)
                .When(r => r.Duration.HasValue)
                .WithMessage("Duration must be a positive number.");

            // =================== Description ===================
            RuleFor(r => r.Description)
                .MaximumLength(5000)
                .When(r => !string.IsNullOrWhiteSpace(r.Description))
                .WithMessage("Description cannot exceed 5000 characters.");
        }
    }
}