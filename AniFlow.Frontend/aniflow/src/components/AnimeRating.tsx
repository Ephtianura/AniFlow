"use client";
import { BsFillStarFill } from "react-icons/bs";
import { useState } from "react";
import { useUpdateUserAnime } from "./useUpdateUserAnime";

interface Props {
    animeId: number;
    currentRating?: number;
}

export default function AnimeRating({ animeId, currentRating }: Props) {
    const { updateAnime, loading, error, success } = useUpdateUserAnime();
    const [rating, setRating] = useState<number>(currentRating ?? 0);
    const [hover, setHover] = useState<number>(0);

    const handleClick = async (value: number) => {
        setRating(value);
        await updateAnime(animeId, null, value); // рейтинг отправляем, список null
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
                const value = i + 1;
                return (
                    <BsFillStarFill
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${
                            value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleClick(value)}
                    />
                );
            })}
            {error && <p className="text-red-600 text-sm ml-2">{error}</p>}
            {success && <p className="text-green-600 text-sm ml-2">{success}</p>}
        </div>
    );
}
