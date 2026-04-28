"use client";

import { useUserAnimeStore } from "@/app/store/useUserAnimeStore";
import { apiFetch } from "@/lib/api";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export default function HeartButton() {
    const isFavorite = useUserAnimeStore((s) => s.data?.isFavorite);
    const animeId = useUserAnimeStore((s) => s.data?.animeId);
    const setFavorite = useUserAnimeStore(s => s.updateField);
    const { isLoggedIn, logout } = useAuth();

    const toggleFavorite = async () => {
        if (!isLoggedIn) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додавати в обране");
            return;
        }
        if (!animeId) return;
        const nextValue = !isFavorite;

        // Оптимистично обновляем в сторе
        setFavorite({ isFavorite: nextValue });

        try {

            // Запрос на бэк
            // const query = new URLSearchParams({ Favorite: "true" }).toString();
            // await apiFetch(`/user/me/${animeId}?${query}`, {
            //     method: nextValue ? "PATCH" : "DELETE",
            //     // Если PATCH ожидает тело, добавь body: JSON.stringify({ isFavorite: true })
            // });
        } catch (error) {
            // Откат в случае ошибки
            setFavorite({ isFavorite: isFavorite });
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
