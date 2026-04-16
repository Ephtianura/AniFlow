"use client";

import { useEffect, useState } from "react";
import { TelegramShareButton } from "react-share";
import { FaTelegramPlane } from "react-icons/fa";
import PlayerSettings from "./PlayerSettings";
import EpisodeSelector from "./EpisodeSelector";

type Props = {
    title?: string;
    rating?: string;
};
const VOICE_DUMMY = [
    { id: '1', name: 'AniLibria' },
    { id: '2', name: 'AniFanUA' },
    { id: '3', name: 'Субтитри' },
];

const PLAYER_DUMMY = [
    { id: 'moon', name: 'MoonPlayer' },
    { id: 'kodik', name: 'Kodik' },
];

export default function AnimePlayer({ title, rating }: Props) {
    const [url, setUrl] = useState("");


    const handleVoice = (id: string) => console.log("Выбрана озвучка:", id);
    const handlePlayer = (id: string) => console.log("Выбран плеер:", id);

    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const totalEpisodes = 24;

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="relative my-3 -mx-4 flex items-center justify-center playerRef">

            {/* ФОН*/}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full bg-[#18191A] z-0 
                    shadow-[0_-10px_30px_var(--tw-shadow-color),0_10px_30px_var(--tw-shadow-color)] shadow-purple-400">
            </div>

            {/* КОНТЕНТ */}
            <div className="relative z-10 w-full h-full text-white py-4 flex flex-col gap-4 ">

                {/* Назва */}
                <div className="flex justify-between ">
                    <h3 className="text-[1.75rem] font-semibold wrap-break-word ">
                        {title
                            ? <>Дивись аніме «{title}» онлайн українською</>
                            : <>Дивись аніме онлайн українською</>
                        }
                    </h3>
                    {rating === "RPlus" && (
                        <p className="text-[#545555] font-medium text-4xl">18+</p>
                    )}
                    {rating === "R" && (
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
                            src="https://moonanime.art/iframe/ghjcjuznaqkxzposoa/"
                            allow="autoplay *; fullscreen *">
                        </iframe>

                        {/* Вибір серії */}
                        <div className="">
                            <EpisodeSelector
                                totalEpisodes={totalEpisodes}
                                currentEpisode={selectedEpisode}
                                onEpisodeChange={(ep) => setSelectedEpisode(ep)}
                            />
                        </div>
                    </div>

                    {/* Озвучка та вибор плеєру*/}
                    <div className="hidden lg:block flex-col px-2 lg:w-75">
                        <PlayerSettings
                            voices={VOICE_DUMMY}
                            players={PLAYER_DUMMY}
                            onVoiceChange={handleVoice}
                            onPlayerChange={handlePlayer}
                        />
                    </div>

                </div>

                {/* Поділитися */}
                <div className="py-3 border-y border-[#3f3e3f] flex gap-2 items-center">
                    <span className="text-player-text text-lg">Поділитися з друзями:</span>
                    <TelegramShareButton url={url} >
                        <div className="bg-[#468bcc] flex items-center gap-2 px-2 py-0.5 rounded-xs 
                                hover:bg-[#509fe8]
                                active:scale-95 transition-all duration-200">
                            <FaTelegramPlane className="w-5 h-5" />
                            <span>Telegram</span>
                        </div>
                    </TelegramShareButton>
                </div>

                {/* <div className="flex gap-2 items-center text-lg">
                    <span className="text-player-text ">Дата виходу:</span>
                    <span className="text-white">{"10 січня 2025"}</span>
                </div> */}

            </div>
        </div>
    );
}