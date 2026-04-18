"use client";

import { AdminLayout } from "@/app/admin/AdminLayout";
import { StudiosLayout } from "@/app/admin/studios/StudiosLayout";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";

export default function DeleteStudio() {
    const [studioId, setStudioId] = useState<number | "">("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedStudio, setSelectedStudio] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

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
        } catch (err: any) {
            toast.error(err.message || "Не вдалося завантажити студію");
        }
    };

    const handleDelete = async () => {
        if (!studioId) return toast.error("Виберіть студію для видалення");

        try {
            await apiFetch(`/Studios/${studioId}`, { method: "DELETE" });
            toast.success("Студія успішно видалена!");
            setSelectedStudio(null);
            setStudioId("");
        } catch (err: any) {
            toast.error(err.message || "Помилка видалення");
        } finally {
            setShowModal(false);
        }
    };

    return (
        <AdminLayout>
            <StudiosLayout>
                <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Видалення студії</h2>
                    {/* Поиск */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Пошук студії"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="btn-primary w-full"
                        />
                        {/* Dropdown */}
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

                    {/* Выбранная студия */}
                    {selectedStudio && (
                        <div className="p-4 flex flex-col gap-2">
                            <h1 className="text-primary-black font-medium text-xl">Ви обрали студію:</h1>

                            <div className="flex gap-4 items-start">

                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-medium text-2xl text-primary">{selectedStudio.name}</span>
                                    <p className="text-primary-black text-md line-clamp-6">{selectedStudio.description}</p>

                                    <div className="flex justify-center">
                                        {selectedStudio.posterUrl && (
                                            <img
                                                src={selectedStudio.posterUrl}
                                                alt={selectedStudio.name}
                                                className="object-cover rounded max-w-[50%]"
                                            />
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="btn-primary bg-red-600 text-white rounded w-full cursor-pointer hover:bg-red-700 active:bg-red-800 mt-4 w-32"
                                    >
                                        Видалити
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Модалка видалення */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-md w-80">
                                <h2 className="text-lg font-bold mb-4">Підтвердьте видалення</h2>
                                <p className="mb-4">
                                    Ви впевнені, що хочете видалити "<span className="font-medium">{selectedStudio?.name}</span>"?
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="btn-primary cursor-pointer active:bg-gray-200 transition-colors hover:bg-gray-100"
                                    >
                                        Відмінити
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn-primary rounded bg-red-600 text-white cursor-pointer hover:bg-red-700 active:bg-red-800"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </StudiosLayout>
        </AdminLayout>
    );
}
