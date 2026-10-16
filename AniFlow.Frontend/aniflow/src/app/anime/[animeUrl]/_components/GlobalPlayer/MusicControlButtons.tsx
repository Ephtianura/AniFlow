"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import {
    FaPlay,
    FaPause,
    FaVolumeHigh,
    FaVolumeLow,
    FaVolumeOff,
    FaVolumeXmark,
    FaBackwardStep,
    FaForwardStep,
} from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { RiCollapseDiagonalLine, RiExpandDiagonal2Line } from "react-icons/ri";
import { usePlayerStore } from "@/stores/usePlayerStore";

type Props = {
    isFullScreen: boolean;
}
export default function MusicControlButtons({ isFullScreen }: Props) {
    const {
        currentTrack,
        animeTitle,
        isPlaying,
        isMini,
        volume,
        progress,
        duration,
        playerRef,
        setIsPlaying,
        setIsMini,
        setVolume,
        nextTrack,
        prevTrack,
        closePlayer
    } = usePlayerStore();

    // Хэндлер для отслеживания мобильной версии (< 768px)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkDevice(); // проверяем при монтировании
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    if (!currentTrack) return null;

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function renderVolumeIcon() {
        if (volume === 0) return <FaVolumeXmark className="w-5 h-5" />;
        if (volume <= 0.3) return <FaVolumeOff className="w-5 h-5" />;
        if (volume <= 0.7) return <FaVolumeLow className="w-5 h-5" />;
        return <FaVolumeHigh className="w-5 h-5" />;
    }

    const handleDragEnd = (event: any, info: PanInfo) => {
        // Срабатывает только если мы на мобилке
        if (!isMobile) return;

        // info.offset.y - расстояние в пикселях, на которое потянули плеер вниз
        // info.velocity.y - это скорость свайпа
        if (info.offset.y > 100 || info.velocity.y > 500) {
            closePlayer();
        }
    };

    return (
        <motion.div
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={handleDragEnd}
            className={`${isFullScreen && `bg-[#2E293A]/90 p-4 rounded-xl backdrop-blur-xs border border-purple-500/30 shadow-2xl`}`}
        >
            <div className={`relative flex flex-col pt-4 bg-[#2E293A] 
                ${!isFullScreen && `border-t-3 border-purple-400`} 
                 ${isFullScreen && `rounded-xl opacity-90 max-h-16 w-full flex-row pt-0!`} 
                touch-none select-none 
            active:cursor-grabbing md:active:cursor-default`}>

                {/* Свайп */}
                {isMobile && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#4A435B] rounded-full opacity-60" />
                )}

                {/* progress */}
                <div className="w-full flex items-center gap-3 px-8 pt-2 text-xs text-primary-player">
                    <span className="min-w-10">
                        {formatTime(progress.playedSeconds)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step="0.001"
                        value={progress.playedSeconds || 0}
                        onChange={(e) => {
                            if (playerRef) {
                                playerRef.currentTime = Number(e.target.value);
                            }
                        }}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer accent-purple-500 
                     bg-[#4A435B] transition-all duration-1000"
                    />
                    <span className="min-w-10 text-right">
                        {formatTime(duration)}
                    </span>
                </div>

                <div className={`grid gap-4 items-center max-h-20 px-8 py-2.5 text-primary-player
                         ${isFullScreen
                        ? "grid-cols-[1fr_auto] justify-items-center py-0! px-2!" 
                        : "grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]" 
                    }`}
                >
                    {/* Info */}
                    <div className={`flex flex-col gap-2 overflow-hidden ${isFullScreen && `hidden`}`}>
                        <p className="font-semibold line-clamp-1">
                            {currentTrack.title && (
                                <span className="text-purple-400">{currentTrack.title}</span>
                            )}
                            {currentTrack.typeLabel && (<>
                                <span> - </span>
                                <span>{currentTrack.typeLabel}</span>
                            </>)}
                            {animeTitle && (<>
                                <span className="font-bold"> з </span>
                                <span className="text-purple-400">{animeTitle}</span>
                            </>)}
                        </p>
                        {currentTrack.author && (
                            <p className="text-[0.8rem] font-bold line-clamp-1">
                                <span>Performed by </span>
                                <span className="text-purple-400 font-semibold">
                                    {currentTrack.author}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Control */}
                    <div className="flex gap-4 items-center">
                        <button className="hidden md:block ost-player-btn" onClick={prevTrack}>
                            <FaBackwardStep className="w-10 h-8" />
                        </button>

                        <button className="ost-player-btn" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? (
                                <FaPause className="w-10 h-8" />
                            ) : (
                                <FaPlay className="pl-1 w-10 h-8" />
                            )}
                        </button>

                        <button className="hidden md:block ost-player-btn" onClick={nextTrack}>
                            <FaForwardStep className="w-10 h-8" />
                        </button>
                    </div>

                    {/* volume + close */}
                    <div className="hidden md:flex justify-between items-center w-full">

                        <div className="flex items-center gap-3 text-primary-player group">
                            <button
                                className="ost-player-btn"
                                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                            >
                                {renderVolumeIcon()}
                            </button>

                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-24 h-1 rounded-fullappearance-none cursor-pointer accent-purple-500 bg-[#4A435B]
                                opacity-0 group-hover:opacity-100 transition duration-300"
                            />
                        </div>

                        <div className="flex gap-4 items-center ">
                            {!isFullScreen && (
                                <button
                                    className=" ost-player-btn"
                                    onClick={() => setIsMini(!isMini)}
                                >
                                    {isMini ? (
                                        <RiExpandDiagonal2Line className="w-6 h-6" />
                                    ) : (
                                        <RiCollapseDiagonalLine className="w-6 h-6" />
                                    )}
                                </button>
                            )}
                            <button
                                className="p-2 text-[#675E79] ost-player-btn "
                                onClick={closePlayer}
                            >
                                <IoCloseSharp className="w-6 h-6" />
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </motion.div>
    );
}