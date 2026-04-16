"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from 'next/navigation'

export default function RandomAnimeButton() {
    const router = useRouter();
    const handleRandomClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const data = await apiFetch("/Animes/random");
            router.push(`/anime/${data.url}`);
        } catch (err) {
            throw err;
        }
    }

    return (
        <div>
            <button
                onClick={handleRandomClick}
                className="nav-button"
            >
                Випадкове аніме
            </button>
        </div>
    )
}
