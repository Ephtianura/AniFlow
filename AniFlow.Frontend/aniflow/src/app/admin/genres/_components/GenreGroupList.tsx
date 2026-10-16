"use client";

import { useMemo } from "react";
import { Genre } from "@/core/types";
import { TagType, tagTypeLabels } from "@/core/enums/TagType";
import GenreCapsule from "./GenreCapsule";

interface GenreGroupListProps {
    genres: Genre[];
    title?: string; 
    selectedGenreId?: number | null;
    onSelect?: (genre: Genre) => void; 
}

export default function GenreGroupList({ genres, title, selectedGenreId, onSelect }: GenreGroupListProps) {
    const groupedGenres = useMemo(() => {
        return genres.reduce((acc, genre) => {
            const type = (genre.type as TagType) || TagType.Genre;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(genre);
            return acc;
        }, {} as Record<TagType, Genre[]>);
    }, [genres]);

    return (
        <div className="w-full">
            {title && <p className="text-sm text-gray-500 font-medium">{title}</p>}

            <div className="space-y-4 mt-2">
                {(Object.keys(tagTypeLabels) as TagType[]).map((type) => {
                    const currentGroup = groupedGenres[type] || [];
                    if (currentGroup.length === 0) return null;

                    return (
                        <div key={type} className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {tagTypeLabels[type]}
                            </h3>

                            <div className="flex flex-wrap gap-2 max-h-150 overflow-y-auto transparent-scroll pb-1">
                                {currentGroup.map((g) => {
                                    const isInteractive = !!onSelect;
                                    
                                    return (
                                        <GenreCapsule
                                            key={g.id}
                                            text={g.nameUa ?? g.nameEn}
                                            isActive={selectedGenreId === g.id}
                                            onClick={isInteractive ? () => onSelect(g) : undefined}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}