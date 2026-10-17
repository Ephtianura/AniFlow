"use client";

export const getYoutubeThumbnail = (url: string) => {
    try {
        const parsed = new URL(url);

        let videoId: string | null = null;

        if (parsed.hostname.includes("youtu.be")) {
            videoId = parsed.pathname.slice(1);
        } else {
            videoId = parsed.searchParams.get("v");
        }

        if (!videoId) return null;

        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
        return null;
    }
};
