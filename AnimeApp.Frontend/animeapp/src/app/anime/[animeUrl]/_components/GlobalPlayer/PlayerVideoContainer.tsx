"use client"
import { useRef, useState, useEffect } from "react";
import YouTube from 'react-player';
import { RiExpandDiagonal2Line } from "react-icons/ri";
import { MdFullscreen, MdFullscreenExit, MdPictureInPicture } from "react-icons/md";
import MusicControlButtons from "./MusicControlButtons";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { toast } from "react-toastify";

interface PlayerVideoContainerProps {
    isFullscreen: boolean;
}

export default function PlayerVideoContainer({ isFullscreen }: PlayerVideoContainerProps) {
    const {
        currentTrack,
        isPlaying,
        isMini,
        isOpen,
        volume,
        duration,
        playerRef,
        setPlayerRef,
        setIsMini,
        setProgress,
        setDuration,
        endTrack,
    } = usePlayerStore();

    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const handleUserActivity = () => {
        if (!document.fullscreenElement) return;
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
    };

    useEffect(() => {
        return () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); };
    }, []);

    const toggleFullscreen = async () => {
        if (!videoContainerRef.current) return;
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await videoContainerRef.current.requestFullscreen();
                setShowControls(true);
            }
        } catch (error) { toast.error("Сьогодні, на жаль, без фул-скріну ¯\\_(ツ)_/¯") }
    };

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleShowFullscreen = () => {
        setShowFullScreen(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setShowFullScreen(false);
        }, 2000);
    };

    // const togglePictureInPicture = async () => {
    //     if (!videoContainerRef.current) return;
    //     try {
    //         const videoElement = videoContainerRef.current.querySelector("video");
    //         console.log(videoElement); // null
    //         if (videoElement) {
    //             if (document.pictureInPictureElement) await document.exitPictureInPicture();
    //             else await videoElement.requestPictureInPicture();
    //         } else {
    //             if (document.pictureInPictureElement) await document.exitPictureInPicture();
    //             else if ('requestPictureInPicture' in videoContainerRef.current) {
    //                 // @ts-ignore
    //                 await videoContainerRef.current.requestPictureInPicture();
    //             }
    //         }
    //     } catch (error) { toast.error("Сьогодні, на жаль, без PIP ¯\\_(ツ)_/¯") }
    // };

    if (!currentTrack) return null;


    return (
        <div
            ref={videoContainerRef}
            onMouseMove={() => {
                handleUserActivity();
                toggleShowFullscreen();
            }}
            onClick={() => {
                handleUserActivity();
                toggleShowFullscreen();
            }}
            className={`aspect-video flex items-center justify-center outline-none my-auto group/container relative group
                ${isMini ? "w-full h-full" : "md:absolute inset-0"}`}
        >
            <YouTube
                ref={(player) => {
                    if (playerRef === player) return;
                    setPlayerRef(player || null);
                }}
                src={currentTrack.url}
                playing={isPlaying}
                volume={volume}
                onTimeUpdate={(e) => {
                    const currentSeconds = e.currentTarget.currentTime;
                    setProgress({
                        played: duration > 0 ? currentSeconds / duration : 0,
                        playedSeconds: Math.floor(currentSeconds)
                    });
                }}
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onEnded={endTrack}
                config={{ youtube: { disablekb: 1, rel: 0 } }}
                controls={false}
                width="100%"
                height="100%"
                className={`select-none ${!isFullscreen && `rounded-lg`} overflow-hidden`}
            />
            <div className="absolute bg-white/0 inset-0" />

            {isMini && (
                <div className="absolute inset-0 rounded-lg flex justify-end gap-2 p-2 md:bg-black/10 md:opacity-0 md:hover:opacity-100 transition duration-200 group">
                    <RiExpandDiagonal2Line
                        className="w-5 h-5 cursor-pointer transition hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        onClick={() => setIsMini(false)}
                    />
                </div>
            )}

            {!isMini && (
                <>
                    <div className=
                        {`${!isFullscreen && `opacity-100 lg:opacity-0`} opacity-0 transition duration-300 absolute top-4 
                    right-4 flex gap-2 items-center text-primary-player z-50 
                    ${showFullScreen && `opacity-100! `}`}>
                        {/* <button
                            onClick={(e) => { e.stopPropagation(); togglePictureInPicture(); }}
                            className="bg-white/10 hover:bg-[#2E293A]/50 rounded-full hidden sm:flex p-1.5 backdrop-blur-xs transition duration-300 active:scale-90 cursor-pointer"
                        >
                            <MdPictureInPicture className="w-5.5 h-5.5" />
                        </button> */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                            className="bg-white/10 hover:bg-[#2E293A]/50 rounded-full p-1.5 backdrop-blur-xs 
                            transition duration-300 active:scale-90 cursor-pointer"
                        >
                            {isFullscreen ? (
                                <MdFullscreenExit className="w-5.5 h-5.5" />
                            ) : (
                                <MdFullscreen className="w-5.5 h-5.5" />
                            )}
                        </button>
                    </div>

                    {isFullscreen && (
                        <div className={`absolute bottom-0 left-0 w-full z-50 transition-all duration-300 px-4 pb-4
                            ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
                        >
                            <div onClick={(e) => e.stopPropagation()} >
                                <MusicControlButtons isFullScreen={true} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}