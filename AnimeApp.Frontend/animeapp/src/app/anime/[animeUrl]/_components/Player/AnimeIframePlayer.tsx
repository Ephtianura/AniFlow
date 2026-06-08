"use client"

import { apiFetch } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

interface PlayerProps {
  iframeSrc: string;
  animeId: number;
  episodeNumber: number;
}

export default function AnimeIframePlayer({ iframeSrc, animeId, episodeNumber }: PlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    setHasTracked(false);
  }, [animeId, episodeNumber, iframeSrc]);

  useEffect(() => {
    const sendTrackView = async () => {
      if (hasTracked) return; 
      
      try {
        setHasTracked(true); 
        await apiFetch("/track-view", {
          method: "POST",
          body: JSON.stringify({ animeId, episodeNumber })
        });
      } catch (err) {
        setHasTracked(false);
      }
    };

    const handlePlayerMessage = (event: MessageEvent) => {
      if (!iframeSrc.includes(event.origin)) return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.event === "started" || data.event === "play" || data.key === "is_playing" && data.value === true) {
          sendTrackView();
        }
      } catch (e) {
      }
    };

    window.addEventListener("message", handlePlayerMessage);

    const interval = setInterval(() => {
      if (hasTracked || !iframeRef.current?.contentWindow) return;

      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ key: "is_started", action: "get" }), 
        "*"
      );
      
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ key: "is_playing", action: "get" }), 
        "*"
      );
    }, 1000);

    return () => {
      window.removeEventListener("message", handlePlayerMessage);
      clearInterval(interval);
    };
  }, [iframeSrc, animeId, episodeNumber, hasTracked, apiFetch]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full aspect-video mb-2 rounded border-0"
      src={iframeSrc}
      allow="autoplay *; fullscreen *"
    />
  );
}