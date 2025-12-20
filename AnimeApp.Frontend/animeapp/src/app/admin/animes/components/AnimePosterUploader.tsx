"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";

interface AnimePosterUploaderProps {
    poster: File | null;
    setPoster: React.Dispatch<React.SetStateAction<File | null>>;
    posterPreview: string | null;
    setPosterPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AnimePosterUploader: React.FC<AnimePosterUploaderProps> = ({
    poster,
    setPoster,
    posterPreview,
    setPosterPreview,
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setPoster(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleRemovePoster = () => {
        setPoster(null);
        setPosterPreview(null);
        const input = document.getElementById("posterInput") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleUrlChange = async (url: string) => {
        setPosterPreview(url);
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const file = new File([blob], "poster.jpg", { type: blob.type });
            setPoster(file);
        } catch {
            console.warn("Невдалось завантажити файл з URL");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="font-medium text-xl mb-2">Постер</h2>

            <div className="flex flex-col gap-4 items-center">
                {/* Предпросмотр постера */}
                {posterPreview && (
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-primary-black font-medium">Вибрано постер:</p>
                        <img
                            src={posterPreview}
                            alt="preview"
                            className="w-[250px] h-[350px] rounded object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-col items-center">
                    {/* Скрытый input */}
                    <input
                        id="posterInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Кнопка загрузки */}
                    <label
                        htmlFor="posterInput"
                        className="px-3 py-1 bg-white text-gray-text-dark 
                                   shadow-sm rounded-xs border border-btn-border-light
                                   transition-colors duration-200 cursor-pointer
                                   hover:border-btn-border-dark active:border-btn-border-dark
                                   active:shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-2"
                    >
                        <div className="flex items-center gap-1">
                            <TbFileUpload className="w-5 h-5" />
                            <p>Завантажити постер</p>
                        </div>
                    </label>

                    {/* Вставка URL */}
                    <input
                        type="text"
                        placeholder="Або вставте URL "
                        className="btn-primary w-full mb-2"
                        onChange={async (e) => handleUrlChange(e.target.value)}
                    />

                    {/* Кнопка удалить */}
                    {poster && (
                        <button
                            onClick={handleRemovePoster}
                            className="w-30 h-7 flex items-center gap-1 px-3 py-1 bg-white text-gray-text-dark
                                       shadow-sm rounded-xs border border-btn-border-light
                                       transition-colors duration-200 cursor-pointer
                                       hover:border-btn-border-dark hover:bg-red-200
                                       active:border-btn-border-dark
                                       active:bg-red-300
                                       active:shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-2"
                        >
                            <IoClose className="w-5 h-5 mt-[2px]" />
                            <p>Прибрати</p>
                        </button>
                    )}

                    {/* Текст имени файла */}
                    <span className="ml-3 text-gray-400 text-xs text-center">
                        {poster ? poster.name : "Постер не вибрано"}
                    </span>
                </div>
            </div>
        </div>
    );
};
