'use client';

import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import { BsFillStarFill } from 'react-icons/bs';
import HeartButton from './HeartButton';
import clsx from 'clsx';
import { useAnimeId } from './animeIdProvider';
import { toast } from 'react-toastify';
import { RiStarOffFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

interface RatingProps {
    score: number;
    totalScores: number;
}

const RATING_LABELS: Record<number, string> = {
    1: "Гірше нікуди",
    2: "Жахливо",
    3: "Дуже погано",
    4: "Погано",
    5: "Нормально",
    6: "Непогано",
    7: "Добре",
    8: "Чудово",
    9: "Дивовижно",
    10: "Шедевр"
};

export default function Rating({ score, totalScores }: RatingProps) {
    const { animeId, userAnime } = useAnimeId();
    const [userRating, setUserRating] = useState(userAnime?.rating ?? 0);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onRateChange = async (val: number) => {
        if (!userAnime && val !== 0) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб оцінити");
            return;
        }

        const prevRating = userRating;
        setUserRating(val);

        const isDelete = val === 0;
        const method = isDelete ? "DELETE" : "PATCH";
        const body = isDelete ? { rating: true } : { rating: val };

        try {
            await apiFetch(`/user/me/${animeId}`, {
                method: method,
                body: JSON.stringify(body),
            });
        } catch (error) {
            setUserRating(prevRating);
            toast.error("Не вдалося оновити оцінку :<");
        }
    };

    return (
        <div className={clsx("flex justify-between h-11", "md:mb-11 lg:mb-0")}>
            <div className={clsx(
                "flex gap-2 items-center",
                "md:flex-col md:mb-11 md:items-start",
                "lg:flex-row lg:mb-0 lg:items-center h-11"
            )}>

                {/* Левая часть: Общий рейтинг */}
                <div className='flex gap-2 items-center'>
                    <BsFillStarFill className='text-[#E4BB24] w-8 h-8 mb-1' />
                    <div className='flex flex-col pr-1'>
                        <div className='flex items-end text-primary-black'>
                            <p className='text-2xl'>{score.toFixed(1)}</p>
                            <p className='text-[10px]'>/10</p>
                        </div>
                        <p className='text-[10px] text-gray-500'>{totalScores}</p>
                    </div>
                </div>

                {/* Правая часть: Оценить */}
                <div
                    className="flex items-center h-full group relative select-none"
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    onMouseLeave={() => {
                        setIsMenuOpen(false);
                        setHoveredRating(null);
                    }}
                >
                    <div className={`flex items-center w-35 md:w-30 py-1 h-full transition-colors duration-400 cursor-pointer border-l border-[#B2B2B2]
                    ${isMenuOpen || userRating > 0 ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary-black'}`}
                    >
                        <div className="flex items-center gap-2 pl-2">
                            <BsFillStarFill className={`w-7 h-7 mb-1 shrink-0 transition-colors ${isMenuOpen || userRating > 0 ? 'text-white' : 'text-[#D1D1D1]'}`} />

                            <div className="flex flex-col leading-tight">
                                <div className="flex flex-col justify-center leading-tight shrink-0">
                                    {(() => {
                                        // Обработка наведения на зачеркнутую звезду
                                        if (hoveredRating === 0) {
                                            return (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-medium leading-none">—</span>
                                                    <span className="text-[13px]">Видалити</span>
                                                </div>
                                            );
                                        }
                                        // Приоритет 1: Ховер звёзд
                                        if (hoveredRating !== null) {
                                            return (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-medium leading-none">{hoveredRating}</span>
                                                    <span className="text-[13px]">Моя оцінка</span>
                                                </div>
                                            );
                                        }
                                        // Приоритет 2: Текущая сохраненная оценка
                                        if (userRating > 0) {
                                            return (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-medium leading-none">{userRating}</span>
                                                    <span className="text-[13px]">Моя оцінка</span>
                                                </div>
                                            );
                                        }
                                        // Приоритет 3: Дефолт
                                        return <span className="text-[13px]"> Оцінити аніме </span>;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <AnimatePresence>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: "100%",
                                transition: { duration: 0.4, delay: 0, ease: [0.04, 0.62, 0.23, 0.98] }
                            }}
                            exit={{
                                width: 0,
                                transition: { duration: 0.3, delay: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }
                            }}
                            style={{ overflow: "hidden" }}
                            className="origin-bottom sm:origin-left"
                        >

                        </motion.div>
                    </AnimatePresence> */}
                    
                    <div className={clsx(
                        "absolute z-10 bg-[#B3B3B3] flex transition-all duration-300 overflow-hidden flex-col items-center py-2 px-2 gap-2 w-full left-0 top-full",
                        "md:flex-row md:items-center md:px-2 md:gap-1 md:left-full md:top-0 md:w-max md:h-full",
                        isMenuOpen
                            ? "opacity-100 visible"
                            : "opacity-0 invisible pointer-events-none"
                    )}>
                        {/* 10 Зірочок */}
                        {Array.from({ length: 10 }).map((_, i) => {
                            const starValue = i + 1;
                            const isActive = (hoveredRating ?? userRating) >= starValue && hoveredRating !== 0;

                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-start md:block w-full"
                                    onMouseEnter={() => setHoveredRating(starValue)}
                                    onClick={() => onRateChange(starValue)}
                                >
                                    <div className='flex gap-2 items-center'>
                                        <BsFillStarFill className={`shrink-0 w-7 h-7 md:w-6 md:h-6 cursor-pointer transition-colors
                                                ${isActive ? 'text-white' : 'text-[#D1D1D1] hover:text-white'}`}
                                        />
                                        <span className='text-white text-sm whitespace-nowrap md:hidden'>
                                            {RATING_LABELS[starValue]}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Видалення */}
                        {userRating > 0 && (
                            <div
                                className="flex flex-col items-start md:block w-full"
                                onMouseEnter={() => setHoveredRating(0)}
                                onClick={() => {
                                    onRateChange(0);
                                    setHoveredRating(null);
                                }}
                            >
                                <div className='flex gap-2 items-center'>
                                    <RiStarOffFill className={clsx(
                                        "shrink-0 w-7 h-7 md:w-6 md:h-6 cursor-pointer transition-colors",
                                        hoveredRating === 0 ? "text-red-400" : "text-[#D1D1D1] hover:text-white"
                                    )} />
                                    <span className='text-white text-sm whitespace-nowrap md:hidden'>
                                        Видалити
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
            <div className='hidden sm:block'>
                <HeartButton />
            </div>
        </div>
    );
}

