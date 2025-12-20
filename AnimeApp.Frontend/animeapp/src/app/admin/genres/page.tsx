"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import { IoClose, IoPencil } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import Link from "next/link";
import WhiteCard from "@/components/WhiteCard";

export default function GenresManage() {
    const [genres, setGenres] = useState<{ id: number; nameUa: string; nameEn: string; nameRu: string }[]>([]);
    const [editingGenre, setEditingGenre] = useState<{ id: number; nameUa: string; nameEn: string; nameRu: string } | null>(null);
    const [nameUa, setNameUa] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [mode, setMode] = useState<"create" | "edit" | "delete">("create");

    const fetchGenres = async () => {
        try {
            const data = await apiFetch("/Genres");
            setGenres(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleCreate = async () => {
        if (!nameUa.trim()) return toast.error("Назва UA обов'язкова");
        if (!nameEn.trim()) return toast.error("Назва EN обов'язкова");
        try {
            const newGenre = await apiFetch("/Genres", {
                method: "POST",
                body: JSON.stringify({ nameUa, nameEn, nameRu }),
                headers: { "Content-Type": "application/json" },
            });
            setGenres(prev => [...prev, newGenre]);
            setNameUa(""); setNameEn(""); setNameRu("");
            toast.success("Жанр успішно створено!");
        } catch (err: any) {
            toast.error(err.message || "Помилка при створенні жанру");
        }
    };

    const handleEditClick = (genre: { id: number; nameUa: string; nameEn: string; nameRu: string }) => {
        setEditingGenre(genre);
        setNameUa(genre.nameUa);
        setNameEn(genre.nameEn);
        setNameRu(genre.nameRu);
        setMode("edit");
    };

    const handleUpdate = async () => {

        if (!editingGenre) return;
        if (!nameUa.trim()) return toast.error("Назва UA обов'язкова");
        if (!nameEn.trim()) return toast.error("Назва EN обов'язкова");
        try {
            const updatedGenre = await apiFetch(`/Genres/${editingGenre.id}`, {
                method: "PUT",
                body: JSON.stringify({ nameUa, nameEn, nameRu }),
                headers: { "Content-Type": "application/json" },
            });


            fetchGenres();
            setGenres(prev =>
                prev.map(g => g.id === editingGenre.id ? { ...g, ...updatedGenre } : g)
            );
            setEditingGenre(null);
            setNameUa(""); setNameEn("");
            toast.success("Жанр успішно оновлено!");
        } catch (err: any) {
            toast.error(err.message || "Помилка при оновленні жанру");
        }

    };

    const handleDelete = async (id: number) => {
        if (!confirm("Ви впевнені, що хочете видалити жанр?")) return;
        try {
            await apiFetch(`/Genres/${id}`, { method: "DELETE" });
            setGenres(prev => prev.filter(g => g.id !== id));
            toast.success("Жанр видалено!");
        } catch (err: any) {
            toast.error(err.message || "Помилка при видаленні жанру");
        }
    };

    const linkClasses = (current: string) =>
        `btn-primary text-center transition active:bg-gray-200 active:border-gray-300 cursor-pointer ${mode === current ?
            "bg-gray-100 border-gray-300 active:bg-gray-300 active:border-gray-400" : // активна кнопка
            "" // неактивна кнопка
        }`;

    return (
        <AdminLayout>
            <div className="">
                <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm text-center">
                    Управління жанрами
                </h1>

                {/* Кнопки выбора режима */}
                <div className="flex gap-4 mb-6">
                    <button className={linkClasses("create")} onClick={() => setMode("create")}>Створити</button>
                    <button className={linkClasses("edit")} onClick={() => setMode("edit")}>Змінити</button>
                    <button className={linkClasses("delete")} onClick={() => setMode("delete")}>Видалити</button>
                </div>

                <hr className="text-hr-clr my-6" />


                {/* Форма створення */}
                {mode === "create" && (
                    <div className="flex justify-center">
                        <div className="bg-white p-4 rounded shadow space-y-4 max-w-md border-1 border-hr-clr">
                            <h2 className="text-xl font-bold">Створити новий жанр</h2>
                            <input
                                type="text"
                                placeholder="Назва UA"
                                className="btn-primary w-full"
                                value={nameUa}
                                onChange={e => setNameUa(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Назва EN"
                                className="btn-primary w-full"
                                value={nameEn}
                                onChange={e => setNameEn(e.target.value)}
                            />
                            <button
                                className="btn-primary bg-purple-800/70 hover:bg-purple-800/80 active:bg-purple-800/90 
                                    text-white cursor-pointer"
                                onClick={handleCreate}
                            >
                                Створити
                            </button>
                        </div>


                    </div>
                )}

                {/* Форма редагування */}
                {mode === "edit" && editingGenre && (
                    <div className="flex justify-center">
                        <div className="bg-white p-4 rounded shadow space-y-4 max-w-md border-1 border-hr-clr m">
                            <h2 className="text-xl font-bold">Редагування жанру</h2>
                            <input
                                type="text"
                                placeholder="Назва UA"
                                className="btn-primary w-full"
                                value={nameUa}
                                onChange={e => setNameUa(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Назва EN"
                                className="btn-primary w-full"
                                value={nameEn}
                                onChange={e => setNameEn(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    className="btn-primary bg-purple-800/70 hover:bg-purple-800/80 active:bg-purple-800/90 
                                    text-white cursor-pointer"
                                    onClick={handleUpdate}
                                >
                                    Зберегти
                                </button>
                                <button
                                    className="btn-primary bg-gray-500/70 hover:bg-gray-600/80 active:bg-gray-700/90 text-white cursor-pointer"
                                    onClick={() => {
                                        setEditingGenre(null);
                                        setNameUa(""); setNameEn(""); setNameRu("");
                                    }}
                                >
                                    Відмінити
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <hr className="text-hr-clr my-6" />
                {/* Список жанрів */}
                <div className="flex flex-wrap gap-2 mt-6">
                    {genres.map(g => (
                        <div
                            key={g.id}
                            className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full shadow-sm cursor-pointer transition-colors
                            hover:bg-gray-300 
                            active:bg-gray-400 active:scale-98"

                            onClick={() => {
                                if (mode === "edit") handleEditClick(g);
                                if (mode === "delete") handleDelete(g.id);
                            }}
                        >
                            <span>{g.nameUa}</span>
                            {mode === "edit" && <LuPencilLine className="text-gray-text-dark w-5 h-5" />}
                            {mode === "delete" && <IoClose className="text-red-400 w-5 h-5" />}
                        </div>
                    ))}
                </div>



                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
        </AdminLayout>
    );
}
