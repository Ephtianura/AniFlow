"use client";

import React, { useState, useEffect } from "react";
import { RiFolderUploadLine } from "react-icons/ri";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import SortableScreenshotGrid from "./SortableScreenshotGrid";

interface ScreenshotItem {
    id: string;
    s3Name: string;
    previewUrl: string;
    isUploading: boolean;
}

interface AnimeScreenshotsUploaderProps {
    animeId: number;
    initialScreenshots: string[] | null;
}

export const AnimeScreenshotsUploader: React.FC<AnimeScreenshotsUploaderProps> = ({ animeId, initialScreenshots }) => {
    const [items, setItems] = useState<ScreenshotItem[]>([]);
    const [savedScreenshots, setSavedScreenshots] = useState<string[]>([]);
    const [inputUrl, setInputUrl] = useState<string>("");
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    useEffect(() => {
        if (initialScreenshots && initialScreenshots.length > 0) {
            const mapped = initialScreenshots.map((name, idx) => {
                const cdnPrefix = process.env.NEXT_PUBLIC_CDN_URL || "";

                let cleanS3Name = name;
                if (cdnPrefix && cleanS3Name.startsWith(cdnPrefix)) {
                    cleanS3Name = cleanS3Name.replace(cdnPrefix, "");
                }

                cleanS3Name = cleanS3Name.replace(/^\/+/, "");

                if (cleanS3Name.startsWith("images/anime-screenshots")) {
                    cleanS3Name = cleanS3Name.replace("images/", "");
                }

                return {
                    id: `init-${idx}-${cleanS3Name}`,
                    s3Name: cleanS3Name,
                    previewUrl: cleanS3Name.startsWith("http")
                        ? cleanS3Name
                        : `${cdnPrefix}/images/${cleanS3Name}`, 
                    isUploading: false
                };
            });

            setItems(mapped);

            const cleanSaved = mapped.map(i => i.s3Name);
            setSavedScreenshots(cleanSaved);
        } else {
            setItems([]);
            setSavedScreenshots([]);
        }
    }, [initialScreenshots]);

    const currentS3Names = items.map(item => item.s3Name);

    const isDirty =
        items.length !== savedScreenshots.length ||
        currentS3Names.some((name, idx) => name !== savedScreenshots[idx]);

    const processFiles = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        if (imageFiles.length === 0) return;

        const newItems: ScreenshotItem[] = imageFiles.map((file, idx) => {
            const localId = `file-${Date.now()}-${idx}`;
            return {
                id: localId,
                s3Name: "",
                previewUrl: URL.createObjectURL(file),
                isUploading: true
            };
        });

        setItems(prev => [...prev, ...newItems]);

        imageFiles.forEach((file, idx) => {
            const targetId = newItems[idx].id;
            const formData = new FormData();
            formData.append("file", file);

            apiFetch<{ url: string }>("/anime/screenshots/upload-file", {
                method: "POST",
                body: formData
            })
                .then((res) => {
                    const cleanName = res.url.replace(/^images\//, "").replace(/^\/+/, "");
                    setItems(prev => prev.map(item =>
                        item.id === targetId
                            ? { ...item, s3Name: cleanName, isUploading: false }
                            : item
                    ));
                })
                .catch(() => {
                    toast.error(`Не вдалося завантажити файл: ${file.name}`);
                    setItems(prev => prev.filter(item => item.id !== targetId));
                });
        });
    };

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        processFiles(Array.from(e.target.files));
        e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleAddUrl = async () => {
        const trimmedUrl = inputUrl.trim();
        if (!trimmedUrl) return;

        setInputUrl("");

        const localId = `url-${Date.now()}`;
        const newItem: ScreenshotItem = {
            id: localId,
            s3Name: "",
            previewUrl: trimmedUrl,
            isUploading: true
        };

        setItems(prev => [...prev, newItem]);

        try {
            const res = await apiFetch<{ url: string }>("/anime/screenshots/upload-url", {
                method: "POST",
                body: JSON.stringify({ url: trimmedUrl }),
                headers: { "Content-Type": "application/json" }
            });

            const cleanName = res.url.replace(/^images\//, "").replace(/^\/+/, "");

            setItems(prev => prev.map(item =>
                item.id === localId
                    ? { ...item, s3Name: cleanName, isUploading: false }
                    : item
            ));
        } catch (err) {
            toast.error("Не вдалося завантажити зображення по URL");
            setItems(prev => prev.filter(item => item.id !== localId));
        }
    };

    const handleRemove = (id: string) => {
        setItems(prev => {
            const target = prev.find(item => item.id === id);
            if (target && target.previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter(item => item.id !== id);
        });
    };

    const handleSyncWithServer = async () => {
        const isStillUploading = items.some(i => i.isUploading);
        if (isStillUploading) return toast.warning("Зачекайте, поки всі скріншоти завантажаться");

        setIsSyncing(true);
        const finalS3Names = items.map(item => item.s3Name).filter(Boolean);

        try {
            await apiFetch(`/anime/${animeId}/screenshots/sync`, {
                method: "PUT",
                body: JSON.stringify({ orderedScreenshots: finalS3Names }),
                headers: { "Content-Type": "application/json" }
            });

            toast.success("Скріншоти та їх порядок успешно збережено!");
            setSavedScreenshots(finalS3Names);
        } catch (err: any) {
            toast.error(err.message || "Помилка при синхронізації");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col gap-4 p-5 rounded-lg border w-full transition-all duration-200 ${
                isDragging 
                    ? "bg-purple-50/60 border-purple-400 border-dashed ring-4 ring-purple-100" 
                    : "bg-gray-50 border-gray-200"
            }`}
        >
            <div className={`flex flex-col sm:flex-row gap-2 justify-between items-center ${isDirty && `h-18`} sm:h-8`}>
                <h2 className="font-medium text-xl line-clamp-1">Скріншоти ({items.length})</h2>

                {isDirty && (
                    <button
                        type="button"
                        disabled={isSyncing || items.some(i => i.isUploading)}
                        onClick={handleSyncWithServer}
                        className="btn-purple font-medium active:scale-95 px-4! py-1! line-clamp-1 transition duration-200 disabled:opacity-50 disabled:pointer-events-none animate-fade-in"
                    >
                        Зберегти скріншоти
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div>
                    <input
                        id="screenshotsInput"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFilesChange}
                    />
                    <label
                        htmlFor="screenshotsInput"
                        className="px-4 py-2 bg-white text-gray-700 shadow-sm rounded border border-gray-300 cursor-pointer flex items-center gap-1.5 select-none hover:bg-gray-100 transition-colors"
                    >
                        <RiFolderUploadLine className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium">Завантажити</span>
                    </label>
                </div>

                <div className="flex gap-2 max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Вставте URL скріншоту та натисніть Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus:border-purple-400"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddUrl();
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium text-sm rounded hover:bg-gray-300 cursor-pointer select-none"
                    >
                        Додати
                    </button>
                </div>
            </div>

            {/* Передаем стейт setItems напрямую, чтобы dnd-kit сам управлял сортировкой */}
            <SortableScreenshotGrid
                items={items}
                setItems={setItems}
                onRemove={handleRemove}
            />
        </div>
    );
};