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

export default function Rating({
    animeId,
    score,
    totalScores,
    userRating,
}: RatingProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className='flex gap-2 items-center h-11'>
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
                {/* Кнопка "Оцінити аніме" или Цифра */}
                <div className={`flex items-center w-30 py-1 h-full transition-colors duration-400 cursor-pointer border-l border-[#B2B2B2]
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
                <div className={`
                    absolute left-[120px] top-0 h-full bg-[#B3B3B3] flex items-center px-2 gap-1 transition-all duration-300 z-10
                    ${isMenuOpen ? 'w-[280px] opacity-100 visible' : 'w-0 opacity-0 invisible pointer-events-none'}
                `}>
                    {Array.from({ length: 10 }).map((_, i) => {
                        const starValue = i + 1;
                        // Логика подсветки: если ховерим — подсвечиваем до звезды под мышкой, 
                        // если нет — подсвечиваем до текущей оценки
                        const isActive = (hoveredRating ?? currentUserRating) >= starValue;

                        return (
                            <BsFillStarFill
                                key={i}
                                onMouseEnter={() => setHoveredRating(starValue)}
                                onClick={() => onRateChange(starValue)}
                                className={`w-6 h-6 mb-1 cursor-pointer transition-colors
                                    ${isActive ? 'text-white' : 'text-[#D1D1D1] hover:text-white'}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}