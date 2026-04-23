'use client';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { BsFillStarFill } from 'react-icons/bs';

interface RatingProps {
    animeId: number;
    score: number;
    totalScores: number;
    userRating?: number;
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

export default function Rating({
    animeId,
    score,
    totalScores,
    userRating,
}: RatingProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    // Используем внутренний стейт для мгновенного отображения клика
    const [currentUserRating, setCurrentUserRating] = useState(userRating ?? 0);

    // Синхронизируем стейт, если пропс изменится извне (например, пришла дата с сервера)
    useEffect(() => {
        if (userRating !== undefined) {
            setCurrentUserRating(userRating);
        }
    }, [userRating]);

    const onRateChange = async (val: number) => {
        setCurrentUserRating(val);
        await apiFetch(`/user/me/${animeId}`, {
            method: "PATCH",
            body: JSON.stringify({ rating: val }),
        });
    };

    return (
        <div className='flex gap-2 items-center h-11
        md:flex-col md:mb-11 md:items-start
        lg:flex-row lg:mb-0 lg:items-center'>

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
                className="flex items-center h-full group relative"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => {
                    setIsMenuOpen(false);
                    setHoveredRating(null);
                }}
            >
                {/* Кнопка "Оцінити аніме"*/}
                <div className={`flex items-center w-35 md:w-30 py-1 h-full transition-colors duration-400 cursor-pointer border-l border-[#B2B2B2]
                    ${isMenuOpen || currentUserRating > 0 ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary-black'}`}
                >
                    <div className="flex items-center gap-2 pl-2">
                        <BsFillStarFill className={`w-7 h-7 mb-1 shrink-0 transition-colors ${isMenuOpen || currentUserRating > 0 ? 'text-white' : 'text-[#D1D1D1]'}`} />

                        <div className="flex flex-col leading-tight">
                            <div className="flex flex-col justify-center leading-tight shrink-0">
                                {(() => {
                                    // Приоритет 1: Ховер (чтобы видеть, что выбираешь)
                                    if (hoveredRating !== null) {
                                        return (
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-medium leading-none">{hoveredRating}</span>
                                                <span className="text-[13px]">Моя оцінка</span>
                                            </div>
                                        );
                                    }
                                    // Приоритет 2: Текущая сохраненная оценка
                                    if (currentUserRating > 0) {
                                        return (
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-medium leading-none">{currentUserRating}</span>
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

                {/* Выезжающая панель со звездами */}
                <div className={`absolute z-10 bg-[#B3B3B3] flex transition-all duration-300 overflow-hidden
                        left-0 top-full flex-col items-center py-2 gap-2 w-full
                        md:flex-row md:items-center md:px-2 md:gap-1 
                        md:left-[120px] md:top-0  
                 ${isMenuOpen
                        ? 'opacity-100 visible h-[370px] md:h-full md:w-[290px]'
                        : 'opacity-0 invisible h-0 md:h-full md:w-0 pointer-events-none'
                    }
                    `}>
                    {Array.from({ length: 10 }).map((_, i) => {
                        const starValue = i + 1;
                        const isActive = (hoveredRating ?? currentUserRating) >= starValue;

                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center md:block"
                                onMouseEnter={() => setHoveredRating(starValue)}
                                onClick={() => {
                                    onRateChange(starValue);
                                    setIsMenuOpen(false);
                                }}
                            >
                                <div className='flex gap-2 items-center'>
                                    <BsFillStarFill
                                        className={`shrink-0 w-7 h-7 md:w-6 md:h-6 cursor-pointer transition-colors
                            ${isActive ? 'text-white' : 'text-[#D1D1D1] hover:text-white'}`}
                                    />
                                    <span className='text-white text-sm whitespace-nowrap md:hidden'>
                                        {RATING_LABELS[starValue]}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}