"use client";
import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import WhiteCard from '@/components/WhiteCard';
import ScreenshotsPreview from '@/components/ScreenshotsPreview';
import PosterViewer from '@/components/PosterViewer';
import { BsFillStarFill } from "react-icons/bs";
import React from 'react';
import Link from "next/link";
import { FaSort } from "react-icons/fa";

import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { AnimeStatusEnum, AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeRatingEnum, AnimeRatingMap } from "@/core/enums/AnimeRating";
import { SeasonEnum, SeasonMap } from "@/core/enums/Season";
import { RelationKindEnum, RelationKindMap } from "@/core/enums/RelationKind";
import { MyListEnum, MyListMap } from "@/core/enums/MyList";
import { format } from "path";
import AnimeUserActions from "@/components/AnimeUserActions"


interface AnimeTitle {
    id: number;
    animeId: number;
    value: string;
    language: string;
    type: string;
}
interface RelatedAnime {
    id: number;
    relationKind: keyof typeof RelationKindEnum;
    titles: AnimeTitle[];
    url: string;
    posterUrl: string | null;
    airedOn?: string;
    releasedOn?: string;
    score?: number;
    episodes?: number;
    season?: string;
    year?: number;
    rating?: string;
    kind?: string;
    status?: string;
    description?: string;
    genres: { id: number; nameUa: string }[];
}
interface Anime {
    id: number;
    titles: AnimeTitle[];
    airedOn: string;
    releasedOn: string;
    score: number;
    totalScores: number;
    episodes: number;
    episodesAired: number;
    duration: number;
    season: string;
    year: number;
    rating: string;
    kind: string;
    status: string;
    description: string;
    posterUrl: string | null;
    screenshotsUrls: string[];
    url: string;
    studio: {
        id: number;
        name: string;
    };
    genres: { id: number; nameUa: string }[];
    relateds?: RelatedAnime[];
}
function episodesText(count: number | undefined) {
    if (!count) return "";
    if (count % 10 === 1 && count % 100 !== 11) return `${count} епізод`;
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} епізоди`;
    return `${count} епізодів`;
}
export function formatDuration(minutes: number, kind?: string) {
    if (!minutes) return "";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = "";

    if (hrs > 0) {
        result += `${hrs} год.`;
    }

    if (mins > 0) {
        result += (hrs > 0 ? " " : "") + `${mins} хв.`;
    }

    // Если фильм — без слова "серія"
    if (kind === "Movie" || kind === "Film" || kind === "movie") {
        return result;
    }

    // Если не фильм → добавляем " ~ серія"
    return result + " ~ серія";
}

export function useAnime(id: string | number) {
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/Animes/${id}`)


            .then(res => res.json())
            .then(data => {
                if (!data || !data.id) {
                    setAnime(null);
                } else {
                    setAnime(data);
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));


    }, [id]);

    return { anime, loading, error };
}

export default function AnimePage({ params }: { params: Promise<{ animeUrl: string }> }) {
    const router = useRouter();
    const { animeUrl } = use(params);

    const parts = animeUrl.split("-");
    const id = parts.at(-1) || "";

    const { anime, loading, error } = useAnime(id);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    let formatted = "";
    if (anime) {
        if (anime.airedOn && anime.releasedOn) {
            formatted = `з ${new Intl.DateTimeFormat('uk-UA', options).format(new Date(anime.airedOn))} по ${new Intl.DateTimeFormat('uk-UA', options).format(new Date(anime.releasedOn))}`;
        } else if (anime.airedOn) {
            formatted = `з ${new Intl.DateTimeFormat('uk-UA', options).format(new Date(anime.airedOn))}`;
        } else if (anime.releasedOn) {
            formatted = `до ${new Intl.DateTimeFormat('uk-UA', options).format(new Date(anime.releasedOn))}`;
        }
    }

    useEffect(() => {
        async function fetchAnime() {
            let data: Anime;
            let res: Response;

            // Проверяем, есть ли в конце animeUrl число (последний сегмент после дефиса)
            const parts = animeUrl.split("-");
            const lastPart = parts[parts.length - 1];

            if (/^\d+$/.test(lastPart)) {
                // Если число — используем как ID
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Animes/${lastPart}`);
                data = await res.json();

                if (data && data.url && data.url !== animeUrl) {
                    // Подставляем красивый URL
                    router.replace(`/anime/${data.url}`);
                }
            }
        }

        fetchAnime();
    }, [animeUrl, router]);



    useEffect(() => {
        if (!loading && !error && anime === null) {
            router.replace("/not-found");
        }
    }, [anime, loading, error, router]);
    // if (loading) return <WhiteCard><p>Завантаження аніме...</p></WhiteCard>;
    if (error) return <WhiteCard><p>Помилка: {error}</p></WhiteCard>;
    if (!anime) return null;

    return (

        <main>
            <WhiteCard>
                <div className='flex flex-col'>

                    {/* Постер та інформація */}
                    <div className='grid grid-cols-[auto_1fr] gap-x-6  '>
                        {/* Постер та додаваня у список */}
                        <div className='flex flex-col gap-4'>

                            {/* Постер */}
                            <PosterViewer posterUrl={anime.posterUrl || "/404.gif"} />

                            {/* Cписок */}
                            {/* TODO */}
                            <WhiteCard>
                                <div>
                                    <div>
                                        <div className="relative">
                                            <select className="btn-primary w-full appearance-none">
                                                <option value="">Додати до списку</option>
                                                {Object.keys(MyListEnum)
                                                    .filter((key) => isNaN(Number(key)))
                                                    .map((key) => (
                                                        <option key={key} value={key}>
                                                            {MyListMap[key]}
                                                        </option>
                                                    ))}
                                            </select>
                                            <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text-dark" />
                                        </div>
                                    </div>
                                </div>
                            </WhiteCard>

                        </div>

                        {/* Інформація */}
                        <div className='flex flex-col'>

                            {/* Рейтинг */}
                            <div className='flex gap-2 items-center h-11'>

                                {/* Зірочка */}
                                <div>
                                    <BsFillStarFill className='text-[#E4BB24] w-8 h-8 mb-1' />
                                </div>

                                {/* Рейтинг із 10 */}
                                <div className='flex flex-col pr-1'>

                                    <div className='flex items-end text-primary-black'>
                                        <p className='text-2xl'>
                                            {anime.score.toFixed(1)}
                                        </p>
                                        <p className='text-[10px]'>
                                            /10
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[10px]'>
                                            {anime.totalScores}
                                        </p>
                                    </div>
                                </div>

                                {/* Оцінити */}
                                <div className="flex items-center group">

                                    {/* Кнопка "Оцінити аніме" */}
                                    <div className="flex items-center w-30 py-1 hover:bg-primary hover:text-white 
                                    transition-colors duration-400 cursor-pointer
                                    border-l border-[#B2B2B2] hover:border-primary">
                                        <div className="flex items-center gap-2 pl-2">
                                            <BsFillStarFill className="text-[#D1D1D1] w-8 h-8 group-hover:text-white mb-1" />
                                            <p className="text-primary-black text-[13px] leading-tight group-hover:text-white">
                                                Оцінити аніме
                                            </p>
                                        </div>
                                    </div>

                                    {/* Скриті зірочки */}
                                    <div className="hidden group-hover:flex items-center w-69 h-full bg-[#B3B3B3] p-2 gap-1 transition-all duration-300">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <BsFillStarFill key={i} className="text-[#D1D1D1] w-6 h-6 hover:text-white mb-1" />
                                        ))}
                                    </div>

                                </div>


                            </div>

                            {/* Назви */}
                            <div className='flex flex-col'>
                                <p className='text-primary-black text-[40px] font-medium py-1'>
                                    {anime.titles.find(t => t.language === "Ukrainian" && t.type === "Official")?.value
                                        || anime.titles.find(t => t.language === "Ukrainian")?.value}
                                </p>
                                <p className='text-primary-black text-sm'>
                                    {anime.titles.find(t => t.language === "Romaji" && t.type === "Official")?.value
                                        || anime.titles.find(t => t.language === "Romaji")?.value}
                                </p>
                                <p className='text-primary-black text-sm'>
                                    {anime.titles.find(t => t.language === "English" && t.type === "Official")?.value
                                        || anime.titles.find(t => t.language === "English")?.value}
                                </p>
                                <p className='text-primary-black text-sm'>
                                    {anime.titles.find(t => t.language === "Japanese" && t.type === "Official")?.value
                                        || anime.titles.find(t => t.language === "Japanese")?.value}
                                </p>
                            </div>


                            <hr className='text-hr-clr my-4' />

                            {/* Anime-info */}
                            <div>
                                <div className="grid grid-cols-[35%_65%] gap-x-4 gap-y-1">

                                    {/* Тип (Kind) */}
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

                                    {/* Епізоди */}
                                    {anime.episodes ? (
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
                                    ) : null}

                                    {/* Статус */}
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

                                    {/* Жанр */}
                                    {anime.genres && anime.genres.length > 0 && (
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

                                    {/* Сезон */}
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

                                    {/* Випуск */}
                                    {formatted && (
                                        <>
                                            <p className="text-gray-dark">Випуск</p>
                                            <p className="text-primary-black">{formatted}</p>
                                        </>
                                    )}

                                    {/* Студія */}
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

                                    {/* Рейтинг MPAA */}
                                    {anime.rating && (
                                        <>
                                            <p className="text-gray-dark">Рейтинг MPAA</p>
                                            <p className="text-primary-black underline">{anime.rating}</p>
                                        </>
                                    )}

                                    {/* Вікові обмеження */}
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

                                    {/* Тривалість */}
                                    {anime.duration ? (
                                        <>
                                            <p className="text-gray-dark">Тривалість</p>
                                            <p className="text-primary-black">
                                                {formatDuration(anime.duration, anime.kind)}
                                            </p>
                                        </>
                                    ) : null}

                                </div>



                            </div>
                        </div>
                    </div>

                    {/* Опис */}
                    <div className='py-4'>
                        {anime.description.split('\n').map((para, index) => (
                            <p key={index} className='text-primary-black text-justify mb-2'>
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Кадри */}
                    <div className='mt-3 w-full'>
                        <ScreenshotsPreview
                            images={anime.screenshotsUrls}
                        />
                    </div>
                    {/* Пов'язане */}
                    {anime.relateds && anime.relateds.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-primary-black text-2xl font-medium">Пов'язане</h4>
                            <hr className="text-[#CCCCCC] my-4" />

                            <div className="flex gap-4 overflow-x-auto">
                                {anime.relateds.map(rel => {
                                    const title =
                                        rel.titles.find(t => t.language === "Ukrainian" && t.type === "Official")?.value ||
                                        rel.titles.find(t => t.language === "Romaji" && t.type === "Official")?.value ||
                                        rel.titles.find(t => t.language === "Romaji")?.value ||
                                        "Без назви";



                                    const airedYear = rel.airedOn ? new Date(rel.airedOn).getFullYear() : rel.year;
                                    function getAnimeKindLabel(kind?: string | AnimeKindEnum | null) {
                                        if (!kind) return "";

                                        const enumValue =
                                            typeof kind === "number"
                                                ? kind
                                                : (AnimeKindEnum[kind as keyof typeof AnimeKindEnum] ?? AnimeKindEnum.Unknown);

                                        return AnimeKindMap[AnimeKindEnum[enumValue] as keyof typeof AnimeKindMap] ?? "";
                                    }



                                    return (
                                        <div key={rel.id} className="flex flex-col gap-1">
                                            <Link href={`/anime/${rel.url}`} className="text-primary-black underline hover:text-primary">
                                                {title}
                                            </Link>
                                            <div className="flex gap-2 cursor-pointer min-w-[200px] items-center ">
                                                <Link href={`/anime/${rel.url}`} className="text-primary-black underline hover:text-primary">
                                                    <img
                                                        src={rel.posterUrl || "/404.gif"}
                                                        alt={title}
                                                        className="w-[52px] h-[73px] object-cover rounded-xs"
                                                    />
                                                </Link>

                                                <div className="flex flex-col justify-center gap-1 text-[#7F7F7F] text-[13px]">

                                                    <p>
                                                        {getAnimeKindLabel(rel.kind)}
                                                        {airedYear ? ` / ${airedYear}` : ""}
                                                    </p>



                                                    <p>{episodesText(rel.episodes)}</p>

                                                    <p>
                                                        {RelationKindMap[RelationKindEnum[rel.relationKind]]?.label}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    );
                                })}
                            </div>
                        </div>
                    )}





                </div>
            </WhiteCard>
        </main>



    )
}