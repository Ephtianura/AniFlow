"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BiSolidStar } from "react-icons/bi";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { RelatedAnime, Anime } from "@/core/types";
import { RelationKindEnum, RelationKindMap } from "@/core/enums/RelationKind";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { AdminAnimeSearch } from "../AdminAnimeSearch";
import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import CustomSelect from "@/components/CustomSelect";
import { TitleLink } from "@/components/TitleLink";
import { LeaveConfirmationModal } from "@/app/admin/_components/LeaveConfirmationModal";

interface RelatedAnimeSelectorProps {
    animeId: number;
    initialRelateds?: RelatedAnime[] | null;
}

// Интерфейс для локального стейта, хранящий полные данные для рендера карточек
interface LocalRelatedItem {
    relatedAnimeId: number;
    relationKind: RelationKindEnum | "";
    animeData: RelatedAnime;
}

export const RelatedAnimeSelector: React.FC<RelatedAnimeSelectorProps> = ({ animeId, initialRelateds }) => {
    const [items, setItems] = useState<LocalRelatedItem[]>([]);
    const [savedItems, setSavedItems] = useState<LocalRelatedItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Инициализация данных из пропсов
    useEffect(() => {
        if (initialRelateds && initialRelateds.length > 0) {
            const formatted = initialRelateds.map(r => ({
                relatedAnimeId: r.id,
                relationKind: r.relationKind as RelationKindEnum,
                animeData: r
            }));
            setItems(formatted);
            setSavedItems(formatted);
        } else {
            setItems([]);
            setSavedItems([]);
        }
    }, [initialRelateds]);

    // Быстрое сравнение для определения состояния IsDirty
    const checkIsDirty = () => {
        if (items.length !== savedItems.length) return true;
        return items.some((item, idx) => {
            const saved = savedItems[idx];
            return (
                item.relatedAnimeId !== saved?.relatedAnimeId ||
                item.relationKind !== saved?.relationKind
            );
        });
    };

    const isDirty = checkIsDirty();

    const handleSelectAnime = (anime: any) => {
        if (anime.id === animeId) {
            toast.warning("Неможливо зв'язати аніме з самим собою");
            return;
        }

        if (items.some(i => i.relatedAnimeId === anime.id)) {
            toast.warning("Це аніме вже додано до списку зв'язків");
            return;
        }

        const newItem: LocalRelatedItem = {
            relatedAnimeId: anime.id,
            relationKind: "",
            animeData: {
                id: anime.id,
                titles: anime.titles,
                url: anime.url,
                posterUrl: anime.posterUrl,
                score: anime.score,
                kind: anime.kind,
                year: anime.year,
                genres: anime.genres || [],
                relationKind: "Other"
            }
        };

        setItems(prev => [...prev, newItem]);
    };

    const handleUpdateKind = (idx: number, kind: RelationKindEnum | "") => {
        setItems(prev => prev.map((item, i) => i === idx ? { ...item, relationKind: kind } : item));
    };

    const handleRemoveItem = (idx: number) => {
        setItems(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSaveRelateds = async () => {
        const hasEmptyKind = items.some(i => !i.relationKind);
        if (hasEmptyKind) {
            toast.error("Будь ласка, оберіть тип зв'язку для всіх аніме");
            return;
        }

        setIsSaving(true);

        // Упаковываем массив в объект со свойством RelatedsAnimes, как требует обновленный C# рекорд
        const payload = {
            RelatedsAnimes: items.map(item => ({
                RelatedAnimeId: item.relatedAnimeId,
                RelationKind: item.relationKind
            }))
        };

        try {
            // Обрати внимание на правильный URL (согласно твоему [HttpPut("{id}/related")])
            await apiFetch(`/anime/${animeId}/related`, {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });

            toast.success("Зв'язки успішно збережено!");
            setSavedItems(items);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося зберегти пов'язані аніме");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-5 bg-white rounded-md border border-hr-clr w-full">
            <div className="flex justify-between items-center mb-4 h-8 gap-2">
                <h2 className="font-medium text-xl line-clamp-1">Пов'язане аніме ({items.length})</h2>

                {isDirty && (
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveRelateds}
                        className="btn-purple font-medium active:scale-95 px-4 py-1 line-clamp-1 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Зберегти зв'язки
                    </button>
                )}
            </div>

            <div className="mb-6 w-full">
                <AdminAnimeSearch
                    placeholder="Пошук аніме для створення зв'язку..."
                    onSelect={handleSelectAnime}
                />
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item, idx) => {
                        const ua = getTitle(item.animeData.titles, TitleLanguage.Ukrainian, TitleType.Official);
                        const romaji = getTitle(item.animeData.titles, TitleLanguage.Romaji, TitleType.Official);

                        return (
                            <div
                                key={`${item.relatedAnimeId}-${idx}`}
                                className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg relative hover:shadow-sm transition-shadow duration-200"
                            >
                                {/* Кнопка удаления в углу карточки */}
                                <button
                                    type="button"
                                    onDoubleClick={() => handleRemoveItem(idx)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer p-0.5 transition active:scale-85 duration-200"
                                    title="Видалити зв'язок"
                                >
                                    <IoClose className="w-5 h-5" />
                                </button>

                                {/* Постер */}
                                <div className="w-20 h-28 aspect-5/7 rounded shadow-sm bg-gray-200">
                                    <img
                                        src={item.animeData.posterUrl || "/NotFound.jpg"}
                                        className="w-full h-full object-cover shrink-0 select-none"
                                        alt="Poster"
                                    />
                                </div>

                                {/* Контент */}
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                    <div className="flex flex-col gap-0.5">
                                        <TitleLink
                                            title={ua}
                                            url={item.animeData.url}
                                            className="line-clamp-1! text-sm! font-medium pr-2"
                                        />
                                        <span className="text-xs text-gray-400 line-clamp-1" title={romaji}>
                                            {romaji}
                                        </span>

                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="hidden sm:flex gap-0.5 items-center bg-purple-50 px-1.5 py-0.5 
                                            rounded text-xs font-medium text-purple-700 border border-purple-200/60 ">
                                                <BiSolidStar className="w-3.5 h-3.5 text-purple-500" />
                                                <span>{item.animeData.score || "0.0"}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {item.animeData.kind ? AnimeKindMap[item.animeData.kind as any] || item.animeData.kind : "—"} / {item.animeData.year || "—"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Селектор типу зв'язку */}
                                    <div className="mt-2">
                                        <div className="mt-2">
                                            <CustomSelect
                                                value={item.relationKind}
                                                onChange={(value) => handleUpdateKind(idx, value as RelationKindEnum || "")}
                                                options={kindOptions}
                                                placeholder="Оберіть тип зв'язку"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    У цього аніме ще немає налаштованих зв'язків. Скористайтеся пошуком вище.
                </div>
            )}
            <LeaveConfirmationModal isDirty={isDirty} />
        </div>
    );
};
const kindOptions = Object.values(RelationKindEnum).map((kind) => ({
    value: kind,
    label: RelationKindMap[kind]?.label || kind,
}));