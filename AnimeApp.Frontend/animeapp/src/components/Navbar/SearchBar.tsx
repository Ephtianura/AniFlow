"use client";

import { useState, useRef, useEffect } from "react";
import { MdOutlineSearch } from "react-icons/md";
import Link from "next/link";
import { AnimeKindMap } from "@/core/AnimeKind";
import WhiteCard from "../WhiteCard";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне
    useEffect(() => {
        const click = (e: any) => {
            if (!containerRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", click);
        return () => document.removeEventListener("mousedown", click);
    }, []);

    // Debounce + API запрос
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);

            try {
                const url =
                    `${process.env.NEXT_PUBLIC_API_URL}/Animes?` +
                    `Search=${encodeURIComponent(searchQuery)}` +
                    `&SortBy=Score&SortDesc=true&pageSize=10`;

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.items ?? []);
                } else {
                    setResults([]);
                }
            } catch {
                setResults([]);
            }

            setLoading(false);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <div ref={containerRef} className="relative flex items-center">

            {/* Иконка поиска */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center lg:px-3 lg:py-2"
            >
                <div className="lg:border-x lg:px-4 border-gray-text-light">
                    <MdOutlineSearch className="w-8 h-8 lg:w-5 lg:h-6 hover:text-btn-hover-dark 
                    transition-colors duration-200 cursor-pointer active:scale-95" />
                </div>
            </button>

            {/* Выезжающий input */}
            <div
                className={`
                absolute top-1/2 -translate-y-1/2 
                right-full mr-2 
                transition-all duration-300 ease-out 
                ${open ? "opacity-100 w-[60vw] lg:w-[350px]" : "opacity-0 w-0 pointer-events-none"}`}>


                <input
                    type="text"
                    placeholder="Пошук аніме..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="btn-primary rounded-xs h-9 bg-white border-gray-300 text-primary-black font-normal"
                />

                {/* Дропдаун */}
                {open && (results.length > 0 || loading) && (

                    <div className="absolute z-50 top-full left-0 w-full shadow-lg rounded-xs mt-1 max-h-[550px] overflow-y-auto overflow-x-hidden">
                        <WhiteCard>
                            <div className="">
                                <div className="flex items-center gap-2 -mt-2 pb-2 border-b-2 border-primary">
                                    <h1 className="text-primary-black text-lg font-medium">
                                        Аніме знайдено:
                                    </h1>
                                    <div className="px-1 py-px rounded-full bg-bg-dark 
                                    text-white text-center flex items-center justify-center text-xs font-normal">
                                        {results.length}
                                    </div>
                                </div>

                                {loading && (
                                    <div className="text-gray-500">Завантаження...</div>
                                )}

                                {!loading && results.length === 0 && (
                                    <div className="text-gray-500">Нічого не знайдено</div>
                                )}

                                {!loading &&
                                    results.map((anime, index) => {
                                        const ua =
                                            anime.titles.find((t: any) =>
                                                t.language === "Ukrainian" && t.type === "Official"
                                            )?.value;

                                        const romaji =
                                            anime.titles.find((t: any) =>
                                                t.language === "Romaji" && t.type === "Official"
                                            )?.value;
                                        const isLast = index === results.length - 1;

                                        return (
                                            <div key={anime.id}>
                                                <Link
                                                    href={`/anime/${anime.url}`}
                                                    className="flex gap-2 py-3 px-3 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {/* Картинка */}
                                                    <img
                                                        src={anime.posterUrl || "/404.gif"}
                                                        alt={ua || romaji}
                                                        className="w-14 aspect-5/7 object-cover shrink-0 rounded-xs"
                                                    />

                                                    {/* Блок с текстом */}
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <p className="font-medium text-primary text-xl line-clamp-1">{ua || romaji}</p>
                                                            <p className="font- text-gray-text-dark text-sm -mt-1 line-clamp-1">{romaji}</p>
                                                        </div>

                                                        <div className="text-primary-black font-normal flex flex-col sm:flex-row gap-1">
                                                            <Link href="" className="underline hover:text-primary">
                                                                {anime.year ? `${anime.year}` : ""}
                                                            </Link>
                                                            <span className="text-gray-text-dark hidden sm:block">/</span>
                                                            <Link href="" className="underline hover:text-primary">
                                                                {anime.kind ? `${[AnimeKindMap[anime.kind]]}` : ""}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Link>

                                                {!isLast && <hr className="text-hr-clr" />}
                                                {isLast && <hr className="border text-primary" />}
                                            </div>
                                        );
                                    })}
                            </div>
                        </WhiteCard>
                    </div>
                )}
            </div>
        </div>
    );
}
