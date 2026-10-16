"use client"

import { Navigation } from "swiper/modules";
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import clsx from "clsx";
import AnimeCard from "./AnimeCard";
import { Animes, PagedResult } from "@/core/types";

type Props = {
    seasonAnimes: PagedResult<Animes> | null;
}

export default function AnimeHomeSeason({ seasonAnimes }: Props) {
    if (seasonAnimes == null || seasonAnimes.items.length == 0) return null;

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [isSwiperReady, setIsSwiperReady] = useState(false);

    return (
        <div className="select-none group relative">
            <button
                className={clsx(
                    "custom-prev home-arrow left-2 ",
                    isBeginning && "opacity-0 pointer-events-none"
                )}
            >
                <MdNavigateBefore className="w-8 h-8" />
            </button>

            <Swiper
                onInit={() => setIsSwiperReady(true)}
                modules={[Navigation]}
                navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next", }}
                slidesPerView="auto"
                spaceBetween={28}
                slidesOffsetAfter={0}
                onSwiper={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onResize={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {seasonAnimes.items.map((anime) => {
                    return (
                        <SwiperSlide
                            key={anime.id}
                            className={`w-fit! last:mr-0 ${!isSwiperReady ? 'mr-7' : 'mr-0'}`}
                        >
                            <div className="w-45">
                                <AnimeCard
                                    id={anime.id}
                                    title={anime.titles.find(t => t.language === "Ukrainian")?.value || anime.titles[0].value}
                                    subTitle={anime.titles.find(t => t.language === "Romaji")?.value}
                                    rating={anime.score}
                                    kind={anime.kind}
                                    year={anime.year}
                                    genres={anime.genres}
                                    description={anime.description}
                                    posterUrl={anime.posterUrl || undefined}
                                    url={anime.url}
                                    viewMode={"small"}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <button
                className={clsx(
                    "custom-next home-arrow right-2",
                    isEnd && "opacity-0 pointer-events-none"
                )}
            >
                <MdNavigateNext className="w-8 h-8" />
            </button>
        </div>
    )
}
