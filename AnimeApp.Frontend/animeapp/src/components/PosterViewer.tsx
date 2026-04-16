"use client";

import { useState, useEffect } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

interface PosterViewerProps {
    posterUrl: string | null;
}

export default function PosterViewer({ posterUrl }: PosterViewerProps) {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
            setClosing(false); 
        }, 300);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === "poster-backdrop") handleClose();
    };

    return (
        <>
            {/* Превью с hover-лупой */}
            <div className="relative cursor-pointer w-full sm:w-[250px] aspect-5/7 shrink-0" onClick={() => setOpen(true)}>
                <img
                    src={posterUrl || "/404.gif"}
                    alt="poster"
                    className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                    <IoSearch className="text-white w-10 h-10" />
                </div>
            </div>

            {/* Полноэкранная модалка */}
            {open && (
                <div
                    id="poster-backdrop"
                    onClick={handleBackdropClick}
                    className={`fixed inset-0 bg-black/80 z-9999 flex items-center justify-center transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"
                        }`}
                >
                    <div className="absolute top-0 w-full h-13 bg-black/40  backdrop-blur flex items-center justify-between px-6 text-white text-lg">
                        <span>Постер</span>
                        <button onClick={handleClose}>
                            <IoClose className="w-8 h-8" />
                        </button>
                    </div>

                    <img
                        src={posterUrl || "/404.gif"}
                        alt="poster"
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded"
                    />
                </div>
            )}
        </>
    );
}
