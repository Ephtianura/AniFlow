"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";
import { RelationKindEnum, RelationKindMap } from "@/core/enums/RelationKind";
import { BiSolidStar } from "react-icons/bi";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { IoClose } from "react-icons/io5";

interface RelatedAnime {
    relatedAnimeId: number;
    relationKind: RelationKindEnum | null;
    animeData?: any;
}

interface Props {
    initialRelatedAnimes?: RelatedAnime[];
    onChange?: (items: RelatedAnime[]) => void;
}

export const RelatedAnimeSelector: React.FC<Props> = ({ initialRelatedAnimes = [], onChange }) => {
    const [relatedAnimes, setRelatedAnimes] = useState<RelatedAnime[]>(initialRelatedAnimes);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        onChange?.(relatedAnimes);
    }, [relatedAnimes]);

    const handleSearch = async (value: string) => {
        setSearchQuery(value);
        if (value.length >= 3) {
            try {
                const results = await apiFetch(`/Animes?search=${encodeURIComponent(value)}&sortBy=Score&sortDesc=true`);
                setSearchResults(results.items || []);
                setShowDropdown(true);

                if (inputRef.current) {
                    const rect = inputRef.current.getBoundingClientRect();
                    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                }
            } catch {
                setSearchResults([]);
                setShowDropdown(false);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (anime: any) => {
        setRelatedAnimes([
            ...relatedAnimes,
            { relatedAnimeId: anime.id, relationKind: null, animeData: anime }
        ]);
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    const updateRelationKind = (index: number, kind: RelationKindEnum | null) => {
        const newList = [...relatedAnimes];
        newList[index].relationKind = kind;
        setRelatedAnimes(newList);
    };


    const removeRelatedAnime = (index: number) => {
        const newList = relatedAnimes.filter((_, i) => i !== index);
        setRelatedAnimes(newList);
    };

    return (
        <div className="mt-6 relative">
            <h2 className="font-medium text-xl mb-2">Додати пов'язане аніме</h2>
            <input
                type="text"
                placeholder="Пошук аніме для зв'язку"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                ref={inputRef}
                className="btn-primary w-full"
            />

            {showDropdown && searchResults.length > 0 && createPortal(
                <div
                    className="bg-white border border-gray-300 shadow-lg rounded max-h-80 overflow-y-auto z-50"
                    style={{
                        position: "absolute",
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                    }}
                >
                    {searchResults.map((anime) => (
                        <div
                            key={anime.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(anime)}
                        >
                            <img src={anime.posterUrl || "/404.gif"} className="w-16 h-20 object-cover rounded" />
                            <div className="flex flex-col">
                                <span className="font-medium text-primary">
                                    {anime.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value || anime.titles[0]?.value || ""}
                                </span>
                                <span className="font-light text-gray-text text-sm">
                                    {anime.titles.find((t: any) => t.language === "Romaji" && t.type === "Official")?.value || anime.titles[0]?.value || ""}
                                </span>
                                <div className="flex gap-1 items-center">
                                    <BiSolidStar className="w-4 h-4 text-gray-text-dark" />
                                    <span className="text-sm text-gray-500">{anime.score || ""}</span>
                                </div>
                                <span className="text-sm text-gray-500">{AnimeKindMap[anime.kind]} / {anime.year || ""}</span>
                            </div>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            <div className="flex flex-wrap gap-4 mt-6">
                {relatedAnimes.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-gray-text rounded w-55">



                        <div className="flex flex-wrap gap-4">
                            <span className="font-medium text-primary">
                                {item.animeData.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value
                                    || item.animeData.titles[0]?.value}
                            </span>
                            <div className="flex gap-2">
                                <img src={item.animeData.posterUrl || "/404.gif"} className="w-16 h-20 object-cover rounded" />

                                <div className="flex flex-col">

                                    <div className="flex gap-1 items-center">
                                        <BiSolidStar className="w-4 h-4 text-gray-text-dark" />
                                        <span className="text-sm text-gray-500">{item.animeData.score || ""}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{AnimeKindMap[item.animeData.kind]} / {item.animeData.year} </span>
                                </div>
                            </div>

                            <div className="flex gap-2">

                                <select
                                    value={item.relationKind !== null ? String(item.relationKind) : ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        updateRelationKind(index, val === "" ? null : Number(val) as RelationKindEnum);
                                    }}
                                    className="btn-primary w-max-50"
                                >
                                    <option value="">Оберіть тип</option>
                                    {Object.keys(RelationKindEnum)
                                        .filter(k => isNaN(Number(k)))
                                        .map((key) => {
                                            const value = RelationKindEnum[key as keyof typeof RelationKindEnum];
                                            return (
                                                <option key={key} value={String(value)} title={RelationKindMap[value].description}>
                                                    {RelationKindMap[value].label}
                                                </option>
                                            );
                                        })}
                                </select>



                                <button className="text-red-400 cursor-pointer" onClick={() => removeRelatedAnime(index)}><IoClose className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>


                ))}
            </div>
        </div>
    );
};
