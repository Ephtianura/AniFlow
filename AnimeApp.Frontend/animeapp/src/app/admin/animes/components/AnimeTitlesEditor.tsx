"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import {TitleType } from "@/core/enums/TitleType";
import {TitleLanguage } from "@/core/enums/TitleLanguage"; // Подкорректируй путь

interface Title {
    value: string;
    language: TitleLanguage;
    type: TitleType;
}

interface AnimeTitlesEditorProps {
    titles: Title[];
    setTitles: React.Dispatch<React.SetStateAction<Title[]>>;
}

export const AnimeTitlesEditor: React.FC<AnimeTitlesEditorProps> = ({ titles, setTitles }) => {
    return (
        <div>
            <h2 className="font-medium text-xl mb-2">Додати назви</h2>
            <div className="max-h-110 overflow-y-auto pr-2">
                {titles.map((t, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                        {/* Поле ввода названия */}
                        <input
                            type="text"
                            placeholder="Назва аніме"
                            className="flex items-center justify-between
                                px-3 py-[6px] bg-white text-gray-text-dark 
                                shadow-sm rounded-xs border border-btn-border-light 
                                transition-colors duration-200
                                hover:border-btn-border-dark 
                                focus:outline-none focus:border-btn-border-dark 
                                focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                            value={t.value}
                            onChange={(e) => {
                                const newTitles = [...titles];
                                newTitles[idx].value = e.target.value;
                                setTitles(newTitles);
                            }}
                        />

                        {/* Выбор языка */}
                        <select
                            value={t.language}
                            onChange={(e) => {
                                const newTitles = [...titles];
                                newTitles[idx].language = e.target.value as unknown as TitleLanguage;
                                setTitles(newTitles);
                            }}
                            className="flex items-center justify-between
                                px-3 py-[6px] bg-white text-gray-text-dark 
                                shadow-sm rounded-xs border border-btn-border-light 
                                transition-colors duration-200
                                hover:border-btn-border-dark 
                                focus:outline-none focus:border-btn-border-dark 
                                focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                        >
                            {Object.keys(TitleLanguage)
                                .filter(k => isNaN(Number(k)))
                                .map(lang => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                        </select>

                        {/* Выбор типа */}
                        <select
                            value={t.type}
                            onChange={(e) => {
                                const newTitles = [...titles];
                                newTitles[idx].type = e.target.value as unknown as TitleType;
                                setTitles(newTitles);
                            }}
                            className="flex items-center justify-between
                                px-3 py-[6px] bg-white text-gray-text-dark 
                                shadow-sm rounded-xs border border-btn-border-light 
                                transition-colors duration-200
                                hover:border-btn-border-dark 
                                focus:outline-none focus:border-btn-border-dark 
                                focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                        >
                            {Object.keys(TitleType)
                                .filter(k => isNaN(Number(k)))
                                .map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                        </select>

                        {/* Удалить название */}
                        <button
                            className="cursor-pointer
                                text-red-400 border-2 border:red-400
                                hover:text-white hover:bg-red-400 
                                rounded-sm transition-colors duration-100"
                            onClick={() => setTitles(titles.filter((_, i) => i !== idx))}
                        >
                            <IoClose className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Добавить название */}
            <button
                className="border-2 border-green-400 text-green-400 px-3 py-1 mt-2 rounded-sm cursor-pointer font-medium
                    hover:border-green-600 hover:bg-green-500 hover:text-white
                    transition-colors duration-100"
                onClick={() =>
                    setTitles([...titles, { value: "", language: TitleLanguage.Romaji, type: TitleType.Official }])
                }
            >
                Додати назву
            </button>
        </div>
    );
};
