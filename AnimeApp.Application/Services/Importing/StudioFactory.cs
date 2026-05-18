using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services.Importing
{
    public class StudioFactory(
        IStudioRepository studioRep,
        IS3FileStorageService fileStorage) : IStudioFactory
    {
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IStudioRepository _studioRep = studioRep;

        public async Task<Studio?> GetStudioFromRaw(List<CompanyDto>? raw)
        {
            if (raw == null) return null;

            var studioRaw = raw.FirstOrDefault(s => s.Type == "studio");
            if (studioRaw == null) return null;


            var studio = await _studioRep.GetByNameAsync(studioRaw.Name);
            if (studio != null )
            {
                if (studio.Slug == null)
                {
                    if (studio.Slug == null && studioRaw.Slug != null)
                        studio.ChangeSlug(studioRaw.Slug);

                    if (studio.PosterFileName == null && studioRaw.Image != null)
                        studio.ChangePoster(
                            await _fileStorage.UploadImageFromUrlAsync(studioRaw.Image, StoragePaths.StudioPosters));

                    await _studioRep.UpdateAsync(studio);
                }
            }
            else
            {
                studio = await CreateStudioFromRaw(studioRaw);
            }

            return studio;
        }

        public async Task<Studio?> CreateStudioFromRaw(CompanyDto studioRaw)
        {
            string? poster = null;

            if (!string.IsNullOrEmpty(studioRaw.Image))
            {
                poster = await _fileStorage.UploadImageFromUrlAsync(
                    studioRaw.Image,
                    StoragePaths.StudioPosters
                );
            }

            var studio = Studio.Create(name: studioRaw.Name, slug: studioRaw.Slug ?? "", posterFileName: poster);

            if (studioRaw.Slug == null)
            {
                var slug = AniBuilder.GenerateSlug(studio.Name, studio.Id);
                studio.ChangeSlug(slug);
            }

            await _studioRep.AddAsync(studio);
            return studio;
        }
    }
}
