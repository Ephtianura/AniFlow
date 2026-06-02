"use client"

import { AnimeVideoResponse } from "@/core/types";
import { getYoutubeThumbnail } from "../../../../../hooks/getYoutubeThumbnail";
import { FaPlay, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { VideoKindLabel } from "@/core/enums/VideoKind";

type Props = {
    video: AnimeVideoResponse;
    ostId?: number | null;
}
export default function VideoCard({ video, ostId }: Props) {
    const { currentTrack, selectTrack } = usePlayerStore();

    const isPlaying = currentTrack?.originalVideo.id === video.id;

    const chooseTrack = () => {
        const id = ostId != null
            ? `ost-${ostId}-vid-${video.id}`
            : `promo-${video.id}`;
        selectTrack(id);
    };

    return (
        <button
            onClick={chooseTrack}
            className={`flex flex-col items-center hover:scale-105 transition group cursor-pointer p-1 active:scale-95 select-none 
            ${isPlaying && `scale-105 hover:scale-110`}`}
        >
            <div className="relative">
                <img
                    src={getYoutubeThumbnail(video.url) ?? ""}
                    alt={`${VideoKindLabel[video.kind]}`}
                    className="aspect-video object-cover rounded"
                />
                {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                        <FaPlay className="w-5 h-5 text-white" />
                    </div>
                )}
                <div className="absolute right-2 top-1">
                    <Link href={video.url}>
                        <FaYoutube className="text-[#FF0033] w-5 h-5 hover:text-[#ff3961] transition hover:scale-110" />
                    </Link>
                </div>
            </div>

            <p className="text-[0.8rem] font-semibold">{VideoKindLabel[video.kind]}</p>

        </button>
    );
}