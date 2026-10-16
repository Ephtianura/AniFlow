"use client";

import { OstType } from "@/core/enums/OstType";
import { AnimeOstResponse, AnimeVideoResponse } from "@/core/types";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa6";
import ListControlButtons from "./ListControlButtons";
import VideoCard from "./VideoCard";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/usePlayerStore";
import React from "react";

const ostTypeLabels: Record<OstType, string> = {
    Opening: "Опенінги",
    Ending: "Ендінги",
    Insert: "Саундтреки",
    Other: "Інше",
};

const OstList = React.memo(function OstList() {

    const {
        osts,
        promos,
        animeTitle,
        animePoster,
    } = usePlayerStore();

    const grouped = React.useMemo(() => {
        return Object.groupBy(osts, ost => ost.type);
    }, [osts]);

    const [opened, setOpened] = useState<Record<number, boolean>>({});
    const [promoOpened, setPromoOpened] = useState<boolean>(false);

    const toggleOpen = (id: number) => {
        setOpened(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="flex flex-col gap-8 text-[#d1cae0] px-4 md:px-0 h-full">

            {/* Control */}
            <ListControlButtons />

            {/* List */}
            <div className="flex flex-col gap-4 overflow-y-auto overflow-x-clip scrollbar-thin transparent-scroll scrollbar-gutter-stable">

                {/* Ости */}
                {Object.entries(grouped).map(([type, items]) => (
                    <div key={type}>
                        <span className="font-medium text-[0.9rem] select-none">
                            {ostTypeLabels[type as OstType]}
                        </span>
                        <hr className="mt-1" />
                        <div className="flex flex-col gap-4 mt-4">
                            {items.map((ost) => (
                                <React.Fragment key={ost.id}>
                                    <div className={`flex items-center w-full justify-between border-l-4 border-purple-400 h-16 rounded transition bg-[#2E293A]
                                    ${ost.videos.length > 0 && `active:scale-98 cursor-pointer`}
                                    `}
                                        onClick={() => toggleOpen(ost.id)}
                                    >
                                        <div className="flex gap-4 items-center h-full">
                                            <div className="relative h-full">
                                                <img
                                                    src={animePoster || "/NotFoundPurple.webp"} alt=""
                                                    className="shrink-0 object-cover h-full aspect-5/7 min-w-12 select-none"
                                                />
                                            </div>

                                            {/* Info */}
                                            {/*onClick={(e) => e.stopPropagation()*/}
                                            <div className="flex flex-col gap cursor-auto"  >
                                                <p className="flex gap-1 items-center pr-4 ">
                                                    <span className="text-purple-400 font-semibold line-clamp-1">{ost.title}</span>
                                                    {ost.author && (<>
                                                        <span className="font-bold text-[0.8rem]">by</span>
                                                        <span className="text-purple-400 font-semibold line-clamp-1">{ost.author}</span>
                                                    </>)}
                                                </p>
                                                <p className="line-clamp-1">
                                                    <span className="font-bold text-[0.8rem]">{ost.type}</span>
                                                    {animeTitle && (<>
                                                        <span className="font-bold text-[0.9rem] "> • </span>
                                                        <span className="text-purple-400 font-semibold">{animeTitle}</span>
                                                    </>)}
                                                </p>
                                            </div>

                                        </div>
                                        {/* Spotify */}
                                        {ost.spotifyUrl && (
                                            <Link href={ost.spotifyUrl} target="_blank" rel="noopener noreferrer">
                                                <FaSpotify className="text-[#1ED760] w-6 h-6 mr-4 hover:text-[#47d578] transition hover:scale-110 active:scale-95" />
                                            </Link>
                                        )}

                                    </div>
                                    <AnimatePresence>
                                        {opened[ost.id] && ost.videos.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    ease: [0.25, 0.1, 0.25, 0.5]
                                                }}
                                                style={{ overflow: "hidden" }}
                                                className=""
                                            >
                                                <div className="grid grid-cols-2 2xl:grid-cols-3 gap-1 px-2">
                                                    {ost.videos.map((video) => (
                                                        <VideoCard key={video.index} video={video} ostId={ost.id} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}

                {promos.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <button onClick={() => setPromoOpened(prev => !prev)} className="text-start cursor-pointer">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-[0.9rem] select-none">
                                    Інше
                                </span>
                                {promoOpened ? (
                                    <IoIosArrowUp />
                                ) : (
                                    <IoIosArrowDown />
                                )}
                            </div>
                            <hr className="mt-1" />
                        </button>

                        <AnimatePresence>
                            {promoOpened && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.04, 0.62, 0.23, 0.98]
                                    }}
                                    style={{ overflow: "hidden" }}
                                    className=""
                                >

                                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-1 px-2">
                                        {promos.map((promo) => (
                                            <VideoCard key={promo.index} video={promo} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

            </div>
        </div>
    );
});
export default OstList;