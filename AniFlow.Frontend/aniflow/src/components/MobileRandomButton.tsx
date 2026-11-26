"use client";

import { LuDices } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

export default function MobileRandomButton() {
    const router = useRouter();

    const handleRandomAnime = (e: React.MouseEvent) => {
        sendGTMEvent({
            event: "random_anime",
        });
        e.preventDefault();
        router.refresh();
        router.push(`/anime/random?t=${Date.now()}`);
    };

    return (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
            href="/anime/random"
            onClick={handleRandomAnime}
            className="flex flex-col gap items-center px-3 cursor-pointer"
        >
            <LuDices className="w-5.5 h-5.5" />
            <span className="text-[11px]">Випадкове</span>
        </a>
    );
}
