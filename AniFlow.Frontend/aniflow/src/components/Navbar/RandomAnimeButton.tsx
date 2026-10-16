"use client"

import { useRouter } from "next/navigation";

export default function RandomAnimeButton() {
    const router = useRouter();

    const handleRandomAnime = (e: React.MouseEvent) => {
        e.preventDefault();
        router.refresh();
        router.push(`/anime/random?t=${Date.now()}`);
    };

    return (
        <a
            href="/anime/random"
            onClick={handleRandomAnime}
            className="nav-button"
        >
            Випадкове аніме
        </a>
    );
}