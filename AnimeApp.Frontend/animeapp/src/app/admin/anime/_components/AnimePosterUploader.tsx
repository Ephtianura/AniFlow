"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { LeaveConfirmationModal } from "../../_components/LeaveConfirmationModal";

interface AnimePosterUploaderProps {
    animeId?: number | null;
    initialUrl?: string | null;
}

export const AnimePosterUploader: React.FC<AnimePosterUploaderProps> = ({ animeId, initialUrl }) => {
    const isEditMode = !!animeId;
    const { setValue } = useFormContext();

    const [localFile, setLocalFile] = useState<File | null>(null);
    const [localUrl, setLocalUrl] = useState<string>("");
    const [savedUrl, setSavedUrl] = useState<string>("");
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState<boolean>(false); // Стейт для подсветки дропзоны

    useEffect(() => {
        if (isEditMode && initialUrl) {
            setLocalUrl(initialUrl);
            setSavedUrl(initialUrl);
        }
    }, [initialUrl, isEditMode]);

    useEffect(() => {
        if (localFile) {
            const objectUrl = URL.createObjectURL(localFile);
            setFilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setFilePreview(null);
        }
    }, [localFile]);

    const activePreview = filePreview || (localUrl.trim() !== "" ? localUrl : null);

    const isDirty = isEditMode && (localFile !== null || localUrl.trim() !== savedUrl);

    // Вынесли обработку файла в отдельную функцию
    const processPosterFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Будь ласка, завантажте файл зображення");
            return;
        }

        setLocalFile(file);
        setLocalUrl("");

        if (!isEditMode) {
            setValue("poster.file", file, { shouldValidate: true, shouldDirty: true });
            setValue("poster.url", null, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processPosterFile(e.target.files[0]);
        }
    };

    // --- Drag and Drop обработчики ---
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
            const files = Array.from(e.dataTransfer.files);
            
            // Если перетащили несколько, берём только первый, но предупреждаем
            if (files.length > 1) {
                toast.warning("Постер може бути лише один. Вибрано перше зображення");
            }

            processPosterFile(files[0]);
        }
    };
    // ---------------------------------

    const handleUrlChange = (value: string) => {
        setLocalUrl(value);
        const trimmed = value.trim();

        if (!isEditMode) {
            if (trimmed === "") {
                setLocalFile(null);
                setValue("poster.url", null, { shouldValidate: true, shouldDirty: true });
            } else {
                setLocalFile(null);
                setValue("poster.url", trimmed, { shouldValidate: true, shouldDirty: true });
                setValue("poster.file", null, { shouldValidate: true, shouldDirty: true });
            }
        }
    };

    const handleRemovePoster = () => {
        setLocalFile(null);
        setLocalUrl("");

        if (!isEditMode) {
            setValue("poster.file", null, { shouldValidate: true, shouldDirty: true });
            setValue("poster.url", null, { shouldValidate: true, shouldDirty: true });
        }

        const input = document.getElementById("posterInput") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleSaveToServer = async () => {
        if (!animeId) return;
        if (!localFile && !localUrl.trim()) return toast.error("Виберіть файл або вкажіть URL");

        setIsUploading(true);
        try {
            const formData = new FormData();
            if (localFile) {
                formData.append("Poster", localFile);
            } else if (localUrl.trim()) {
                formData.append("PosterUrl", localUrl.trim());
            }

            await apiFetch(`/Anime/${animeId}/files`, {
                method: "PATCH",
                body: formData,
            });

            toast.success("Постер успішно оновлено!");

            if (localFile) {
                setSavedUrl(filePreview || "");
                setLocalFile(null);
                if (filePreview) setLocalUrl(filePreview);
            } else {
                setSavedUrl(localUrl.trim());
            }
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Помилка при завантаженні постера");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center p-4 rounded-lg border w-full max-w-75 transition-all duration-200 ${
                isDragging 
                    ? "bg-purple-50/60 border-purple-400 border-dashed ring-4 ring-purple-100" 
                    : "bg-gray-50 border-gray-200"
            }`}
        >
            <LeaveConfirmationModal isDirty={isDirty} />
            <h2 className="font-medium text-xl mb-2">Постер</h2>

            <div className="flex flex-col gap-4 items-center max-w-75  w-full">

                <div className="relative group aspect-5/7">
                    <label
                        htmlFor="posterInput"
                        className="block cursor-pointer rounded overflow-hidden shadow-md hover:ring-2 hover:ring-purple-300 transition duration-200"
                    >
                        {activePreview ? (
                            <img
                                src={activePreview}
                                alt="Preview"
                                className="w-full h-full object-cover aspect-5/7 select-none"
                            />
                        ) : (
                            <div className="w-full h-full aspect-5/7 bg-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center select-none text-gray-400 text-sm p-4 text-center">
                                <span>Натисніть або перетягніть сюди постер</span>
                            </div>
                        )}
                    </label>

                    {activePreview && (
                        <button
                            type="button"
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemovePoster();
                            }}
                            className={`absolute top-2 right-2 bg-red-400 text-white p-1 rounded-full 
                            shadow-lg hover:bg-red-600 transition cursor-pointer z-10 active:scale-90`}
                            title="Прибрати постер"
                        >
                            <IoClose className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center w-full">
                    <input
                        id="posterInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <label
                        htmlFor="posterInput"
                        className={`btn-primary mb-2 cursor-pointer w-full text-center flex 
                        items-center justify-center gap-1 rounded font-medium hover:bg-gray-100 duration-200 active:scale-95`}
                    >
                        <TbFileUpload className="w-5 h-5" />
                        <span>Завантажити</span>
                    </label>

                    <input
                        type="text"
                        placeholder="Або вставте URL"
                        value={localUrl}
                        className="btn-primary w-full text-sm mb-3"
                        onChange={(e) => handleUrlChange(e.target.value)}
                    />

                    {localFile && (
                        <span className="text-gray-600 text-xs text-center font-medium truncate w-full mb-3">
                            📄 {localFile.name}
                        </span>
                    )}

                    {isEditMode && isDirty && (
                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={handleSaveToServer}
                            className="btn-purple text-white text-sm w-full font-medium active:scale-95 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Зберегти постер
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};