"use client";

import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { AnimeFormValues } from "./useAnimeForm";
import CustomSelect from "@/components/CustomSelect";
import { toast } from "react-toastify";
import { AnimeTitle } from "@/core/types"; 
import { apiFetch } from "@/lib/api";

interface AnimeTitlesEditorProps {
    animeId?: number;
    initialTitles?: AnimeTitle[];
}

interface LocalTitle {
    id?: number;
    value: string;
    language: TitleLanguage;
    type: TitleType;
}

export const AnimeTitlesEditor: React.FC<AnimeTitlesEditorProps> = ({ animeId, initialTitles }) => {
    const isEditMode = !!animeId;

    // =========================================================================
    // 🟢 (EDIT MODE)
    // =========================================================================
    const [localTitles, setLocalTitles] = useState<LocalTitle[]>([]);
    const [savedTitles, setSavedTitles] = useState<LocalTitle[]>([]); 
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode && initialTitles) {
            const formatted = initialTitles.map(t => ({
                id: t.id,
                value: t.value,
                language: t.language as TitleLanguage,
                type: t.type as TitleType
            }));
            setLocalTitles(formatted);
            setSavedTitles(formatted);
        }
    }, [initialTitles, isEditMode]);

    const cleanForCompare = (arr: LocalTitle[]) => {
        return JSON.stringify(arr.map(({ id, ...rest }) => rest));
    };

    const isDirty = isEditMode && cleanForCompare(localTitles) !== cleanForCompare(savedTitles);

    const handleSaveTitles = async () => {
        if (!animeId) return;
        setIsSaving(true);

        try {
            await apiFetch(`/anime/${animeId}`, {
                method: "PATCH",
                body: JSON.stringify({ titles: localTitles })
            })
            toast.success("Назви успішно оновлено!");
            setSavedTitles(localTitles);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося зберегти назви");
        } finally {
            setIsSaving(false);
        }
    };

    const updateLocalField = (idx: number, key: keyof LocalTitle, val: any) => {
        setLocalTitles(prev => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
    };
    const appendLocal = () => {
        setLocalTitles(prev => [...prev, { value: "", language: TitleLanguage.Romaji, type: TitleType.Official }]);
    };
    const removeLocal = (idx: number) => {
        setLocalTitles(prev => prev.filter((_, i) => i !== idx));
    };


    // =========================================================================
    // 🔵 (CREATE MODE)
    // =========================================================================
    const context = useFormContext<AnimeFormValues>();
    const control = context?.control;
    const register = context?.register;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "titles",
    });

    const renderFields = isEditMode
        ? localTitles.map((t, i) => ({ id: t.id ?? i, ...t })) 
        : fields; 

    return (
        <div className="flex-1 p-4 bg-white rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-3 h-8 gap-2">
                <h2 className="font-medium text-xl line-clamp-1">Додати назви</h2>

                {isEditMode && isDirty && (
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveTitles}
                        className="btn-purple font-medium active:scale-95 px-4! py-1!  line-clamp-1 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Зберегти назви
                    </button>
                )}
            </div>

            <div className="overflow-y-auto max-h-100 transparent-scroll pl-1 pt-1 scrollbar-gutter-stable">
                {renderFields.map((field, idx) => (
                    <div
                        key={isEditMode ? `local-${idx}` : field.id}
                        className="grid grid-cols-[1fr_minmax(120px,140px)_minmax(160px,200px)_auto] gap-2 mb-2 items-center"
                    >
                        <div>
                            <input
                                type="text"
                                placeholder="Назва аніме"
                                className="btn-primary flex items-center justify-between w-full min-w-30"
                                value={isEditMode ? localTitles[idx]?.value : undefined}
                                onChange={isEditMode ? (e) => updateLocalField(idx, "value", e.target.value) : undefined}
                                {...(!isEditMode && register ? register(`titles.${idx}.value` as const) : {})}
                            />
                        </div>

                        {isEditMode ? (
                            <CustomSelect
                                value={localTitles[idx]?.language}
                                onChange={(val) => updateLocalField(idx, "language", val)}
                                options={languageOptions}
                                placeholder="Не обрано"
                            />
                        ) : (
                            <Controller
                                control={control}
                                name={`titles.${idx}.language` as const}
                                render={({ field: controllerField }) => (
                                    <CustomSelect
                                        value={controllerField.value}
                                        onChange={controllerField.onChange}
                                        options={languageOptions}
                                        placeholder="Не обрано"
                                    />
                                )}
                            />
                        )}

                        {isEditMode ? (
                            <CustomSelect
                                value={localTitles[idx]?.type}
                                onChange={(val) => updateLocalField(idx, "type", val)}
                                options={typeOptions}
                                placeholder="Не обрано"
                            />
                        ) : (
                            <Controller
                                control={control}
                                name={`titles.${idx}.type` as const}
                                render={({ field: controllerField }) => (
                                    <CustomSelect
                                        value={controllerField.value}
                                        onChange={controllerField.onChange}
                                        options={typeOptions}
                                        placeholder="Не обрано"
                                    />
                                )}
                            />
                        )}

                        <button
                            type="button"
                            className={`cursor-pointer text-red-400 border-2 border-red-400 hover:text-white active:text-white
                             hover:bg-red-400 active:bg-red-400 rounded-sm transition duration-200 flex items-center
                              justify-center aspect-square active:scale-90`}
                            onClick={() => isEditMode ? removeLocal(idx) : remove(idx)}
                        >
                            <IoClose className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className={`border-2 border-green-400 text-green-400 px-3 py-1 mt-2 rounded-sm cursor-pointer font-medium
                    hover:border-green-600 hover:bg-green-500 hover:text-white active:text-white
                    transition duration-200 active:scale-95 active:bg-green-600 select-none`}
                onClick={isEditMode ? appendLocal : () => append({
                    value: "",
                    language: TitleLanguage.Romaji,
                    type: TitleType.Official,
                })}
            >
                Додати назву
            </button>
        </div>
    );
};

const languageOptions = Object.keys(TitleLanguage)
    .filter((k) => isNaN(Number(k)))
    .map((lang) => ({ value: lang, label: lang }));

const typeOptions = Object.keys(TitleType)
    .filter((k) => isNaN(Number(k)))
    .map((type) => ({ value: type, label: type }));