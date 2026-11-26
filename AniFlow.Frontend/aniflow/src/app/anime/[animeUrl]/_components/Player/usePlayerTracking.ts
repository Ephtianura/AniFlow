import { useCallback, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { sendGTMEvent } from "@next/third-parties/google";

export function usePlayerTracking(
  animeId: number,
  episodeNumber: number,
  animeName: string,
  translationName: string,
  playerName: string,
) {
  const hasTrackedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    hasTrackedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, [animeId, episodeNumber]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInteraction = useCallback(() => {
    if (hasTrackedRef.current || timerRef.current) return;

    timerRef.current = setTimeout(() => {
      hasTrackedRef.current = true;

      sendGTMEvent({
        event: "player_start",
        anime_id: animeId,
        anime_name: animeName,
        episode_number: episodeNumber,
        translation_name: translationName,
        player_name: playerName,
      });

      apiFetch("/track-view", {
        method: "POST",
        body: JSON.stringify({ animeId, episodeNumber }),
      });

      timerRef.current = null;
    }, 5000);
  }, [animeId, episodeNumber]);

  useEffect(() => {
    const handleBlur = () => {
      if (document.activeElement?.tagName === "IFRAME") {
        handleInteraction();
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [handleInteraction]);

  return handleInteraction;
}
