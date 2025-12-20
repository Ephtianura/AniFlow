"use client";

import React from "react";

interface Genre {
    id: number;
    nameUa: string;
}

interface AnimeGenresSelectorProps {
    genres: Genre[];
    selectedGenres: number[];
    setSelectedGenres: React.Dispatch<React.SetStateAction<number[]>>;
}

export const AnimeGenresSelector: React.FC<AnimeGenresSelectorProps> = ({
    genres,
    selectedGenres,
    setSelectedGenres,
}) => {
    return (
        <div>
            <h2 className="font-medium text-xl mb-2 flex items-center justify-between">
                Жанри
                {selectedGenres.length > 0 && (
                    <button
                        onClick={() => setSelectedGenres([])}
                        className="text-sm text-primary hover:underline cursor-pointer font-normal"
                    >
                        Скинути вибір
                    </button>
                )}
            </h2>
            <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                    <button
                        key={g.id}
                        onClick={() =>
                            selectedGenres.includes(g.id)
                                ? setSelectedGenres(selectedGenres.filter((id) => id !== g.id))
                                : setSelectedGenres([...selectedGenres, g.id])
                        }
                        className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-300 transition-colors duration-100
                            ${selectedGenres.includes(g.id)
                                ? "bg-primary text-white hover:bg-purple-600 active:bg-purple-700"
                                : "bg-gray-200"
                            }`}
                    >
                        {g.nameUa}
                    </button>
                ))}
            </div>
        </div>
    );
};
