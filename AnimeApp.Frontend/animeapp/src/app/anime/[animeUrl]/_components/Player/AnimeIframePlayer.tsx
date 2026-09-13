"use client";

import { usePlayerTracking } from "./usePlayerTracking";

interface PlayerProps {
  iframeSrc?: string;
  animeId: number;
  episodeNumber: number;
  color1?: string;
}

export default function AnimeIframePlayer({
  iframeSrc,
  animeId,
  episodeNumber,
  color1 = "9457ff",
}: PlayerProps) {
  const handleInteraction = usePlayerTracking(animeId, episodeNumber);

  if (!iframeSrc) {
    return <div className="w-full aspect-video mb-2 rounded bg-neutral-900 animate-pulse" />;
  }

  const cleanColor = color1.replace("#", "");
  const separator = iframeSrc.includes("?") ? "&" : "?";
  const finalSrc = `${iframeSrc}${separator}color1=${cleanColor}`;

  console.log(finalSrc)
  return (
    <div className="relative w-full aspect-video mb-2" onClick={handleInteraction}>
      <iframe
        key={finalSrc}
        className="w-full h-full rounded border-0"
        src={finalSrc}
        allow="autoplay *; fullscreen *"
      />
    </div>
  );
}