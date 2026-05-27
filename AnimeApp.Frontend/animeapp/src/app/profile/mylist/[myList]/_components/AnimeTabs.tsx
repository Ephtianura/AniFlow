"use client";

import { MyListEnum } from "@/core/enums/MyList";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBookmark, FaClock, FaPause, FaRedo, FaTrash, FaHeart } from "react-icons/fa";
import { HiMiniEye } from "react-icons/hi2";
import { Navigation } from "swiper/modules";
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import clsx from "clsx";

type TabType = MyListEnum | "Favorites";

interface TabConfigItem {
    key: TabType;
    label: string;
    icon: React.ComponentType;
}

const tabsConfig: TabConfigItem[] = [
    { key: "Favorites", label: "Улюблене", icon: FaHeart },
    { key: MyListEnum.Watching, label: "Дивлюсь", icon: HiMiniEye },
    { key: MyListEnum.Completed, label: "Переглянуто", icon: FaBookmark },
    { key: MyListEnum.Planned, label: "Заплановано", icon: FaClock },
    { key: MyListEnum.On_hold, label: "Відкладено", icon: FaPause },
    { key: MyListEnum.Rewatching, label: "Переглядаю знову", icon: FaRedo },
    { key: MyListEnum.Dropped, label: "Кинуто", icon: FaTrash },
];

interface AnimeTabsProps {
    counts: {
        Favorites: number;
        [MyListEnum.Watching]: number;
        [MyListEnum.Completed]: number;
        [MyListEnum.Planned]: number;
        [MyListEnum.On_hold]: number;
        [MyListEnum.Rewatching]: number;
        [MyListEnum.Dropped]: number;
    };
}

export default function AnimeTabs({ counts }: AnimeTabsProps) {
    const pathname = usePathname();
     const currentType =
        pathname.split("/").pop() as TabType || MyListEnum.Watching;

    const createHref = (value: TabType) => {
        return `/profile/mylist/${value}`;
    };

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <div className="flex flex-col gap-4 select-none group">
            <div className="flex gap-2 items-center overflow-x-auto overflow-y-hidden whitespace-nowrap relative">
                <button
                    className={clsx(
                        "custom-prev z-20 absolute left-0 w-8 aspect-square rounded-lg",
                        "bg-gray-50 hover:bg-gray-200 transition-all duration-500 cursor-pointer",
                        "group-hover:opacity-70 group-hover:pointer-events-auto",
                        "opacity-0 pointer-events-none",
                        isBeginning && "opacity-0 pointer-events-none"
                    )}
                >
                    <MdNavigateBefore className="w-8 h-8" />
                </button>

                <Swiper
                    modules={[Navigation]}
                    navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next", }}
                    slidesPerView="auto"
                    spaceBetween={4}
                    onSwiper={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onResize={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                >
 
                    {tabsConfig.map(({ key, label, icon: Icon }) => {
                        const count = counts[key] ?? 0;
                        const isActive = currentType === key;

                        return (
                            <SwiperSlide className="w-fit! mr-1 last:mr-0">
                                <Link
                                    key={key}
                                    href={createHref(key)}
                                    className={`px-4 py-2 text-primary-black rounded-lg flex gap-2 items-center transition-colors duration-200 
                                ${isActive
                                            ? "bg-[#E5E5E5]"
                                            : "bg-white hover:bg-[#F2F2F2] active:bg-[#E5E5E5]"
                                        }`}
                                >
                                    <Icon />
                                    {label}
                                    <span className="text-xs font-medium">{count}</span>
                                </Link>
                            </SwiperSlide>

                        );
                    })}
                </Swiper>

                <button
                    className={clsx(
                        "custom-next z-20 absolute right-0 w-8 aspect-square rounded-lg",
                        "bg-gray-50 hover:bg-gray-200 transition-all duration-500 cursor-pointer",
                        "group-hover:opacity-70 group-hover:pointer-events-auto",
                        "opacity-0 pointer-events-none",
                        isEnd && "opacity-0 pointer-events-none"
                    )}
                >
                    <MdNavigateNext className="w-8 h-8" />
                </button>





            </div>
        </div >
    );
}