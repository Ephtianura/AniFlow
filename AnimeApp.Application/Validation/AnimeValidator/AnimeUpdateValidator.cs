using AnimeApp.Application.Dto.Anime;
using AnimeApp.Application.Validation.AnimeValidator;
using FluentValidation;

public class AnimeUpdateRequestValidator : AbstractValidator<AnimeUpdateRequest>
{
    public AnimeUpdateRequestValidator()
    {
        // =================== Titles ===================
        RuleFor(r => r.Titles)
            .Must(list => list == null || list.Count > 0)
            .WithMessage("Titles list cannot be empty if provided.");

        When(r => r.Titles != null, () =>
        {
            RuleForEach(r => r.Titles!)
                .SetValidator(new AnimeTitleRequestValidator());
        });


        // =================== Poster ===================
        //RuleFor(r => r.Poster)
        //    .Must(f => f == null || f.Length > 0)
        //    .WithMessage("Poster file cannot be empty.");


        //// ================= Screenshots =================
        //RuleFor(r => r.Screenshots)
        //    .Must(list => list == null || (list.Count > 0 && list.All(f => f.Length > 0)))
        //    .WithMessage("Screenshots cannot contain empty files.")
        //    .Must(list => list == null || list.Count < 30)
        //    .WithMessage("Screenshots cannot contain more than 30 files.");


        // ================= StudioId ===================
        RuleFor(r => r.StudiosId)
            .GreaterThan(0)
            .When(r => r.StudiosId.HasValue)
            .WithMessage("StudioId must be a positive number.");


        // ================= GenresId ===================
        RuleFor(r => r.GenresId)
            .Must(list => list == null || list.All(id => id > 0))
            .WithMessage("GenresId must contain only positive IDs.");


        // =================== Dates ====================
        RuleFor(r => r)
            .Must(r =>
                !(r.AiredOn.HasValue &&
                  r.ReleasedOn.HasValue &&
                  r.AiredOn > r.ReleasedOn))
            .WithMessage("AiredOn cannot be later than ReleasedOn.");


        // ================= Enum fields =================
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

        RuleFor(r => r.Season)
            .IsInEnum()
            .When(r => r.Season.HasValue)
            .WithMessage("Invalid anime season.");


        // ================= Year ===================
        RuleFor(r => r.Year)
            .InclusiveBetween(1900, DateTime.Now.Year + 10)
            .When(r => r.Year.HasValue)
            .WithMessage("Year must be between 1900 and next 10 years.");


        // ================= Score ==================
        RuleFor(r => r.Score)
            .InclusiveBetween(0, 10)
            .When(r => r.Score.HasValue)
            .WithMessage("Score must be between 0 and 10.");


        // ================= Episodes ==================
        RuleFor(r => r.Episodes)
            .GreaterThan(0)
            .When(r => r.Episodes.HasValue)
            .WithMessage("Episodes must be a positive number.");

        RuleFor(r => r.EpisodesAired)
            .GreaterThanOrEqualTo(0)
            .When(r => r.EpisodesAired.HasValue)
            .WithMessage("EpisodesAired must be zero or a positive number.")
            .LessThanOrEqualTo(r => r.Episodes)
            .When(r => r.EpisodesAired.HasValue && r.Episodes.HasValue)
            .WithMessage("EpisodesAired cannot be greater than total Episodes.");


        // ================= Duration ==================
        RuleFor(r => r.Duration)
            .GreaterThan(0)
            .When(r => r.Duration.HasValue)
            .WithMessage("Duration must be a positive number.");


        // ================= Description ==================
        RuleFor(r => r.Description)
            .MaximumLength(5000)
            .When(r => !string.IsNullOrEmpty(r.Description))
            .WithMessage("Description cannot exceed 5000 characters.");
    }
}
