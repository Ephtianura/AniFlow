// components/AnimeUserActions.tsx
"use client";
import React, { useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import { MyListEnum, useUserAnime } from "@/hooks/useUserAnime";
import WhiteCard from "@/components/WhiteCard";

interface Props {
    animeId: number;
    currentList?: MyListEnum | null;
    currentRating?: number | null;
}

export default function AnimeUserActions({ animeId, currentList, currentRating }: Props) {
    const { updateAnime, saving, message } = useUserAnime();
    const [selectedList, setSelectedList] = useState<MyListEnum | "">(
        currentList ?? ""
    );
    const [rating, setRating] = useState<number | null>(currentRating ?? null);

    const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as MyListEnum;
        setSelectedList(value);
        updateAnime(animeId, value, null);
        setRating(null); // если изменяем список, рейтинг сбрасываем
    };

    const handleRating = (rate: number) => {
        setRating(rate);
        updateAnime(animeId, null, rate);
        setSelectedList(""); // если оцениваем, список сбрасываем
    };

    return (
        <WhiteCard>
            <div className="flex flex-col gap-2">
                {/* Селект списка */}
                <div className="relative">
                    <select
                        className="btn-primary w-full appearance-none"
                        value={selectedList}
                        onChange={handleListChange}
                        disabled={saving}
                    >
                        <option value="">Додати до списку</option>
                        {Object.values(MyListEnum).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text-dark" />
                </div>

                {/* Рейтинг */}
                <div className="flex gap-1 items-center mt-2">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const num = i + 1;
                        return (
                            <BsFillStarFill
                                key={i}
                                className={`w-6 h-6 cursor-pointer ${
                                    rating && rating >= num
                                        ? "text-[#E4BB24]"
                                        : "text-[#D1D1D1]"
                                }`}
                                onClick={() => handleRating(num)}
                            />
                        );
                    })}
                </div>

                {message && <p className="text-sm text-green-600">{message}</p>}
            </div>
        </WhiteCard>
    );
}
