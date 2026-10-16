"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { BiSolidStar } from "react-icons/bi";
import { Animes, PagedResult } from "@/core/types";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { SubTitle } from "@/components/SubTitle";
import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { TitleLink } from "@/components/TitleLink";

interface AdminAnimeSearchProps {
    placeholder?: string;
    hrefTemplate?: string;
    onSelect?: (anime: Animes) => void;
}

export const AdminAnimeSearch: React.FC<AdminAnimeSearchProps> = ({
    onSelect,
    hrefTemplate,
    placeholder = "Пошук аніме..."
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Animes[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const results = await apiFetch<PagedResult<Animes>>(
                    `/anime?search=${encodeURIComponent(searchQuery)}&sortBy=Score&sortDesc=true`
                );
                setSearchResults(results.items || []);
                setShowDropdown(true);
            } catch (err) {
                console.error("Помилка пошуку:", err);
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 350); // Затримка 350мс

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Закриття якщо мімо
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 3 && setShowDropdown(true)}
                className="btn-primary w-full"
            />

            {showDropdown && searchResults.length > 0 && (
                <div className={`absolute z-50 top-full left-0 w-full bg-white border border-gray-300 
                shadow-lg rounded mt-1 max-h-101 overflow-y-auto transparent-scroll grid grid-cols-1 sm:grid-cols-2`}>
                    {searchResults.map((anime) => {
                        const content = (
                            <>
                                <img
                                    src={anime.posterUrl || "/NotFoundPurple.webp"}
                                    className="w-15 aspect-5/7 object-cover rounded shrink-0"
                                    alt="poster"
                                />
                                <div className="flex flex-col overflow-hidden ">
                                    <TitleLink
                                        title={getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official)}
                                        url={anime.url}
                                        className="text-lg! line-clamp-1! font-medium"
                                        newTab
                                    />
                                    <SubTitle subTitle={getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official)} />
                                    <div className="flex gap-1 items-center text-xs text-gray-500 mt-0.5">
                                        <div className="flex gap-0.5 items-center">
                                            <BiSolidStar className="w-3.5 h-3.5 text-primary" />
                                            <span className="font-medium text-gray-700">{anime.score}</span>
                                        </div>
                                        {anime.kind && (
                                            <span>{AnimeKindMap[anime.kind] ?? anime.kind}</span>
                                        )}
                                        {anime.year && (
                                            <span>{anime.year}</span>
                                        )}

                                    </div>
                                </div>
                            </>
                        );

                        // Режим посилання
                        if (hrefTemplate) {
                            const finalHref = hrefTemplate.replace(":slug", anime.url);
                            return (
                                <Link
                                    key={anime.id}
                                    href={finalHref}
                                    onClick={handleClear}
                                    className="flex items-start gap-3 p-2 hover:bg-gray-100 transition-colors border-b border-hr-clr last:border-0"
                                >
                                    {content}
                                </Link>
                            );
                        }

                        // Режим вибору
                        return (
                            <div
                                key={anime.id}
                                onClick={() => {
                                    if (onSelect) onSelect(anime);
                                    handleClear();
                                }}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer transition-colors border-b border-hr-clr last:border-0"
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};