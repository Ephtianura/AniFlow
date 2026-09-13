import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";

export function usePlayerTracking(animeId: number, episodeNumber: number) {
  const hasTrackedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hasTrackedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [animeId, episodeNumber]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInteraction = () => {
    if (hasTrackedRef.current || timerRef.current) return;

    timerRef.current = setTimeout(() => {
      hasTrackedRef.current = true;

      apiFetch("/track-view", {
        method: "POST",
        body: JSON.stringify({ animeId, episodeNumber }),
      });

      timerRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    const handleBlur = () => {
      if (document.activeElement?.tagName === "IFRAME") {
        handleInteraction();
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [animeId, episodeNumber]);

  return handleInteraction;
}