"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { StudiosLayout } from "@/app/admin/studios/StudiosLayout";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";
import SearchBar from "@/components/SearchBar";

export default function UpdateStudio() {
    const [studioId, setStudioId] = useState<number | "">("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedStudio, setSelectedStudio] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [poster, setPoster] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    // ================================
    // Поиск студии по словам
    // ================================
    const handleSearchChange = async (value: string) => {
        setSearchQuery(value);
        if (value.length >= 3) {
            try {
                const results = await apiFetch(`/Studios?search=${encodeURIComponent(value)}&sortBy=Name&sortDesc=false`);
                setSearchResults(results.items || []);
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const selectStudio = async (studio: any) => {
        setStudioId(studio.id);
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);

        try {
            const data = await apiFetch(`/Studios/${studio.id}`);
            setSelectedStudio(data);

            // Загружаем данные в форму
            setName(data.name || "");
            setDescription(data.description || "");
            setPosterPreview(data.posterUrl || null);
            setPoster(null);
        } catch (err: any) {
            toast.error(err.message || "Не вдалося завантажити студію");
        }
    };

    const handlePosterChange = (files: FileList) => {
        if (files[0]) {
            setPoster(files[0]);
            setPosterPreview(URL.createObjectURL(files[0]));
        }
    };

    // ================================
    // Обновление студии
    // ================================
    const handleUpdate = async () => {
        if (!studioId) return toast.error("Виберіть студію для оновлення");

        setErrors({});
        try {
            const payload = {
                name: name.trim(),
                description: description.trim() || "No description",
            };

            await apiFetch(`/Studios/${studioId}`, {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            // Загрузка постера
            if (poster) {
                const fd = new FormData();
                fd.append("Poster", poster);

                await apiFetch(`/Studios/${studioId}/UploadFiles`, {
                    method: "PUT",
                    body: fd,
                });
            }

            toast.success("Студію оновлено!");
        } catch (err: any) {
            if (err.validationErrors) {
                setErrors(err.validationErrors);
                return;
            }
            toast.error(err.message || "Помилка при оновленні студії");
        }
    };

    return (
        <AdminLayout>
            <StudiosLayout>
                <ToastContainer position="top-right" autoClose={3000} />

                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Оновлення студії</h2>

                    {/* Поиск */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Пошук студії"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="btn-primary w-full"
                        />
                       

                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 max-h-80 overflow-y-auto">
                                {searchResults.map((studio: any) => (
                                    <div
                                        key={studio.id}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => selectStudio(studio)}
                                    >
                                        {studio.posterUrl && (
                                            <img
                                                src={studio.posterUrl}
                                                alt={studio.name}
                                                className="w-35 h-20 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-primary">{studio.name}</span>
                                            <span className="text-sm text-gray-500 line-clamp-2">{studio.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <hr className="text-hr-clr my-0" />
                    {/* Форма для выбранной студии */}
                    {selectedStudio && (
                        <div className="flex flex-col gap-4 mt-6">
                            <div>
                                <label className="font-medium">Назва</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="btn-primary"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Опис</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={4}
                                    className="btn-primary"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Постер</label>
                                <input
                                    id="posterInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => e.target.files && handlePosterChange(e.target.files)}
                                />
                                <label
                                    htmlFor="posterInput"
                                    className="px-3 py-1 bg-white text-gray-text-dark shadow-sm rounded-xs border border-btn-border-light cursor-pointer hover:border-btn-border-dark flex items-center gap-1"
                                >
                                    <TbFileUpload className="w-5 h-5" />
                                    Завантажити постер
                                </label>

                                {posterPreview && (
                                    <div className="mt-2 flex flex-col items-center gap-2">
                                        <img
                                            src={posterPreview}
                                            alt="poster"
                                            className="object-cover rounded max-h-80"
                                        />
                                        <button
                                            onClick={() => {
                                                setPoster(null);
                                                setPosterPreview(null);
                                                const input = document.getElementById("posterInput") as HTMLInputElement;
                                                if (input) input.value = "";
                                            }}
                                            className="w-40 h-9 flex items-center justify-center gap-1 px-3 py-1 bg-white text-gray-text-dark
                                                shadow-sm rounded-xs border border-btn-border-light
                                                hover:bg-red-200 hover:border-btn-border-dark
                                                active:bg-red-300 transition-colors cursor-pointer"
                                        >
                                            <IoClose className="w-5 h-5 mt-[2px]" />
                                            <p>Прибрати</p>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="border-2 border-primary text-primary px-6 py-2 rounded font-bold cursor-pointer
                                        hover:bg-purple-600 hover:text-white hover:border-purple-700
                                        active:bg-purple-700 active:border-purple-800
                                        transition-colors duration-200"
                            >
                                Оновити студію
                            </button>

                            {Object.keys(errors).length > 0 && (
                                <div className="mt-4 p-4 border-2 border-red-400 bg-red-100 rounded">
                                    <h3 className="text-red-600 font-bold mb-2">Помилки валідації:</h3>
                                    <ul className="list-disc list-inside text-red-600">
                                        {Object.entries(errors).map(([field, msgs]) =>
                                            msgs.map((msg, i) => (
                                                <li key={`${field}-err-${i}`}>{field}: {msg}</li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </StudiosLayout>
        </AdminLayout>
    );
}
