"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PagedResult, Studio } from "@/core/types";

interface StudioSearchProps {
    placeholder?: string;
    hrefTemplate?: string;
    onSelect?: (studio: Studio) => void;
}

export const StudioSearch: React.FC<StudioSearchProps> = ({ 
    onSelect, 
    hrefTemplate, 
    placeholder = "Пошук студії" 
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Studio[]>([]);
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
                const results = await apiFetch<PagedResult<Studio>>(
                    `/Studios?search=${encodeURIComponent(searchQuery)}&sortBy=Name&sortDesc=false`
                );
                setSearchResults(results.items || []);
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 350);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

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
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 max-h-80 overflow-y-auto transparent-scroll">
                    {searchResults.map((studio) => {
                        const content = (
                            <>
                                {studio.posterUrl && (
                                    <img
                                        src={studio.posterUrl}
                                        alt={studio.name}
                                        className="max-h-20 max-w-[50vw] shrink-0 object-cover rounded"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="font-medium text-primary">{studio.name}</span>
                                    <span className="text-sm text-gray-500 line-clamp-2">
                                        {studio.description}
                                    </span>
                                </div>
                            </>
                        );

                        if (hrefTemplate) {
                            const finalHref = hrefTemplate.replace(":slug", String(studio.id));
                            return (
                                <Link
                                    key={studio.id}
                                    href={finalHref}
                                    onClick={handleClear}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors border-b border-hr-clr last:border-0"
                                >
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <div
                                key={studio.id}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors cursor-pointer border-b border-hr-clr last:border-0"
                                onClick={() => {
                                    if (onSelect) onSelect(studio);
                                    handleClear();
                                }}
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