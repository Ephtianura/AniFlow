"use client";

import AnimeFiler from '@/components/AnimeFilter';
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { BsGrid3X3GapFill } from "react-icons/bs";
import AnimeCard from '@/components/AnimeCard';
import WhiteCard from '@/components/WhiteCard';
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";


interface Anime {
    id: number;
    titles: { value: string; language: string; type: string }[];
    score: number;
    episodes: number;
    kind: string;
    year: number;
    genres: { id: number, nameUa: string, nameEn: string }[];
    description: string;
    posterUrl?: string | null;
    url: string;
}

type ViewMode = "grid" | "gridLarge" | "list";

export default function AnimeListPage() {
    const searchParams = useSearchParams();  // ← будь які параметри з юрл

    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [sortBy, setSortBy] = useState<string>("Score");
    const [sortDesc, setSortDesc] = useState<boolean>(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        function handleScroll() {
            if (loadingMore || !hasMore) return;

            const bottomOffset = 250; // px до низу сторінки

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomOffset) {
                loadMore();
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadingMore, hasMore, page, searchParams, sortBy, sortDesc]);


    async function loadMore() {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        try {
            const nextPage = page + 1;

            const queryString = searchParams.toString();
            const finalQuery = `${queryString}&SortBy=${sortBy}&SortDesc=${sortDesc}&Page=${nextPage}&Limit=20`;

            const data = await apiFetch(`/Animes?${finalQuery}`);

            if (data.items.length === 0) {
                setHasMore(false);
            } else {
                setAnimes(prev => [...prev, ...data.items]);
                setPage(nextPage);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const queryString = searchParams.toString();
                const finalQuery = `${queryString}&SortBy=${sortBy}&SortDesc=${sortDesc}&Page=1&Limit=20`;

                const data = await apiFetch(`/Animes?${finalQuery}`);

                setAnimes(data.items);
                setPage(1);
                setHasMore(data.items.length === 20);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [searchParams, sortBy, sortDesc]);

    if (loading) return <WhiteCard><p>Завантаження аніме...</p></WhiteCard>;

    {
        loadingMore && (
            <WhiteCard><p>Завантаження аніме...</p></WhiteCard>
        )
    }

    return (
        <main className='grid grid-cols-[1fr_auto] gap-8 items-start'>
            <WhiteCard>
                <div >
                    <h1 className='text-primary-black text-4xl font-medium pb-4'>
                        Список аніме
                    </h1>

                    {/* Панель управления */}
                    <div className='py-4 mb-4 border-hr-clr border-y'>
                        <div className='flex justify-between items-center'>

                            {/* --- Сортировка --- */}
                            <div className='flex items-center gap-2'>
                                <p className='text-gray-text-dark text-sm'>
                                    Сортувати по:
                                </p>

                                <select
                                    className="px-3 py-[6px] bg-white text-primary-black shadow-sm rounded-xs border border-btn-border-light"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Score">Рейтингу</option>
                                    <option value="Title">Назві</option>
                                    <option value="Episodes">Епізодам</option>
                                    <option value="AiredOn">Початку виходу</option>
                                    <option value="ReleasedOn">Кінцю виходу</option>
                                </select>

                                <button
                                    onClick={() => setSortDesc(prev => !prev)}
                                    className="text-primary-black p-2 border border-btn-border-light rounded-xs bg-white 
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
                        viewMode === "grid" ? "grid grid-cols-4 gap-6"
                            : viewMode === "gridLarge" ? "grid grid-cols-2 gap-6"
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
                </div>
            </WhiteCard>
            <AnimeFiler />
        </main>
    );
}
