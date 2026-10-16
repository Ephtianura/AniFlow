"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { Studio } from "@/core/types";
import { AnimeFormValues } from "./useAnimeForm";
import { StudioSearch } from "../../_components/StudioSearch";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { LeaveConfirmationModal } from "../../_components/LeaveConfirmationModal";

interface AnimeStudioSelectorProps {
    animeId?: number;
    initialStudio?: Studio | null;
}

export const AnimeStudioSelector: React.FC<AnimeStudioSelectorProps> = ({ animeId, initialStudio }) => {
    const isEditMode = !!animeId;
    const { setValue, getValues, watch } = useFormContext<AnimeFormValues>();

    const [studioId, setStudioId] = useState<number | null>(null);
    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
    const [savedStudioId, setSavedStudioId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            if (initialStudio) {
                setStudioId(initialStudio.id);
                setSelectedStudio(initialStudio);
                setSavedStudioId(initialStudio.id);
            } else {
                setStudioId(null);
                setSelectedStudio(null);
                setSavedStudioId(null);
            }
        } else {
            const currentId = getValues("studiosId");
            setStudioId(currentId);
        }
    }, [initialStudio, isEditMode, getValues]);

    const watchedId = watch("studiosId");
    useEffect(() => {
        if (!isEditMode && watchedId !== studioId) {
            setStudioId(watchedId);
            if (!watchedId) {
                setSelectedStudio(null);
            }
        }
    }, [watchedId, isEditMode, studioId]);

    const isDirty = isEditMode && studioId !== savedStudioId;

    const handleSelect = (studio: Studio) => {
        setStudioId(studio.id);
        setSelectedStudio(studio);
        if (!isEditMode) {
            setValue("studiosId", studio.id, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleClear = () => {
        setStudioId(null);
        setSelectedStudio(null);
        if (!isEditMode) {
            setValue("studiosId", null, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleSaveStudio = async () => {
        if (!animeId) return;
        setIsSaving(true);

        try {
            await apiFetch(`/anime/${animeId}`, {
                method: "PATCH",
                body: JSON.stringify({ studiosId: studioId })
            });
            toast.success("Студію успішно оновлено!");
            setSavedStudioId(studioId);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося зберегти студію");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-8">
                <label className="font-medium text-lg line-clamp-1">Студія виробництва</label>
                {isEditMode && isDirty && (
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveStudio}
                        className="btn-purple font-medium active:scale-95 px-4! py-1! line-clamp-1 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Зберегти студію
                    </button>
                )}
            </div>

            {!studioId ? (
                <StudioSearch onSelect={handleSelect} />
            ) : (
                <div className="flex items-start sm:items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm ">
                    <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3">

                        {selectedStudio?.posterUrl ? (
                            <img
                                src={selectedStudio.posterUrl}
                                alt={selectedStudio.name}
                                className="p-1 object-cover shrink-0 rounded border border-gray-300 max-h-20 max-w-[50vw] select-none"
                            />
                        ) : (
                            <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 select-none">
                                {selectedStudio ? "No Photo" : "Завантаження..."}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-semibold text-primary text-base">
                                {selectedStudio?.name || `Студія (ID: ${studioId})`}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                Id: <span className="font-normal">{studioId}</span>
                            </span>
                            {selectedStudio?.slug && (
                                <span className="text-xs text-gray-400 font-medium">
                                    Slug: <span className="font-normal">{selectedStudio?.slug}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onDoubleClick={handleClear}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer active:scale-90"
                        title="Змінити студію"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>
            )}
            <LeaveConfirmationModal isDirty={isDirty} />
        </div>
    );
};