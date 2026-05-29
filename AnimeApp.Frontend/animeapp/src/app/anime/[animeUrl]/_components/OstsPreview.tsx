"use client";

import { AnimeOstResponse, AnimeVideoResponse } from "@/core/types";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import SimpleBar from 'simplebar-react';
//@ts-ignore
import 'simplebar-react/dist/simplebar.min.css';

interface ScreenshotsPreviewProps {
    osts: AnimeOstResponse[],
    promos: AnimeVideoResponse[]
}

export default function OstsPreview({ osts, promos }: ScreenshotsPreviewProps) {
    if ((!osts || osts.length === 0) && (!promos || promos.length === 0)) {
        return null;
    }

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openViewer = (index: number) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    const allVideos = [
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

    return (
        <>
            <div className="mt-3 select-none">
                <div className="flex justify-between">
                    <h4 className="text-primary-black text-2xl font-medium mb-3">Медія</h4>
                    <button>
                        Відкрити плеєр
                    </button>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visibleVideos.map((item, i) => {
                        const isLastVisible = i === visibleVideos.length - 1;
                        const hasMore = allVideos.length > visibleVideos.length;
                        const showCounter = isLastVisible && hasMore;

                        return (
                            <div key={i} onClick={() => openViewer(i)}
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

            {/* {open && (
                <OstsOverlay
                    osts={osts}
                    osts={osts}
                    onClose={() => setOpen(false)}
                 onChangeIndex={setCurrentIndex}
                />
            )} */}
        </>
    );
}

export const getYoutubeThumbnail = (url: string) => {
    try {
        const parsed = new URL(url);

        let videoId: string | null = null;

        if (parsed.hostname.includes("youtu.be")) {
            videoId = parsed.pathname.slice(1);
        } else {
            videoId = parsed.searchParams.get("v");
        }

        if (!videoId) return null;

        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
        return null;
    }
};