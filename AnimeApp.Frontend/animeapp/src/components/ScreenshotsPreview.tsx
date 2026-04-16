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

    const visibleImages = images.slice(0, 4);
    return (
        <>
            <div className="mt-3">
                <h4 className="text-primary-black text-2xl font-medium mb-3">Кадри</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleImages.map((src, i) => {
                        // Проверяем, является ли текущий индекс последним из отображаемых
                        const isLastVisible = i === visibleImages.length - 1;
                        // Проверяем, есть ли еще картинки в основном массиве, которые не влезли
                        const hasMore = images.length > visibleImages.length;
                        // Условие для показа "+N"
                        const showCounter = isLastVisible && hasMore;

                        return (
                            <div
                                key={i}
                                onClick={() => openViewer(i)}
                                className={`
                    relative group cursor-pointer overflow-hidden rounded aspect-video hover:scale-103 transition-transform duration-300
                    ${i === 1 ? "hidden sm:block" : ""}
                    ${i === 2 ? "hidden md:block" : ""}
                    ${i === 3 ? "hidden lg:block" : ""}
                `}
                            >
                                <img src={src} className="w-full h-full object-cover" alt="" />

                                {/* Ховер с лупой — рендерим только если НЕ показываем счетчик */}
                                {!showCounter && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition z-10">
                                        <IoSearch className="text-white w-10 h-10" />
                                    </div>
                                )}

                                {/* + N Screenshots */}
                                {showCounter && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-medium z-20">
                                        +{images.length - i}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
