"use client";

import WhiteCard from "../WhiteCard";
import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { Animes } from "@/core/types";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import Link from "next/link";
import { AnimeKindMap } from "@/core/enums/AnimeKind";

type Props = {
    animes: Animes[]
    onClose: () => void;
}
export default function AnimeDropDown({ animes, onClose }: Props) {

    return (
        <WhiteCard className="overflow-y-auto transparent-scroll max-h-[550px]">
            <div className="flex items-center gap-2 -mt-2 pb-2 border-b-2 border-primary">
                <h1 className="text-primary-black text-lg font-medium">
                    Аніме знайдено:
                </h1>
                <div className="px-1 py-px rounded-full bg-bg-dark text-white text-center flex items-center justify-center text-xs font-normal">
                    {animes.length}
                </div>
            </div>

            {animes.length === 0 && (
                <div className="text-gray-500">Нічого не знайдено</div>
            )}

            {animes.map((anime, index) => {
                const ua = getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official)
                const romaji = getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official)
                const isLast = index === animes.length - 1;

                return (
                    <div key={anime.id}>
                        <Link href={`/anime/${anime.url}`}
                            className="flex gap-2 py-3 px-3 hover:bg-gray-100 cursor-pointer"
                        >
                            {/* Картинка */}
                            <img
                                src={anime.posterUrl || "/NotFoundPurple.webp"}
                                alt={ua || romaji}
                                className="w-14 aspect-5/7 object-cover shrink-0 rounded-xs"
                            />

                            {/* Блок з текстом */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <p className="font-medium text-primary text-xl line-clamp-2 sm:line-clamp-1">{ua || romaji}</p>
                                    <p className="text-gray-text-dark text-sm -mt-1 line-clamp-1">{romaji}</p>
                                </div>

                                <div className="text-primary-black font-normal hidden sm:flex flex-col sm:flex-row gap-1 ">
                                    {/* YEAR */}
                                    {anime.year &&
                                        <span className="underline">{anime.year} </span>
                                    }

                                    {/* KIND */}
                                    {anime.kind && (
                                        <span className="underline">{AnimeKindMap[anime.kind as keyof typeof AnimeKindMap] ?? anime.kind}</span>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {!isLast && <hr className="text-hr-clr" />}
                        {isLast && <hr className="border text-primary" />}
                    </div>
                );
            })}

        </WhiteCard>
    )
}
