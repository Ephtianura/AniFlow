import Link from "next/link";

import { AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeRatingMap } from "@/core/enums/AnimeRating";
import { Anime } from "@/core/types";
import { formatAnimeDates } from "../_functions/FormatAnimeDates";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { SeasonMap } from "@/core/enums/Season";
import { AnimeSourceMap } from "@/core/enums/AnimeSource";

interface Props {
    anime: Anime;
}

export function formatDuration(minutes: number, kind?: AnimeKindEnum | null) {
    if (!minutes) return "";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = "";

    if (hrs > 0)
        result += `${hrs} год.`;
    if (mins > 0)
        result += (hrs > 0 ? " " : "") + `${mins} хв.`;

    // Если фильм — без слова "серія"
    if (kind === AnimeKindEnum.Movie) {
        return result;
    }

    // Если не фильм → добавляем " ~ серія"
    return result + " ~ серія";
}


export const AnimeInfo: React.FC<Props> = ({ anime }) => {
    const formatted = formatAnimeDates(anime);
    const visibleGenres = anime.genres.slice(0, 15);
    return (
        <div>
            <div className="grid grid-cols-[35%_65%] gap-x-4 gap-y-1">

                {anime.kind && (
                    <>
                        <p className="text-gray-dark">Тип</p>
                        <p className="text-primary-black">
                            <Link
                                href={{ pathname: "/animes", query: { kind: anime.kind } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {AnimeKindMap[anime.kind]}
                            </Link>
                        </p>
                    </>
                )}

                {anime.episodes && (
                    <>
                        <p className="text-gray-dark">Епізоди</p>
                        <p className="text-primary-black">
                            <Link
                                href={{ pathname: "/animes", query: { minEpisodes: anime.episodes, maxEpisodes: anime.episodes } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                <span>{anime.episodesAired} / {anime.episodes ?? "?"}</span>
                            </Link>
                        </p>
                    </>
                )}

                {anime.status && (
                    <>
                        <p className="text-gray-dark">Статус</p>
                        <p className="text-primary hover:underline hover:text-purple-700 cursor-pointer">
                            <Link
                                href={{ pathname: "/animes", query: { status: anime.status } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {anime.status && AnimeStatusMap[anime.status]}
                            </Link>
                        </p>
                    </>
                )}

                {visibleGenres?.length > 0 && (
                    <>
                        <p className="text-gray-dark">Жанр</p>
                        <div className="text-primary flex gap-1 flex-wrap ">
                            {visibleGenres.map((genre, index) => (
                                <Link
                                    key={genre.id}
                                    href={{ pathname: "/animes", query: { genres: genre.slug } }}
                                    className="hover:underline hover:text-purple-700 cursor-pointer"
                                >
                                    {genre.nameUa}
                                    {index < visibleGenres.length - 1 && <span className="text-primary-black">, </span>}
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {(anime.source) && (
                    <>
                        <p className="text-gray-dark sm:hidden">Джерело</p>
                        <p className="text-gray-dark hidden sm:flex">Першоджерело</p>
                        <p className="text-primary-black">
                            {AnimeSourceMap[anime.source]}
                        </p>
                    </>
                )}

                {(anime.season || anime.year) && (
                    <>
                        <p className="text-gray-dark">Сезон</p>
                        <p className="text-primary hover:underline hover:text-purple-700 cursor-pointer">
                            <Link
                                href={{ pathname: "/animes", query: { season: anime.season, year: anime.year } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {anime.season ? SeasonMap[anime.season] : ""} {anime.year || ""}
                            </Link>
                        </p>
                    </>
                )}

                {formatted && (
                    <>
                        <p className="text-gray-dark">Випуск</p>
                        <p className="text-primary-black">{formatted}</p>
                    </>
                )}

                {anime.studio?.name && (
                    <>
                        <p className="text-gray-dark">Студія</p>
                        <p className="text-primary hover:underline hover:text-purple-700 cursor-pointer">
                            <Link
                                href={{ pathname: "/animes", query: { studio: anime.studio.slug } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {anime.studio.name}
                            </Link>
                        </p>
                    </>
                )}

                {anime.rating && (
                    <>
                        <p className="text-gray-dark flex gap-1">
                            <span className="hidden md:block">Рейтинг</span> <span>MPAA</span>
                        </p>
                        <p className="text-primary-black underline">{anime.rating}</p>
                    </>
                )}

                {anime.rating && AnimeRatingMap[anime.rating] && (
                    <>
                        <p className="text-gray-dark">Вікові обмеження</p>
                        <div className="flex items-center">
                            <p className="text-white bg-primary-black rounded-sm px-1 font-bold">
                                {AnimeRatingMap[anime.rating]}
                            </p>
                        </div>
                    </>
                )}

                {anime.duration && (
                    <>
                        <p className="text-gray-dark">Тривалість</p>
                        <p className="text-primary-black">
                            {formatDuration(anime.duration, anime.kind)}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
