'use client';

import { useEffect } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';

export default function AnimeViewTracker({ animeId, animeName }: { animeId: number; animeName: string; }) {
    useEffect(() => {
        sendGTMEvent({
            event: 'anime_view',
            anime_id: animeId,
            anime_name: animeName
        });
    }, [animeId, animeName]);

    return null;
}