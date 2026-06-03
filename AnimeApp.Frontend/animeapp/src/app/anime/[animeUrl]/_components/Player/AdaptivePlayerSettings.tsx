'use client';

import { IoCloseSharp } from "react-icons/io5";
import PlayerSettings, { PlayerSettingsProps } from "./PlayerSettings";
import { motion, AnimatePresence } from "framer-motion";

interface AdaptivePlayerSettingsProps {
    option: PlayerSettingsProps;
    isMobileOpen: boolean
    onClose: () => void;
}

export default function AdaptivePlayerSettings({ option, isMobileOpen, onClose }: AdaptivePlayerSettingsProps) {
    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:block flex-col px-2 lg:w-75">
                <PlayerSettings {...option} />
            </div>

            {/* Mobile */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="lg:hidden h-full">
                        <div className="fixed inset-0 w-full h-full z-50 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute left-0 top-0 bg-primary-black/50 w-full h-full z-10 pointer-events-auto"
                                onClick={onClose}
                            />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                                className="absolute left-0 h-full w-full max-w-100 lg:w-85 z-20 pointer-events-auto"
                            >
                                <div className="h-full w-full bg-[#18191A] border-r-3 border-primary flex flex-col ">
                                    <div className="flex items-center justify-between relative px-4 mt-4 h-8 text-[#dee2e6]">
                                        <h5 className="text-[1.5rem] font-medium mb-2">
                                            Виберіть озвучку та плеєр
                                        </h5>
                                        <button className="text-xl p-2 active:scale-95 transition" onClick={onClose}>
                                            <IoCloseSharp className="w-8 h-8" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex flex-col gap-1 text-[1.25rem]">
                                            <PlayerSettings {...option} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence >
        </>
    );
}

