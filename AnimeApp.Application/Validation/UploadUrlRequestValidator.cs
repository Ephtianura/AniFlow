using AnimeApp.Application.Dto.Requests;
using FluentValidation;

namespace AnimeApp.Application.Validation
{
    public class UploadUrlRequestValidator : AbstractValidator<UploadUrlRequest>
    {
        public UploadUrlRequestValidator()
        {
            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("URL не може бути порожнім")
                .Must(BeValidUrl).WithMessage("Некоректний формат URL")
                .Must(BeHttpOrHttps).WithMessage("URL має бути http або https");
        }

        private bool BeValidUrl(string url)
            => Uri.TryCreate(url, UriKind.Absolute, out _);

        private bool BeHttpOrHttps(string url)
            => Uri.TryCreate(url, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}
