using AnimeApp.Application.Dto.Anime;
using AnimeApp.Core.Enums;
using FluentValidation;
using System.Text.Json;

namespace AnimeApp.Application.Validation.AnimeValidator
{
    public class AnimeCreateValidator : AbstractValidator<AnimeCreateRequest>
    {
        public AnimeCreateValidator()
        {
            //=================== Titles ===================
            RuleFor(r => r.Titles)
                .NotEmpty()
                .WithMessage("At least one title is required.");
            When(r => r.Titles != null, () =>
            {
                RuleForEach(r => r.Titles!)
                    .SetValidator(new AnimeTitleRequestValidator());
            });
            // ================= Poster =================
            //RuleFor(r => r.Poster)
            //    .Must(f => f == null || f.Length > 0)
            //    .WithMessage("Poster file cannot be empty.");

            //// ================ Screenshots =================
            //RuleFor(r => r.Screenshots)
            //    .Must(list => list == null || (list.Count > 0 && list.All(f => f.Length > 0)))
            //    .WithMessage("Screenshots cannot contain empty files.")
            //    .Must(list => list == null || list.Count < 30)
            //    .WithMessage("Screenshots cannot contain more than 30 files.");

            // ================ StudioId =================
            RuleFor(r => r.StudiosId)
                .GreaterThan(0)
                .When(r => r.StudiosId.HasValue)
                .WithMessage("StudioId must be a positive number.");

            // ================ GenresId =================
            RuleFor(r => r.GenresId)
                .Must(list => list == null || list.All(id => id > 0))
                .WithMessage("GenresId must contain only positive IDs.");

            // ================= Dates ==================
            RuleFor(r => r)
                .Must(r => !(r.AiredOn.HasValue && r.ReleasedOn.HasValue && r.AiredOn > r.ReleasedOn))
                .WithMessage("AiredOn cannot be later than ReleasedOn.");

            // ================= Enum fields ==================
            RuleFor(r => r.Kind)
                .IsInEnum()
                .WithMessage("Invalid anime kind.");

            RuleFor(r => r.Status)
                .IsInEnum()
                .WithMessage("Invalid anime status.");

            RuleFor(r => r.Rating)
                .IsInEnum()
                .WithMessage("Invalid anime rating.");

            // ================= Score ==================
            RuleFor(r => r.Score)
                .InclusiveBetween(0, 10)
                .WithMessage("Score must be between 0 and 10.");

            // ================= Episodes ==================
            RuleFor(r => r.Episodes)
                .GreaterThan(0)
                .WithMessage("Episodes must be a positive number.");

            RuleFor(r => r.EpisodesAired)
                .GreaterThanOrEqualTo(0)
                .When(r => r.EpisodesAired >= 0)
                .WithMessage("EpisodesAired must be zero or a positive number.")
                .LessThanOrEqualTo(r => r.Episodes)
                .When(r => r.Episodes > 0)
                .WithMessage("EpisodesAired cannot be greater than total Episodes.");

            // ================= Duration ==================
            RuleFor(r => r.Duration)
                .GreaterThan(0)
                .WithMessage("Duration must be a positive number.");

            // ================= Description ==================
            RuleFor(r => r.Description)
                .MaximumLength(5000)
                .When(r => !string.IsNullOrEmpty(r.Description))
                .WithMessage("Description cannot exceed 5000 characters.");

        }
    }


}
