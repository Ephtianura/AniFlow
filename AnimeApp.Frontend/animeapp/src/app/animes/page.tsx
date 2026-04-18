"use client";

import AnimeFiler from '@/components/AnimeFilter';
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { BsGrid3X3GapFill } from "react-icons/bs";
import AnimeCard from '@/components/AnimeCard';
import WhiteCard from '@/components/WhiteCard';
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import CustomSelect from '@/app/animes/SortSelect';
import { toast } from 'react-toastify';
import { Animes } from '@/core/types';

type ViewMode = "grid" | "gridLarge" | "list";

export default function AnimeListPage() {
    const searchParams = useSearchParams();
    const [animes, setAnimes] = useState<Animes[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    // Стейты для фильтров (их лучше тоже синхронизировать с URL, но пока так)
    const [sortBy, setSortBy] = useState("Score");
    const [sortDesc, setSortDesc] = useState(true);

    const fetchAnimes = async (isInitial: boolean) => {
        if (loadingMore || (!isInitial && !hasMore)) return;

        isInitial ? setLoading(true) : setLoadingMore(true);

        try {
            const targetPage = isInitial ? 1 : page + 1;
            const params = new URLSearchParams(searchParams);
            params.set("SortBy", sortBy);
            params.set("SortDesc", String(sortDesc));
            params.set("Page", String(targetPage));
            params.set("Limit", "20");

            const data = await apiFetch(`/Animes?${params.toString()}`);

            setAnimes(prev => isInitial ? data.items : [...prev, ...data.items]);
            setPage(prev => isInitial ? 1 : prev + 1);
            setHasMore(data.items.length === 20);
        } catch (err: any) {
            if (err.status >= 500) toast.error("Сервер приліг поспати...");
        } finally {
            isInitial ? setLoading(false) : setLoadingMore(false);
        }
    };

    
    useEffect(() => {
        fetchAnimes(true);
    }, [searchParams, sortBy, sortDesc]);

    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    fetchAnimes(false);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, page]);

    if (loading) return <WhiteCard>Завантаження...</WhiteCard>;


    return (
        <main className='lg:grid grid-cols-[1fr_auto] gap-8 items-start'>
            <WhiteCard>
                <div >
                    <h1 className='text-primary-black text-4xl font-medium pb-4'>
                        Список аніме
                    </h1>

                    {/* Панель управління */}
                    <div className='py-4 mb-4 border-hr-clr border-y'>
                        <div className='flex flex-col gap-2 items-center sm:flex-row sm:justify-between '>

                            {/* --- Сортування --- */}
                            <div className='flex items-center gap-2'>
                                <p className=' text-gray-text-dark text-sm'>
                                    Сортувати по:
                                </p>

                                <CustomSelect sortBy={sortBy} setSortBy={setSortBy} />

                                {/* Сортування */}
                                <button
                                    onClick={() => setSortDesc(prev => !prev)}
                                    className="text-primary-black p-2 mt-px border border-btn-border-light rounded-xs bg-white 
                                    hover:bg-btn-hover transition
                                    active:scale-95
                                    active:bg-gray-200
                                    active:border-gray-300"
                                >
                                    {sortDesc
                                        ? <FaSortAlphaDownAlt className="w-5 h-5" />
                                        : <FaSortAlphaDown className="w-5 h-5" />
                                    }
                                </button>
                            </div>

                            {/* --- Режим --- */}
                            <div className='flex gap-3 items-center text-primary-grey'>
                                <button onClick={() => setViewMode("grid")}
                                    className={`p-1 hover:text-primary-black rounded-xs cursor-pointer  active:scale-95 ${viewMode === "grid" && "hover:text-white text-white bg-primary"}`}>
                                    <BsGrid3X3GapFill className='w-6 h-6' />
                                </button>

                                <button onClick={() => setViewMode("gridLarge")}
                                    className={`p-1 hover:text-primary-black rounded-xs cursor-pointer  active:scale-95 ${viewMode === "gridLarge" && "hover:text-white text-white bg-primary"}`}>
                                    <IoGrid className='w-6 h-6' />
                                </button>

                                <button onClick={() => setViewMode("list")}
                                    className={`p-1 hover:text-primary-black rounded-xs cursor-pointer  active:scale-95 ${viewMode === "list" && "hover:text-white text-white bg-primary"}`}>
                                    <FaListUl className='w-6 h-6' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- Карточки --- */}
                    <div className={
                        viewMode === "grid" ? "grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6" : viewMode === "gridLarge" ? "grid md:grid-cols-2"
                            : "flex flex-col"}>

                        {animes.map((anime) => (
                            <AnimeCard
                                key={anime.id}
                                id={anime.id}
                                title={anime.titles.find(t => t.language === "Ukrainian")?.value || anime.titles[0].value}
                                subTitle={anime.titles.find(t => t.language === "Romaji")?.value}
                                rating={anime.score}
                                kind={anime.kind}
                                year={anime.year}
                                genres={anime.genres}
                                description={anime.description}
                                posterUrl={anime.posterUrl || undefined}
                                url={anime.url}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                    {/* Триггер для загрузки */}
                    <div ref={observerTarget} ></div>
                </div>
            </WhiteCard>
            <AnimeFiler />
        </main>
    );
}
