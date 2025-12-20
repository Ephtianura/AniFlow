"use client";

import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import ScreenshotsViewer from "./ScreenshotsViewer";

interface ScreenshotsPreviewProps {
    images: string[];
}

export default function ScreenshotsPreview({ images }: ScreenshotsPreviewProps) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openViewer = (index: number) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    return (
        <>
            <div className="mt-3">
                <h4 className="text-primary-black text-2xl font-medium mb-3">Кадри</h4>
                <div className="flex gap-4">
                    {images.slice(0, Math.min(images.length, 3)).map((src, i) => (
                        <div key={i} className="relative group cursor-pointer" onClick={() => openViewer(i)}>
                            <img src={src} className="w-[305px] h-[175px] rounded object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <IoSearch className="text-white w-10 h-10" />
                            </div>
                        </div>
                    ))}

                    {images.length >= 4 && (
                        <div onClick={() => openViewer(3)} className="relative w-[305px] h-[175px] rounded cursor-pointer overflow-hidden">
                            <img src={images[3]} className="w-full h-full object-cover brightness-50" alt="" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-3xl font-medium">
                                +{images.length - 3}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {open && (
                <ScreenshotsViewer
                    images={images}
                    currentIndex={currentIndex}
                    onClose={() => setOpen(false)}
                    onChangeIndex={setCurrentIndex}
                />
            )}
        </>
    );
}
