import Link from "next/link";

import { AnimeKindMap } from "@/core/AnimeKind";
import {  AnimeStatusMap } from "@/core/AnimeStatus";
import {  AnimeRatingMap } from "@/core/AnimeRating";
import {  SeasonMap, Anime } from "@/core/types";
import { formatAnimeDates } from "./FormatAnimeDates";

interface Props {
    anime: Anime;
}

export function formatDuration(minutes: number, kind?: string) {
    if (!minutes) return "";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = "";

    if (hrs > 0) 
        result += `${hrs} год.`;
    if (mins > 0) 
        result += (hrs > 0 ? " " : "") + `${mins} хв.`;

    // Если фильм — без слова "серія"
    if (kind === "Movie" || kind === "Film" || kind === "movie") {
        return result;
    }

    // Если не фильм → добавляем " ~ серія"
    return result + " ~ серія";
}

export const AnimeInfo: React.FC<Props> = ({ anime }) => {
    const formatted = formatAnimeDates(anime);

    
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
                                href={{ pathname: "/animes", query: { MinEpisodes: anime.episodes, MaxEpisodes: anime.episodes } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {anime.episodes}
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
                                {AnimeStatusMap[anime.status]}
                            </Link>
                        </p>
                    </>
                )}

                {anime.genres?.length > 0 && (
                    <>
                        <p className="text-gray-dark">Жанр</p>
                        <div className="text-primary flex gap-1 flex-wrap">
                            {anime.genres.map((genre, index) => (
                                <Link
                                    key={genre.id}
                                    href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                    className="hover:underline hover:text-purple-700 cursor-pointer"
                                >
                                    {genre.nameUa}
                                    {index < anime.genres.length - 1 && <span className="text-primary-black">, </span>}
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {(anime.season || anime.year) && (
                    <>
                        <p className="text-gray-dark">Сезон</p>
                        <p className="text-primary hover:underline hover:text-purple-700 cursor-pointer">
                            <Link
                                href={{ pathname: "/animes", query: { season: anime.season } }}
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
                                href={{ pathname: "/animes", query: { StudioId: anime.studio.id } }}
                                className="hover:underline hover:text-purple-700 cursor-pointer"
                            >
                                {anime.studio.name}
                            </Link>
                        </p>
                    </>
                )}

                {anime.rating && (
                    <>
                        <p className="text-gray-dark">
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