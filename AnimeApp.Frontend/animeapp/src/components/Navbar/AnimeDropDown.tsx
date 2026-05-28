"use client";

import WhiteCard from "../WhiteCard";
import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { Animes } from "@/core/types";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { KindLink } from "../KindLink";
import { YearLink } from "../YearLink";
import { useRouter } from "next/navigation";

type Props = {
    animes: Animes[]
    onClose: () => void;
}
export default function AnimeDropDown({ animes, onClose }: Props) {
    const router = useRouter();

    return (
        <WhiteCard className="overflow-y-auto max-h-[550px]">
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

                const goToAnime = () => {
                    router.push(`/anime/${anime.url}`);
                    onClose()
                };

                return (
                    <div key={anime.id}>
                        <div onClick={goToAnime}
                            className="flex gap-2 py-3 px-3 hover:bg-gray-100 cursor-pointer"
                        >
                            {/* Картинка */}
                            <img
                                src={anime.posterUrl || "/404.gif"}
                                alt={ua || romaji}
                                className="w-14 aspect-5/7 object-cover shrink-0 rounded-xs"
                            />

                            {/* Блок з текстом */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <p className="font-medium text-primary text-xl line-clamp-2 sm:line-clamp-1">{ua || romaji}</p>
                                    <p className="font- text-gray-text-dark text-sm -mt-1 line-clamp-1">{romaji}</p>
                                </div>

                                <div className="text-primary-black font-normal hidden sm:flex flex-col sm:flex-row gap-1 ">
                                    {/* YEAR */}
                                    {anime.year && <YearLink year={anime.year} />}

                                    {/* KIND */}
                                    {anime.kind && <KindLink kind={anime.kind} />}
                                </div>
                            </div>
                        </div>

                        {!isLast && <hr className="text-hr-clr" />}
                        {isLast && <hr className="border text-primary" />}
                    </div>
                );
            })}

        </WhiteCard>
    )
}
