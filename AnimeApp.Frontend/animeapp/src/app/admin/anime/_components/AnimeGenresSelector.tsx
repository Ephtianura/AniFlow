"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Genre } from "@/core/types";
import { AnimeFormValues } from "./useAnimeForm";
import { GenreTile } from "./GenreTile";
import { TagType, tagTypeLabels } from "@/core/enums/TagType";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { LeaveConfirmationModal } from "../../_components/LeaveConfirmationModal";

interface AnimeGenresSelectorProps {
    genres: Genre[];
    animeId?: number;
    initialGenreIds?: number[];
}

export const AnimeGenresSelector: React.FC<AnimeGenresSelectorProps> = ({ genres, animeId, initialGenreIds }) => {
    const isEditMode = !!animeId;
    const { setValue, getValues } = useFormContext<AnimeFormValues>();
    
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [savedGenres, setSavedGenres] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode && initialGenreIds) {
            setSelectedGenres(initialGenreIds);
            setSavedGenres(initialGenreIds);
        } else {
            const initialIds = getValues("genresIds");
            if (initialIds && Array.isArray(initialIds)) {
                setSelectedGenres(initialIds);
            }
        }
    }, [getValues, initialGenreIds, isEditMode]);

    const cleanForCompare = (arr: number[]) => {
        return JSON.stringify([...arr].sort((a, b) => a - b));
    };

    const isDirty = isEditMode && cleanForCompare(selectedGenres) !== cleanForCompare(savedGenres);

    const groupedGenres = genres.reduce((acc, genre) => {
        if (!acc[genre.type]) acc[genre.type] = [];
        acc[genre.type].push(genre);
        return acc;
    }, {} as Record<TagType, Genre[]>);

    const handleToggle = (id: number) => {
        const updatedIds = selectedGenres.includes(id)
            ? selectedGenres.filter((gId) => gId !== id)
            : [...selectedGenres, id];

        setSelectedGenres(updatedIds);

        if (!isEditMode) {
            setValue("genresIds", updatedIds, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });
        }
    };

    const handleReset = () => {
        setSelectedGenres([]);
        
        if (!isEditMode) {
            setValue("genresIds", [], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });
        }
    };

    const handleSaveGenres = async () => {
        if (!animeId) return;
        setIsSaving(true);

        try {
            await apiFetch(`/anime/${animeId}`, {
                method: "PATCH",
                body: JSON.stringify({ genresIds: selectedGenres })
            });
            toast.success("Жанри успішно оновлено!");
            setSavedGenres(selectedGenres);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося зберегти жанри");
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="space-y-4">
<LeaveConfirmationModal isDirty={isDirty} />
            <div className="flex items-center justify-between h-8 gap-2">
                <h2 className="font-medium text-xl ">
                    <span className="hidden sm:block">Теги та жанри</span>
                    <span className="sm:hidden">Жанри</span>
                    </h2>
                <div className="flex items-center gap-4">
                    {isEditMode && isDirty && (
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleSaveGenres}
                            className="btn-purple font-medium active:scale-95 px-4! py-1! line-clamp-1 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Зберегти жанри
                        </button>
                    )}
                    {selectedGenres.length > 0 && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-sm text-primary hover:underline cursor-pointer font-normal select-none"
                        >
                            Скинути вибір ({selectedGenres.length})
                        </button>
                    )}
                </div>
            </div>

            {(Object.keys(tagTypeLabels) as TagType[]).map((type) => {
                const currentGroup = groupedGenres[type] || [];
                if (currentGroup.length === 0) return null;

                return (
                    <div key={type} className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            {tagTypeLabels[type]}
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-150 overflow-y-auto">
                            {currentGroup.map((g) => {
                                const isSelected = selectedGenres.includes(g.id);
                                return (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => handleToggle(g.id)}
                                    >
                                        <GenreTile
                                            name={g.nameUa || g.nameEn}
                                            isSelected={isSelected}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};