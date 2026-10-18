"use client";

interface GenreTileProps {
    name: string;
    isSelected: boolean;
} 

export const GenreTile = ({ name, isSelected }: GenreTileProps) => {
    return (
        <div
            className={`px-2.5 py-1.25 rounded cursor-pointer hover:bg-gray-300 
                duration-200 active:scale-95 transition select-none
                ${isSelected
                    ? "bg-primary text-white hover:bg-purple-600 active:bg-purple-700"
                    : "bg-gray-200"
                }`}
        >
            {name}
        </div>
    );
};