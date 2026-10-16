"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import ScreenshotsViewer from "./ScreenshotsViewer";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import clsx from "clsx";

interface ScreenshotsPreviewProps {
    images: string[];
}

export default function ScreenshotsPreview({ images }: ScreenshotsPreviewProps) {
    if (!images || images.length <= 0) return null;

    const [isSwiperReady, setIsSwiperReady] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openViewer = (index: number) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    const visibleImages = (images ?? []).slice(0, 8);
    return (
        <>
            <div className="select-none w-full h-full">
                <h4 className="text-primary-black text-2xl font-medium">Кадри</h4>


                <div className="">

                    <Swiper
                        onInit={() => setIsSwiperReady(true)}
                        slidesPerView={"auto"}
                    >
                        {visibleImages.map((src, i) => {
                            const isLastVisible = i === visibleImages.length - 1;
                            const hasMore = images.length > visibleImages.length;
                            const showCounter = isLastVisible && hasMore;

                            return (
                                <SwiperSlide
                                    key={i}
                                    className={`w-fit! p-3`}
                                >
                                    <div
                                        onClick={() => openViewer(i)}
                                        className="relative group cursor-pointer rounded-lg overflow-hidden w-60 lg:w-90.5 transition-all duration-300 ease-out hover:scale-103 hover:shadow-lg will-change-transform"
                                    >
                                        <img
                                            src={src}
                                            className="w-full h-full object-cover aspect-video shrink-0"
                                            alt={`Кадр ${i}`}
                                        />

                                        {!showCounter && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10">
                                                <IoSearch className="text-white w-10 h-10" />
                                            </div>
                                        )}

                                        {showCounter && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-medium z-20">
                                                +{images.length - i}
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div >

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

{/* <Swiper
    onInit={() => setIsSwiperReady(true)}
    spaceBetween={0}
    slidesOffsetAfter={0}
    slidesPerView={4}
    breakpoints={{
        // xxs
        160: { slidesPerView: 1, },
        // xs
        320: { slidesPerView: 1, },
        // s
        375: { slidesPerView: 2, },
        // sm
        640: { slidesPerView: 2, },
        // md
        768: { slidesPerView: 3, },
        // lg
        1024: { slidesPerView: 3, },
        // xl
        1280: { slidesPerView: 4, }
    }}
></Swiper> */}