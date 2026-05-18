using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using System.Text.RegularExpressions;
using static MassTransit.ValidationResultExtensions;

namespace AnimeApp.Application.Helpers
{
    public static class AniBuilder
    {
        public static string GenerateSlug(string value, int id)
        {
            value = value.Trim().ToLowerInvariant();

            // Видалити все окрім a-z 0-9
            value = Regex.Replace(value, @"[^a-z0-9\s-]", "");

            // Заміна всіх " " на "-"
            value = Regex.Replace(value, @"\s+", "-");

            // Заміна повторів "---" на "-"
            value = Regex.Replace(value, @"-+", "-");

            return $"{value}-{id}";
        }

        /// <summary> Розраховує та повертає сезон по місяцю випуску </summary>
        public static SeasonEnum? SeasonFromDateMapper(DateTime date)
        {
            return date.Month switch
            {
                12 or 1 or 2 => SeasonEnum.Winter,
                3 or 4 or 5 => SeasonEnum.Spring,
                6 or 7 or 8 => SeasonEnum.Summer,
                9 or 10 or 11 => SeasonEnum.Fall,
                _ => null
            };
        }

        public static AnimeStatusEnum? MapStatus(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value
                .Trim()
                .ToLowerInvariant()
                .Replace("_", " ")
                .Replace("-", " ");

            return value switch
            {
                "anons" or "announced" or "upcoming" or "not yet aired"
                    => AnimeStatusEnum.Anons,

                "ongoing" or "airing" or "currently airing"
                    => AnimeStatusEnum.Ongoing,

                "released" or "finished" or "completed" or "done"
                    => AnimeStatusEnum.Released,

                _ => null
            };
        }

        public static SeasonEnum? MapSeason(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value.Trim().ToLowerInvariant();

            return value switch
            {
                "winter" or "зима"
                    => SeasonEnum.Winter,

                "spring" or "весна"
                    => SeasonEnum.Spring,

                "summer" or "літо" or "лето"
                    => SeasonEnum.Summer,

                "fall" or "autumn" or "осінь" or "осень"
                    => SeasonEnum.Fall,

                _ => null
            };
        }

        public static AnimeKindEnum? MapKind(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value
                .Trim()
                .ToLowerInvariant()
                .Replace("_", " ")
                .Replace("-", " ");

            return value switch
            {
                "tv" or "tv series" or "series"
                    => AnimeKindEnum.TV,

                "movie" or "film"
                    => AnimeKindEnum.Movie,

                "ova"
                    => AnimeKindEnum.OVA,

                "ona"
                    => AnimeKindEnum.ONA,

                "special"
                    => AnimeKindEnum.Special,

                "tv special"
                    => AnimeKindEnum.TVSpecial,

                "music"
                    => AnimeKindEnum.Music,

                "pv"
                    => AnimeKindEnum.PV,

                "cm"
                    => AnimeKindEnum.CM,

                _ => null
            };
        }

        public static AnimeRatingEnum? MapRating(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value.Trim().ToLowerInvariant()
                .Replace("_", "")
                .Replace("-", "")
                .Replace(" ", "");

            return value switch
            {
                "g" => AnimeRatingEnum.G,

                "pg" => AnimeRatingEnum.PG,

                "pg13" or "pg12" => AnimeRatingEnum.PG13,

                "r" => AnimeRatingEnum.R,

                "rplus" or "r+" => AnimeRatingEnum.RPlus,

                "rx" or "r18" or "nc17" or "xxx" => AnimeRatingEnum.RX,

                _ => null
            };
        }

        public static AnimeSource? MapSource(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value
                .Trim()
                .ToLowerInvariant()
                .Replace("_", " ")
                .Replace("-", " ");

            return value switch
            {
                "original" or "no source" or "none"
                    => AnimeSource.Original,

                "manga" or "comic"
                    => AnimeSource.Manga,

                "ranobe" or "ranobe novel" or "light novel" or "ln"
                    => AnimeSource.LightNovel,

                "web novel" or "wn"
                    => AnimeSource.WebNovel,

                "visual novel" or "vn"
                    => AnimeSource.VisualNovel,

                "game" or "video game" or "pc game" or "mobile game"
                    => AnimeSource.Game,

                "book" or "novel"
                    => AnimeSource.Book,

                "picture book"
                    => AnimeSource.PictureBook,

                "mixed media" or "media mix" or "multimedia project"
                    => AnimeSource.MixedMedia,

                _ => null
            };
        }

        public static List<AnimeTitle> MapTitles(string mainRomaji,
                                                string? titleUa,
                                                string? titleEn,
                                                string? titleJa,
                                                List<string>? synonyms)
        {
            var result = new List<AnimeTitle>
            {
                AnimeTitle.Create(
                   mainRomaji.Trim(),
                   TitleLanguage.Romaji,
                   TitleType.Official)
            };

            if (!string.IsNullOrWhiteSpace(titleUa))
            {
                result.Add(AnimeTitle.Create(
                    titleUa.Trim(),
                    TitleLanguage.Ukrainian,
                    TitleType.Official));
            }

            if (!string.IsNullOrWhiteSpace(titleEn))
            {
                result.Add(AnimeTitle.Create(
                    titleEn.Trim(),
                    TitleLanguage.English,
                    TitleType.Official));
            }

            if (!string.IsNullOrWhiteSpace(titleJa))
            {
                result.Add(AnimeTitle.Create(
                    titleJa.Trim(),
                    TitleLanguage.Japanese,
                    TitleType.Official));
            }

            if (synonyms is { Count: > 0 })
            {
                foreach (var synonym in synonyms)
                {
                    if (string.IsNullOrWhiteSpace(synonym))
                        continue;

                    result.Add(AnimeTitle.Create(
                        synonym.Trim(),
                        TitleLanguage.Ukrainian,
                        TitleType.Synonym));
                }
            }
            return result;
        }

        public static string BuildMainRomajiSlug(string? slug, string? titleJa, string? titleEn)
        {
            if (!string.IsNullOrWhiteSpace(slug))
            {
                var cleaned = CleanHash(slug);

                if (!string.IsNullOrWhiteSpace(cleaned))
                    return cleaned;
            }

            if (!string.IsNullOrWhiteSpace(titleJa))
            {
                var normalized = NormalizeToSlug(titleJa);

                if (!string.IsNullOrWhiteSpace(normalized))
                    return normalized;
            }

            if (!string.IsNullOrWhiteSpace(titleEn))
            {
                var normalized = NormalizeToSlug(titleEn);

                if (!string.IsNullOrWhiteSpace(normalized))
                    return normalized;
            }

            static string CleanHash(string value)
            {
                var lastDash = value.LastIndexOf('-');
                if (lastDash > 0)
                {
                    var tail = value[(lastDash + 1)..];

                    // если похоже на hash (как d7b756)
                    if (tail.Length <= 12 && tail.All(char.IsLetterOrDigit))
                        return value[..lastDash];
                }

                return value;
            }

            static string NormalizeToSlug(string value)
            {
                value = value.Trim().ToLowerInvariant();

                value = Regex.Replace(value, @"[^a-z0-9\s\-]", "");

                value = Regex.Replace(value, @"\s+", " ");
                value = value.Replace(" ", "-");

                return value;
            }

            throw new InvalidOperationException("Cannot build romaji slug: all sources are empty");
        }

        public static string BuildRomajiFromSlug(string slug)
        {
            var asSentences = char.ToUpperInvariant(slug[0]) + slug[1..];
            return Regex.Replace(asSentences, "-", " ");
        }

        public static OstType MapOstType(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return OstType.Other;

            value = value
                .Trim()
                .ToLowerInvariant()
                .Replace("_", " ")
                .Replace("-", " ");

            return value switch
            {
                "opening" or "op" or "ops"
                    => OstType.Opening,

                "ending" or "ed" or "eds"
                    => OstType.Ending,

                "insert" or "insert song" or "insert theme"
                    => OstType.Insert,

                _ => OstType.Other
            };
        }

        public static VideoKind MapVideoKind(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return VideoKind.Other;

            value = value.Trim().ToLowerInvariant()
                .Replace("_", " ")
                .Replace("-", " ");

            if (value.Contains("anime ver") || value.Contains("tv size") || value.Contains("size edit"))
                return VideoKind.AnimeVersion;

            if (value.Contains("artist ver") || value.Contains("full") || value.Contains("complete version"))
                return VideoKind.ArtistVersion;

            if (value.Contains("live"))
                return VideoKind.Live;

            if (value.Contains("pv") || value.Contains("promo"))
                return VideoKind.Promo;

            if (value.Contains("trailer"))
                return VideoKind.Trailer;

            if (value.Contains("teaser") || value.Contains("announcement"))
                return VideoKind.Teaser;

            if (value.Contains("cm") || value.Contains("commercial"))
                return VideoKind.Commercial;

            var match = Regex.Match(value, @"^[a-z]+");

            var token = match.Success ? match.Value : string.Empty;

            return token switch
            {
                "op" or "opening" => VideoKind.AnimeVersion,
                "ed" or "ending" => VideoKind.AnimeVersion,
                "pv" => VideoKind.Promo,
                "cm" => VideoKind.Commercial,
                "teaser" => VideoKind.Teaser,
                "trailer" => VideoKind.Trailer,
                "announcement" => VideoKind.Teaser,

                _ => VideoKind.Other
            };
        }
    }
}
