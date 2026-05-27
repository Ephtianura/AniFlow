"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { Animes, PagedResult } from "@/core/types";
import { apiFetch } from "@/lib/api";
import AnimeDropDown from "./AnimeDropDown";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [animes, setAnimes] = useState<Animes[]>([]);

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
            setAnimes([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await apiFetch<PagedResult<Animes>>(`/anime?Search=${encodeURIComponent(searchQuery)}&SortBy=Score&SortDesc=true&pageSize=10`);
                if (res) {
                    setAnimes(res.items ?? []);
                } else {
                    setAnimes([]);
                }
            } catch {
                setAnimes([]);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <div ref={containerRef} className="relative flex items-center">

            {/* Кнопка пошуку */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center lg:px-3 lg:py-2 cursor-pointer"
            >
                <div className="lg:border-x lg:px-4 border-gray-text-light">
                    <MdOutlineSearch className="w-8 h-8 lg:w-6 lg:h-7 hover:text-btn-hover-dark 
                    transition-colors duration-200 active:scale-95" />
                </div>
            </button>

            {/* Виїжджаючий input */}
            <div className="absolute top-1/2 -translate-y-1/2 right-full w-[67vw] pr-1 lg:pr-0 lg:w-[350px] pointer-events-none">
                <AnimatePresence>
                    {open && (
                        <div className="relative w-full h-9 pointer-events-auto">

                            {/* Інпут */}
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
                                className="absolute right-0 top-0 h-full origin-right"
                            >
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Пошук аніме..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="btn-primary rounded-xs h-9 w-full bg-white border-gray-300 text-primary-black font-normal"
                                    />
                                </div>
                            </motion.div>

                            {/* Дропдаун */}
                            {searchQuery.length > 0 && searchQuery.trim() && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: "auto",
                                        transition: { duration: 0.25, delay: 0.4, ease: "easeInOut" }
                                    }}
                                    exit={{
                                        height: 0,
                                        transition: { duration: 0.2, delay: 0, ease: "easeInOut" }
                                    }}
                                    style={{ overflow: "hidden" }}
                                    className="absolute z-50 top-full left-0 w-full shadow-lg rounded-xs mt-1 max-h-[550px] overflow-x-hidden bg-white origin-top"
                                >
                                    <AnimeDropDown animes={animes} />
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
