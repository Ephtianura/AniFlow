"use client";

import { usePlayerTracking } from "./usePlayerTracking";

interface PlayerProps {
  iframeSrc?: string;
  animeId: number;
  episodeNumber: number;
  animeName: string,
  translationName: string,
  playerName: string
}

export default function AnimeIframePlayer({
  iframeSrc,
  animeId,
  episodeNumber,
  animeName,
  translationName,
  playerName
}: PlayerProps) {
  const handleInteraction = usePlayerTracking(animeId, episodeNumber, animeName, translationName, playerName);

  if (!iframeSrc) {
    return <div className="w-full aspect-video mb-2 rounded bg-neutral-900 animate-pulse" />;
  }

  return (
    <div className="relative w-full aspect-video mb-2" onClick={handleInteraction}>
      <iframe
        key={iframeSrc}
        className="w-full h-full rounded border-0"
        src={iframeSrc}
        allow="autoplay *; fullscreen *"
      />
    </div>
  );
}