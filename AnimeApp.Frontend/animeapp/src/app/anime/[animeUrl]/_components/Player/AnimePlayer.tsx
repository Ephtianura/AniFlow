"use client";

import { useEffect, useState } from "react";
import EpisodeSelectorDesktop from "./EpisodeSelectorDesktop";
import { AnimeTitle, EpisodeInfo, PlayerEpisodeSet } from "@/core/types";
import pullUkrTitle from "../../_functions/pullUkrTitle";
import clsx from "clsx";
import { AnimeRatingEnum } from "@/core/enums/AnimeRating";
import TgShareButton from "./TgShareButton";
import AdaptivePlayerSettings from "./AdaptivePlayerSettings";
import EpisodeSelectorMobile from "./EpisodeSelectorMobile";

type Props = {
    titles: AnimeTitle[];
    rating?: AnimeRatingEnum | null;
    players: PlayerEpisodeSet[];
};

export default function AnimePlayer({ titles, rating, players }: Props) {

    if (!players?.length) return null;
    const hasAnyEpisodes = players.some(p =>
        p.voices?.some(v => v.episodes?.length > 0)
    );
    if (!hasAnyEpisodes) return null;

    const title = pullUkrTitle(titles)

    const [selectedPlayer, setSelectedPlayer] = useState<PlayerEpisodeSet | null>(null);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

    const activeVoiceId =
        selectedPlayer?.voices?.[selectedVoiceIndex]
            ? String(selectedVoiceIndex)
            : '0';

    useEffect(() => {
        if (!players?.length) return;

        const defaultPlayer = players[0];
        const defaultVoice = defaultPlayer.voices?.[0];

        setSelectedPlayer(defaultPlayer);

        if (defaultVoice) {
            setSelectedVoiceIndex(0);
            setSelectedEpisode(defaultVoice.episodes?.[0]?.episode ?? 1);
        }
    }, [players]);

    const currentEpisodes =
        selectedPlayer?.voices?.[selectedVoiceIndex]?.episodes ?? [];

    const currentEpisode = currentEpisodes.find(e => e.episode === selectedEpisode);

    const totalEpisodes =
        currentEpisodes.length
            ? Math.max(...currentEpisodes.map(e => e.episode))
            : 0;

    const iframeSrc = currentEpisode?.videoUrl;

    const playerOptions = players.map(p => ({
        id: p.player,
        name: p.player
    }));

    const voiceOptions =
        selectedPlayer?.voices?.map((v, i) => ({
            id: String(i),
            name: v.voice
        })) ?? [];

    const handlePlayer = (id: string) => {
        if (selectedPlayer?.player === id) return;

        const player = players.find(p => p.player === id);
        if (!player) return;

        setSelectedPlayer(player);
        setSelectedVoiceIndex(0);

        const firstVoice = player.voices?.[0];
        setSelectedEpisode(firstVoice?.episodes?.[0]?.episode ?? 1);
    };

    const handleVoice = (id: string) => {
        const idx = Number(id);

        if (selectedVoiceIndex === idx) return;

        const newEpisodes = selectedPlayer?.voices?.[idx]?.episodes ?? [];
        const resolved = resolveEpisode(newEpisodes, selectedEpisode);

        setSelectedVoiceIndex(idx);
        setSelectedEpisode(resolved);
    };

    const resolveEpisode = (episodes: EpisodeInfo[], target: number) => {
        if (!episodes.length) return 1;

        const sorted = [...episodes].sort((a, b) => a.episode - b.episode);

        const exact = sorted.find(e => e.episode === target);
        if (exact) return exact.episode;

        const lower = sorted.filter(e => e.episode < target);
        if (lower.length) return lower[lower.length - 1].episode;

        return sorted[0].episode;
    };

    return (
        <div className="relative my-3 -mx-4 flex items-center justify-center playerRef ">

            {/* ФОН */}
            <div className={clsx(
                "absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full bg-[#18191A] z-0",
                "shadow-[0_-10px_30px_var(--tw-shadow-color),0_10px_30px_var(--tw-shadow-color)] shadow-purple-400")}>
            </div>

            {/* КОНТЕНТ */}
            <div className="relative w-full h-full text-white py-4 flex flex-col gap-4 ">

                {/* Назва */}
                <div className="flex justify-between ">
                    <h3 className="text-[clamp(1.3rem,1.3rem+0.6vw,1.75rem)] font-semibold wrap-break-word ">
                        {title
                            ? <>Дивись аніме «{title}» онлайн українською</>
                            : <>Дивись аніме онлайн українською</>
                        }
                    </h3>
                    {rating === AnimeRatingEnum.RPlus && (
                        <p className="text-[#545555] font-medium text-4xl">18+</p>
                    )}
                    {rating === AnimeRatingEnum.R && (
                        <p className="text-[#545555] font-medium text-4xl">16+</p>
                    )}
                </div>

                {/* Плеєр, серії, озвучка  */}
                <div className="lg:flex gap-4 select-none ">

                    {/* Плеєр та серії */}
                    <div className="flex flex-col grow gap-2">

                        {/* iframe */}
                        <iframe
                            className="w-full aspect-video mb-2 rounded "
                            src={iframeSrc}
                            allow="autoplay *; fullscreen *">
                        </iframe>

                        {/* Вибір серії */}
                        <>
                            <div className="hidden lg:block">
                                <EpisodeSelectorDesktop
                                    totalEpisodes={totalEpisodes}
                                    currentEpisode={selectedEpisode}
                                    onEpisodeChange={(ep) => setSelectedEpisode(ep)}
                                />
                            </div>
                            <div className="lg:hidden">
                                <EpisodeSelectorMobile
                                    totalEpisodes={totalEpisodes}
                                    currentEpisode={selectedEpisode}
                                    onEpisodeChange={(ep) => setSelectedEpisode(ep)}

                                    activePlayer={selectedPlayer?.player ?? ''}
                                    activeVoice={selectedPlayer?.voices?.[selectedVoiceIndex]?.voice ?? ''}
                                    onOpenMobileSettings={() => setIsMobileSettingsOpen(true)}
                                />
                            </div>
                        </>

                    </div>

                    {/* Озвучка та вибор плеєру*/}
                    <AdaptivePlayerSettings
                        option={{
                            voices: voiceOptions,
                            players: playerOptions,
                            activeVoiceId: activeVoiceId,
                            activePlayerId: selectedPlayer?.player.toString() ?? '',
                            onVoiceChange: handleVoice,
                            onPlayerChange: handlePlayer,
                        }}
                        isMobileOpen={isMobileSettingsOpen}
                        onClose={() => setIsMobileSettingsOpen(!isMobileSettingsOpen)}
                    />

                </div>

                {/* Поділитися */}
                <TgShareButton />

            </div>
        </div>
    );
}