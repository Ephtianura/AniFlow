"use client";
import { Anime, AnimeOstResponse, AnimeVideoResponse } from "@/core/types";
import { FaPlay } from "react-icons/fa";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTitle } from "../_functions/getTitle";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { getYoutubeThumbnail } from "../../../../hooks/getYoutubeThumbnail";

type Props = {
    anime: Anime
}

type TrackItem =
    | {
        type: "ost";
        ost: AnimeOstResponse;
        video: AnimeVideoResponse;
    }
    | {
        type: "promo";
        video: AnimeVideoResponse;
    };

export default function OstsPreview({ anime }: Props) {
    const osts = anime.music;
    const promos = anime.promos;
    const animeTitle = getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official) ?? "Anime";
    const animePoster = anime.posterUrl ?? "";

    if ((!osts || osts.length === 0) && (!promos || promos.length === 0)) return null;

    const allVideos: TrackItem[] = [
        ...osts
            .sort((a, b) => a.index - b.index)
            .flatMap((ost) =>
                ost.videos
                    .sort((a, b) => a.index - b.index)
                    .map((video) => ({
                        type: "ost" as const,
                        ost,
                        video,
                    }))
            ),

        ...promos
            .sort((a, b) => a.index - b.index)
            .map((video) => ({
                type: "promo" as const,
                video,
            })),
    ];

    const visibleVideos = (allVideos ?? []).slice(0, 5);

    const openPlayer = usePlayerStore((state) => state.openPlayer);

    const handleStartPlay = (item: TrackItem) => {
        const id =
            item.type === "ost"
                ? `ost-${item.ost.id}-vid-${item.video.id}`
                : `promo-${item.video.id}`;

        if (!id) return;

        openPlayer({
            animeTitle,
            animePoster,
            osts,
            promos,
            trackId: id
        });
    };

    return (
        <>
            <div className="mt-3 select-none">
                <h4 className="text-primary-black text-2xl font-medium mb-3">Медія</h4>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visibleVideos.map((item, i) => {
                        const isLastVisible = i === visibleVideos.length - 1;
                        const hasMore = allVideos.length > visibleVideos.length;
                        const showCounter = isLastVisible && hasMore;

                        return (
                            <div key={i} onClick={() => handleStartPlay(item)}
                                className={`
                                        relative group cursor-pointer overflow-hidden rounded aspect-video hover:scale-103 transition-transform duration-300
                                    ${i === 1 ? "hidden xs:block" : ""}
                                    ${i === 2 ? "hidden sm:block" : ""}
                                    ${i === 3 ? "hidden md:block" : ""}
                                    ${i === 4 ? "hidden lg:block" : ""}
                                    `}>
                                <img
                                    src={getYoutubeThumbnail(item.video.url) ?? ""}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                                {!showCounter && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition z-10">
                                        <FaPlay className="text-white w-10 h-10" />
                                    </div>
                                )}

                                {showCounter && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-medium z-20">
                                        +{allVideos.length - visibleVideos.length}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

