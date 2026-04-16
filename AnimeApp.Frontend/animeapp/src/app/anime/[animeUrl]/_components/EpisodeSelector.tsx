'use client';
import { useState, useRef, useEffect } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

interface EpisodeSelectorProps {
    totalEpisodes: number;
    currentEpisode: number;
    onEpisodeChange: (episode: number) => void;
}

export default function EpisodeSelector({
    totalEpisodes,
    currentEpisode,
    onEpisodeChange
}: EpisodeSelectorProps) {
    const [offset, setOffset] = useState(0);
    const [maxOffset, setMaxOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const episodesArray = Array.from({ length: totalEpisodes }, (_, i) => i + 1);
    const [inputValue, setInputValue] = useState('');

    // Сколько листать при клике на стрелки 22w кнопки = 88px + gap-2 (8)= 96px
    const itemWidth = 96;

    // Пересчёт доступной области для скролла при изменении количества серий или размера окна
    useEffect(() => {
        if (containerRef.current) {
            const scrollWidth = containerRef.current.scrollWidth;
            const clientWidth = containerRef.current.offsetWidth;
            setMaxOffset(Math.max(0, scrollWidth - clientWidth));
        }
    }, [totalEpisodes]);

    const handleNext = () => {
        setOffset((prev) => {
            const nextOffset = prev + itemWidth * 3;
            return nextOffset > maxOffset ? maxOffset : nextOffset;
        });
    };

    // Функция для логики прокрутки 
    const scrollToEpisode = (ep: number) => {
        const targetOffset = (ep - 1) * itemWidth;
        const safeOffset = Math.min(Math.max(0, targetOffset), maxOffset);
        setOffset(safeOffset);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = parseInt(inputValue);
            if (!isNaN(val) && val > 0 && val <= totalEpisodes) {
                onEpisodeChange(val); // Меняем серию в родителе
                scrollToEpisode(val); // Листаем стену
                setInputValue('');    // Очищаем инпут 
                e.currentTarget.blur(); // Убираем фокус с инпута
            }
        }
    };
    const handlePrev = () => {
        setOffset((prev) => {
            const nextOffset = prev - itemWidth * 3;
            return nextOffset < 0 ? 0 : nextOffset;
        });
    };

    return (
        <div className="hidden lg:flex gap-3 items-center h-10">
            <div className="flex items-center gap-2 shrink-0">
                <div className="border-b border-dashed flex gap-1 text-player-text text-sm">
                    <span className="hidden xl:block">Серія</span>
                    <span>№</span>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    placeholder={currentEpisode.toString()}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-16 px-2 py-1 text-player-text bg-[#3A3B3C] rounded-full text-center font-medium
                                outline-none border-[1.5px] border-transparent focus:border-primary focus:ring-4 focus:ring-purple-800/70
                                transition-all duration-400 shadow-inner"
                />
            </div>

            {/* Контейнер с сериями */}
            <div className="flex gap-2 items-center text-player-text grow h-full overflow-hidden relative">
                <span className="shrink-0">Серія</span>

                <div className="relative grow h-full overflow-hidden" ref={containerRef}>
                    <div
                        className="flex gap-2 absolute left-0 top-0 h-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${offset}px)` }}
                    >
                        {episodesArray.map((num) => (
                            <div
                                key={num}
                                onClick={() => onEpisodeChange(num)}
                                className={`flex items-center justify-center shrink-0 px-2 w-22 rounded-lg cursor-pointer transition-all duration-200 h-full
                                ${currentEpisode === num
                                        ? 'bg-[#393a39] text-primary-text active:scale-95'
                                        : 'hover:bg-white/5 active:bg-[#393a39] hover:text-white active:scale-95'
                                    }`}
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Навигация */}
                <div className="flex gap-2 px-4 border-l border-gray-600 shrink-0 z-10">
                    <button
                        onClick={handlePrev}
                        disabled={offset <= 0}
                        className="cursor-pointer hover:text-white transition-all active:scale-90 
                        disabled:opacity-20 disabled:cursor-default disabled:hover:text-player-text disabled:active:scale-100"
                    >
                        <MdNavigateBefore className="w-8 h-8" />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={offset >= maxOffset}
                        className="cursor-pointer hover:text-white transition-all active:scale-90 
                        disabled:opacity-20 disabled:cursor-default disabled:hover:text-player-text disabled:active:scale-100"
                    >
                        <MdNavigateNext className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
}