"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

import MusicControlButtons from "./MusicControlButtons";
import OstList from "./OstList";
import PlayerVideoContainer from "./PlayerVideoContainer";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useFullscreenStatus } from "./hooks/useFullscreenStatus";
import { useLockBodyOverflow } from "./hooks/useLockBodyOverflow";

export default function GlobalOstPlayer() {
    const store = usePlayerStore();
    const constraintsRef = useRef<HTMLDivElement>(null);

    const isFullscreen = useFullscreenStatus();
    useLockBodyOverflow(store.isOpen, store.isMini);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !store.isMini) store.setIsMini(true);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [store.isMini, store.setIsMini]);

    if (!store.currentTrack) return null;

    return (
        <>
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 m-4 mb-51 sm:mb-35 " />

            {/* Фон */}
            <AnimatePresence>
                {!store.isMini && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#1C1823]/99 w-full h-full z-40 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <motion.div
                layout
                transition={{ layout: { duration: 0 } }}
                drag={store.isMini}
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                className={`fixed z-50 select-none ${store.isMini
                    ? "bottom-51 sm:bottom-35 left-4 w-75 aspect-video md:px-0 shadow-2xl touch-none"
                    : "top-20 bottom-39 left-0 right-0 w-full h-auto md:px-[5%] transform-none!"
                    }`}
                onDoubleClick={() => { if (store.isMini) store.setIsMini(false); }}
            >
                <div className={`h-full w-full min-h-0 text-white gap-6 ${store.isMini
                    ? "grid-cols-1 grid-rows-1"
                    : "grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[3fr_minmax(300px,1fr)]"
                    }`}>

                    {/* Player */}
                    <div className="relative w-full h-full ">

                        <PlayerVideoContainer isFullscreen={isFullscreen} />
                    </div>

                    {/* Ost List */}
                    <AnimatePresence>
                        <motion.div
                            initial={false}
                            animate={{
                                opacity: store.isMini ? 0 : 1,
                                pointerEvents: store.isMini ? "none" : "auto"
                            }}
                            transition={{ duration: 0 }}
                            className="min-w-0 h-full min-h-0 relative flex flex-col"
                        >
                            <OstList />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Control Buttons */}
            <AnimatePresence>
                {!isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed ${store.isMini ? `bottom-16` : `bottom-0`} sm:bottom-0 left-0 w-full z-60`}
                    >
                        <MusicControlButtons isFullScreen={false} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}