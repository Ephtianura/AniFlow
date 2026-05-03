"use client";

import { useUserAnimeStore } from "@/stores/useUserAnimeStore";
import { apiFetch } from "@/lib/api";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useAnimeId } from "./animeIdProvider";

export default function HeartButton() {
    const {animeId} = useAnimeId();

    const item = useUserAnimeStore((s) => s.data[animeId]);
    const updateField = useUserAnimeStore((s) => s.updateField);
    // const markClean = useUserAnimeStore((s) => s.markClean);
    const isFavorite = item?.data?.isFavorite ?? false;
    const { isLoggedIn } = useAuth();

    const toggleFavorite = async () => {
        if (!isLoggedIn) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додавати в обране");
            return;
        }
        if (!animeId) return;
        const nextValue = !isFavorite;

        // Оптимистично обновляем в сторе
        updateField(animeId, { isFavorite: nextValue })

        try {
            // Запрос на бэк
            await apiFetch(`/user/me/${animeId}`, {
                method: nextValue ? "PATCH" : "DELETE",
                body: JSON.stringify({ isFavorite: true }),
            });
        } catch (error) {
            // Откат в случае ошибки
            updateField(animeId, { isFavorite: !nextValue })
            toast.error("Не вдалося додати до улюбленного :<");
        }
    };

    return (
        <div >
            <button className="relative justify-end active:scale-90 transition cursor-pointer" onClick={toggleFavorite}>

                <FaHeart className={`absolute w-8 h-8 text-primary transition-all duration-200 
                ${isFavorite ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />

                <FaRegHeart className={`w-8 h-8 text-white sm:text-primary transition-all duration-200 
                ${isFavorite ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} />

            </button>
        </div>
    )
}
