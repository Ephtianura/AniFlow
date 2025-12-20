"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { BiSolidStar } from "react-icons/bi";
import { AnimeKindMap } from "@/core/enums/AnimeKind";

interface AdminAnimeSearchProps {
    onSelect: (anime: any) => void; // функция вызывается при выборе аниме
}

export const AdminAnimeSearch : React.FC<AdminAnimeSearchProps> = ({ onSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearch = async (value: string) => {
        setSearchQuery(value);
        if (value.length >= 3) {
            try {
                const results = await apiFetch(`/Animes?search=${encodeURIComponent(value)}&sortBy=Score&sortDesc=true`);
                setSearchResults(results.items || []);
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
                setShowDropdown(false);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (anime: any) => {
        onSelect(anime);
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Пошук аніме"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="btn-primary w-full"
            />

            {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 max-h-80 overflow-y-auto">
                    {searchResults.map((anime) => (
                        <div
                            key={anime.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(anime)}
                        >
                            <img src={anime.posterUrl || "/404.gif"} className="w-16 h-20 object-cover rounded" />
                            <div className="flex flex-col">
                                <span className="font-medium text-primary">
                                    {anime.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value
                                        || anime.titles[0]?.value}
                                </span>
                                <span className="font-light text-gray-text text-sm">
                                    {anime.titles.find((t: any) => t.language === "Romaji" && t.type === "Official")?.value
                                        || anime.titles[0]?.value}
                                </span>
                                <div className="flex gap-1 items-center">
                                    <BiSolidStar className="w-4 h-4 text-gray-text-dark" />
                                    <span className="text-sm text-gray-500">{anime.score || "N/A"}</span>
                                </div>
                                <span className="text-sm text-gray-500">{AnimeKindMap[anime.kind]} / {anime.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
