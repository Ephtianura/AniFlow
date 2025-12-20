"use client";

import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import React from "react";
interface ScreenshotsViewerProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onChangeIndex: (index: number) => void;
}

export default function ScreenshotsViewer({ images, currentIndex, onClose, onChangeIndex }: ScreenshotsViewerProps) {
    const [closing, setClosing] = React.useState(false);

    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [currentIndex]);

    const next = () => onChangeIndex((currentIndex + 1) % images.length);
    const prev = () => onChangeIndex((currentIndex - 1 + images.length) % images.length);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 300);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === "backdrop") handleClose();
    };

    return (
        <div
            id="backdrop"
            onClick={handleBackdropClick}
            className={`fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
                closing ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="absolute top-0 w-full h-13 bg-black/40 backdrop-blur flex items-center justify-between px-6 text-white text-lg">
                <span>{currentIndex + 1} / {images.length}</span>
                <button onClick={handleClose}>
                    <IoClose className="w-8 h-8" />
                </button>
            </div>

            <img src={images[currentIndex]} className="max-h-[80vh] max-w-[90vw] object-contain rounded" alt="" />

            <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full cursor-pointer ">
                <IoChevronBack className="text-white w-8 h-8 " />
            </button>
            <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full cursor-pointer">
                <IoChevronForward className="text-white w-8 h-8" />
            </button>
        </div>
    );
}
