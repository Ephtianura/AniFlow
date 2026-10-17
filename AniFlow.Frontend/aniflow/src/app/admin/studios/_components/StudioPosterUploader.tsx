"use client";

import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";
import { useRef, useState } from "react";

type Props = {
    posterPreview: string | null;
    onChange: (file: File | null) => void;
};

export function StudioPosterUploader({ posterPreview, onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (file.type.startsWith("image/")) {
            setFileName(file.name);
            onChange(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemovePoster = () => {
        onChange(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
            <h2 className="font-medium text-xl mb-2">Постер</h2>

            <div className="flex flex-col gap-4 items-center w-full">
                
                <div className="relative group w-full h-auto">
                    <label
                        htmlFor="posterInput"
                        className="block w-full h-full cursor-pointer rounded overflow-hidden shadow-md hover:ring-2 hover:ring-purple-300 transition duration-200"
                    >
                        {posterPreview ? (
                            <img
                                src={posterPreview}
                                alt="Preview"
                                className="w-full h-auto max-h-96 object-contain bg-neutral-900/5 select-none"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center select-none text-gray-400 text-sm p-4 text-center">
                                <span>Натисніть або перетягніть сюди постер</span>
                            </div>
                        )}
                    </label>

                    {posterPreview && (
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
                        ref={fileInputRef}
                        id="posterInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <label
                        htmlFor="posterInput"
                        className="btn-primary mb-2 cursor-pointer w-full text-center flex 
                                   items-center justify-center gap-1 rounded font-medium hover:bg-gray-100 duration-200 active:scale-95"
                    >
                        <TbFileUpload className="w-5 h-5" />
                        <span>Завантажити</span>
                    </label>

                    {fileName && (
                        <span className="text-gray-600 text-xs text-center font-medium truncate w-full mt-1">
                            📄 {fileName}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}