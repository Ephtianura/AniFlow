"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { RiFolderUploadLine } from "react-icons/ri";

interface AnimeScreenshotsUploaderProps {
    previews: string[];
    handleFilesChange: (files: FileList) => void;
    handleURLChange: (url: string, index: number) => void;
    removeScreenshot: (index: number) => void;
}

export const AnimeScreenshotsUploader: React.FC<AnimeScreenshotsUploaderProps> = ({
    previews,
    handleFilesChange,
    handleURLChange,
    removeScreenshot,
}) => {
    return (
        <div className="flex flex-col gap-4">

            <h2 className="font-medium text-xl">Скріншоти</h2>

            {/* Кнопка загрузки файлов */}
            <div>
                <input
                    id="screenshotsInput"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFilesChange(e.target.files)}
                />
                <label
                    htmlFor="screenshotsInput"
                    className="px-3 py-1 bg-white text-gray-text-dark shadow-sm rounded-xs border border-btn-border-light cursor-pointer flex items-center gap-1 hover:border-btn-border-dark"
                >
                    <RiFolderUploadLine className="w-5 h-5" />
                    <p>Завантажити скріншоти</p>
                </label>
            </div>

            {/* Предпросмотр скриншотов */}
            <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                    <div key={i} className="relative w-[150px] h-[100px] rounded overflow-hidden">
                        <img src={src} className="w-full h-full object-cover rounded" alt={`screenshot-${i}`} />
                        <button
                            onClick={() => removeScreenshot(i)}
                            className="absolute top-1 right-1 bg-red-400 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors duration-100 cursor-pointer"
                        >
                            <IoClose className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Новый пустой input для вставки ссылки */}
            <div className="flex flex-wrap gap-2 items-center mt-2">
                {Array(previews.length + 1)
                    .fill(0)
                    .map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            placeholder="Вставте URL скріншоту"
                            className="btn-primary max-w-50"
                            value={previews[i] || ""}
                            onChange={(e) => handleURLChange(e.target.value, i)}
                        />
                    ))}
            </div>

        </div>
    );
};
