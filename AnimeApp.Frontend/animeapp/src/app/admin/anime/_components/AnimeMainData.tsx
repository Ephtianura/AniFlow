"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AnimeStatusEnum, AnimeStatusMap } from "@/core/enums/AnimeStatus";
import { AnimeRatingEnum } from "@/core/enums/AnimeRating";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { AnimeFormValues } from "./useAnimeForm";
import CustomSelect from "@/components/CustomSelect";
import { AnimeSource, AnimeSourceMap } from "@/core/enums/AnimeSource";
import Checkbox from "@mui/material/Checkbox";
import { purple } from "@mui/material/colors";
import { AnimeDescriptionField } from "./AnimeDescriptionField";

import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

interface AnimeMainDataProps {
    animeId?: number;
    initialData?: any;
}

export const AnimeMainData: React.FC<AnimeMainDataProps> = ({ animeId, initialData }) => {
    const isEditMode = !!animeId;
    const { register, control, formState: { errors } } = useFormContext<AnimeFormValues>();

    const [localData, setLocalData] = useState<any>({
        airedOn: "",
        releasedOn: "",
        score: 0,
        kind: null,
        status: null,
        rating: null,
        episodes: null,
        episodesAired: null,
        duration: null,
        source: null,
        nsfw: false,
        description: null
    });

    const [savedData, setSavedData] = useState<any>({ ...localData });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode && initialData) {
            const formatted = {
                airedOn: initialData.airedOn ? initialData.airedOn.split("T")[0] : "",
                releasedOn: initialData.releasedOn ? initialData.releasedOn.split("T")[0] : "",
                score: initialData.score ?? 0,
                kind: initialData.kind ?? null,
                status: initialData.status ?? null,
                rating: initialData.rating ?? null,
                episodes: initialData.episodes ?? null,
                episodesAired: initialData.episodesAired ?? null,
                duration: initialData.duration ?? null,
                source: initialData.source ?? null,
                nsfw: !!initialData.nsfw,
                description: initialData.description ?? null
            };
            setLocalData(formatted);
            setSavedData(formatted);
        }
    }, [initialData, isEditMode]);

    const isDirty = isEditMode && JSON.stringify(localData) !== JSON.stringify(savedData);

    const updateLocalField = (key: string, value: any) => {
        setLocalData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSaveMainData = async () => {
        if (!animeId) return;
        setIsSaving(true);

        const payload = {
            airedOn: localData.airedOn || null,
            releasedOn: localData.releasedOn || null,
            score: Number(localData.score),
            kind: localData.kind,
            status: localData.status,
            rating: localData.rating,
            episodes: localData.episodes,
            episodesAired: localData.episodesAired,
            duration: localData.duration,
            source: localData.source,
            nsfw: localData.nsfw,
            description: localData.description
        };

        try {
            await apiFetch(`/anime/${animeId}`, {
                method: "PATCH",
                body: JSON.stringify(payload)
            });
            toast.success("Основні дані успішно оновлено!");
            setSavedData(localData);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося зберегти дані");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-between h-8">
                <label className="font-medium text-lg line-clamp-1">Основні дані</label>
                {isEditMode && isDirty && (
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveMainData}
                        className="btn-purple font-medium active:scale-95 line-clamp-1 px-4! py-1! transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Зберегти основні
                    </button>
                )}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label>Дата виходу</label>
                    <input
                        type="date"
                        value={isEditMode ? localData.airedOn : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("airedOn", e.target.value) : undefined}
                        {...(!isEditMode ? register("airedOn") : {})}
                        className="btn-primary"
                    />
                </div>

                <div>
                    <label>Дата реліза</label>
                    <input
                        type="date"
                        value={isEditMode ? localData.releasedOn : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("releasedOn", e.target.value) : undefined}
                        {...(!isEditMode ? register("releasedOn") : {})}
                        className="btn-primary"
                    />
                </div>

                <div>
                    <label>Оцінка</label>
                    <input
                        type="number"
                        step="0.1"
                        value={isEditMode ? localData.score : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("score", e.target.value === "" ? 0 : Number(e.target.value)) : undefined}
                        {...(!isEditMode ? register("score", { valueAsNumber: true }) : {})}
                        className="btn-primary"
                    />
                    {!isEditMode && errors.score && <span className="text-red-500 text-xs">{errors.score.message}</span>}
                </div>

                <div>
                    <label>Тип</label>
                    {isEditMode ? (
                        <CustomSelect
                            value={localData.kind}
                            onChange={(val) => updateLocalField("kind", val)}
                            options={kindOptions}
                            placeholder="Не обрано"
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="kind"
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={kindOptions}
                                    placeholder="Не обрано"
                                />
                            )}
                        />
                    )}
                </div>

                <div>
                    <label>Статус</label>
                    {isEditMode ? (
                        <CustomSelect
                            value={localData.status}
                            onChange={(val) => updateLocalField("status", val)}
                            options={statusOptions}
                            placeholder="Не обрано"
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={statusOptions}
                                    placeholder="Не обрано"
                                />
                            )}
                        />
                    )}
                </div>

                <div>
                    <label>Rating MPAA</label>
                    {isEditMode ? (
                        <CustomSelect
                            value={localData.rating}
                            onChange={(val) => updateLocalField("rating", val)}
                            options={ratingOptions}
                            placeholder="Не обрано"
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="rating"
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={ratingOptions}
                                    placeholder="Не обрано"
                                />
                            )}
                        />
                    )}
                </div>

                <div>
                    <label>Епізоди</label>
                    <input
                        type="number"
                        value={isEditMode ? (localData.episodes ?? "") : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("episodes", e.target.value === "" ? null : Number(e.target.value)) : undefined}
                        {...(!isEditMode ? register("episodes", {
                            setValueAs: (v) => v === null || v === undefined || String(v).trim() === "" ? null : Number(v)
                        }) : {})}
                        className="btn-primary"
                    />
                </div>

                <div>
                    <label>Епізодів вийшло</label>
                    <input
                        type="number"
                        value={isEditMode ? (localData.episodesAired ?? "") : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("episodesAired", e.target.value === "" ? null : Number(e.target.value)) : undefined}
                        {...(!isEditMode ? register("episodesAired", {
                            setValueAs: (v) => v === null || v === undefined || String(v).trim() === "" ? null : Number(v)
                        }) : {})}
                        className="btn-primary"
                    />
                </div>

                <div>
                    <label>Тривалість</label>
                    <input
                        type="number"
                        value={isEditMode ? (localData.duration ?? "") : undefined}
                        onChange={isEditMode ? (e) => updateLocalField("duration", e.target.value === "" ? null : Number(e.target.value)) : undefined}
                        {...(!isEditMode ? register("duration", {
                            setValueAs: (v) => v === null || v === undefined || String(v).trim() === "" ? null : Number(v)
                        }) : {})}
                        className="btn-primary"
                    />
                </div>

                <div>
                    <label>Першоджерело</label>
                    {isEditMode ? (
                        <CustomSelect
                            value={localData.source}
                            onChange={(val) => updateLocalField("source", val)}
                            options={sourceOptions}
                            placeholder="Не обрано"
                        />
                    ) : (
                        <Controller
                            control={control}
                            name="source"
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={sourceOptions}
                                    placeholder="Не обрано"
                                />
                            )}
                        />
                    )}
                </div>

                <div className="flex flex-col">
                    <label>NSFW</label>
                    <div className="flex gap-2 items-center w-full my-auto">
                        {isEditMode ? (
                            <Checkbox
                                checked={localData.nsfw}
                                onChange={(e, checked) => updateLocalField("nsfw", checked ?? e.target.checked)}
                                color="secondary"
                                className="w-5 h-5"
                                sx={{
                                    color: purple[800],
                                    "& .MuiSvgIcon-root": { fontSize: 28 },
                                }}
                            />
                        ) : (
                            <Controller
                                control={control}
                                name="nsfw"
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        onChange={(e, checked) => field.onChange(checked ?? e.target.checked)}
                                        color="secondary"
                                        className="w-5 h-5"
                                        sx={{
                                            color: purple[800],
                                            "& .MuiSvgIcon-root": { fontSize: 28 },
                                        }}
                                    />
                                )}
                            />
                        )}
                        <span>Чи є це контент для дорослих?</span>
                    </div>
                </div>

                <AnimeDescriptionField
                    isEditMode={isEditMode}
                    value={isEditMode ? localData.description : undefined}
                    onChange={isEditMode ? (val) => updateLocalField("description", val) : undefined}
                />
            </div>
        </div>
    );
};


const kindOptions = [
    { value: null, label: "Не обрано" },
    ...Object.keys(AnimeKindEnum)
        .filter((k) => isNaN(Number(k)))
        .map((k) => ({
            value: AnimeKindEnum[k as keyof typeof AnimeKindEnum],
            label: AnimeKindMap[k] ?? k,
        }))
];
const statusOptions = [
    { value: null, label: "Не обрано" },
    ...Object.keys(AnimeStatusEnum)
        .filter((k) => isNaN(Number(k)))
        .map((k) => ({
            value: AnimeStatusEnum[k as keyof typeof AnimeStatusEnum],
            label: AnimeStatusMap[k] ?? k,
        }))
];
const ratingOptions = [
    { value: null, label: "Не обрано" },
    ...Object.keys(AnimeRatingEnum)
        .filter((k) => isNaN(Number(k)))
        .map((k) => ({
            value: AnimeRatingEnum[k as keyof typeof AnimeRatingEnum],
            label: k,
        }))
];
const sourceOptions = [
    { value: null, label: "Не обрано" },
    ...Object.keys(AnimeSource)
        .filter((k) => isNaN(Number(k)))
        .map((k) => ({
            value: AnimeSource[k as keyof typeof AnimeSource],
            label: AnimeSourceMap[k] ?? k,
        }))
];