using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Anime;
using AnimeApp.Application.Services;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AnimeApplication.Core.Enums;
using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace AnimeApp.Tests
{
    public class AnimeServiceTests
    {
        [Fact]
        public async Task CreateAsync_ShouldReturnAnimeWithUrl()
        {
            // Arrange
            var animeRepositoryMock = new Mock<IAnimeRepository>();
            animeRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Anime>()))
                .Returns(Task.CompletedTask);

            var studioRepositoryMock = new Mock<IStudioRepository>();
            var genreRepositoryMock = new Mock<IGenreRepository>();
            var createValidatorMock = new Mock<IValidator<AnimeCreateRequest>>();
            var updateValidatorMock = new Mock<IValidator<AnimeUpdateRequest>>();
            var filterValidatorMock = new Mock<IValidator<AnimeFilter>>();
            var storageServiceMock = new Mock<IS3FileStorageService>();

            var service = new AnimeService(
            animeRepositoryMock.Object,
            studioRepositoryMock.Object,
            genreRepositoryMock.Object,
            createValidatorMock.Object,
            updateValidatorMock.Object,
            filterValidatorMock.Object,
            storageServiceMock.Object
        );

            var titles = new List<AnimeTitleRequest>
                {
                    new AnimeTitleRequest("Kusuriya no Hitorigoto 2", TitleLanguage.Romaji, TitleType.Official),
                    new AnimeTitleRequest("Монолог травниці", TitleLanguage.Ukrainian, TitleType.Official)
                };

            // Act
            var request = new AnimeCreateRequest(
                Titles: titles,
                Kind: AnimeKindEnum.TV,
                Status: AnimeStatusEnum.Released,
                Rating: AnimeRatingEnum.PG13,
                Description: "Second season",
                Poster: null,
                StudiosId: null,
                GenresId: null, //new List<int> { 7, 10, 12 },
                Screenshots: new List<IFormFile> { },
                AiredOn: new DateTime(2025, 1, 10),
                ReleasedOn: new DateTime(2025, 7, 4),
                Score: 9.6,
                Episodes: 24,
                EpisodesAired: 24,
                Duration: 24
                );

            var anime = await service.CreateAsync(request);

            // Assert
            anime.Should().NotBeNull();
            anime.Url.Should().Be("kusuriya-no-hitorigoto-2-0");
            anime.Season.Should().Be(SeasonEnum.Winter);
            anime.Year.Should().Be(2025);
            animeRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Anime>()), Times.Once);
        }
    }

}