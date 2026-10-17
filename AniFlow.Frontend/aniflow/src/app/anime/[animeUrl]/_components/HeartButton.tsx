"use client";

import { apiFetch } from "@/lib/api";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAnimeId } from "./animeIdProvider";
import { useState } from "react";

// Зпростив архітектуру
export default function HeartButton() {
    const { animeId, userAnime } = useAnimeId();
    const [isFavorite, setFavorite] = useState(userAnime?.isFavorite ?? false)

    const toggleFavorite = async () => {
        if (!userAnime) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додавати в обране");
            return;
        }
        if (!animeId) return;
        const nextValue = !isFavorite;

        // Оптимистично обновляем в сторе
        setFavorite(nextValue)

        try {
            await apiFetch(`/user/me/${animeId}`, {
                method: nextValue ? "PATCH" : "DELETE",
                body: JSON.stringify({ isFavorite: true }),
            });
        } catch (error) {
            setFavorite(!nextValue)
            toast.error("Не вдалося додати до улюбленного :<");
        }
    };

    return (
        <div>
            <button className="relative justify-end active:scale-90 transition cursor-pointer" onClick={toggleFavorite}>

                <FaHeart className={`absolute w-8 h-8 text-primary transition-all duration-200 
                ${isFavorite ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />

                <FaRegHeart className={`w-8 h-8 text-white sm:text-primary transition-all duration-200 
                ${isFavorite ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} />

            </button>
        </div>
    )
}
