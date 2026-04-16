"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AnimesLayout } from "@/app/admin/animes/_components/AnimesLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { BiSolidStar } from "react-icons/bi";
import { AnimeKindEnum, AnimeKindMap } from "@/core/AnimeKind";
import Link from "next/link";

export default function DeleteAnime() {
    const [animeId, setAnimeId] = useState<number | "">("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Поиск аниме
    const handleSearchChange = async (value: string) => {
        setSearchQuery(value);

        if (value.length >= 3) {
            try {
                const results = await apiFetch(`/Animes?search=${encodeURIComponent(value)}&sortBy=Score&sortDesc=true`);
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

    // Выбор аниме
    const selectAnime = async (anime: any) => {
        setAnimeId(anime.id);
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);

        // Загружаем данные выбранного аниме
        try {
            const data = await apiFetch(`/Animes/${anime.id}`);
            setSelectedAnime(data);
        } catch (err: any) {
            toast.error(err.message || "Не вдалося завантажити аніме");
        }
    };

    // Удаление аниме
    const handleDelete = async () => {
        if (!animeId) return toast.error("Виберіть аніме для видалення");

        try {
            await apiFetch(`/Animes/${animeId}`, { method: "DELETE" });
            toast.success("Аніме успішно видалено!");
            setSelectedAnime(null);
            setAnimeId("");
        } catch (err: any) {
            toast.error(err.message || "Помилка видалення");
        } finally {
            setShowModal(false);
        }
    };

    return (
        <AdminLayout>
            <AnimesLayout>
                <ToastContainer />
                <div className="space-y-6">

                    {/* Пошук */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Пошук аніме"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="btn-primary w-full"
                        />

                        {/* Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 max-h-80 overflow-y-auto">
                                {searchResults.map((anime: any) => (
                                    <div
                                        key={anime.id}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => selectAnime(anime)}
                                    >
                                        <img src={anime.posterUrl} alt={anime.titles[0]?.value} className="w-16 h-20 object-cover rounded" />
                                        <div className="flex flex-col">

                                            <span className="font-medium text-primary">
                                                {anime.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value
                                                    || anime.titles[0]?.value}
                                            </span>


                                            <span className="font-light text-gray-text text-sm">
                                                {anime.titles.find((t: any) => t.language === "Romaji" && t.type === "Official")?.value
                                                    || anime.titles[0]?.value}
                                            </span>

                                            <div className="flex gap-1 items-center">
                                                <BiSolidStar className="w-4 h-4 text-gray-text-dark" />

                                                <span className="text-sm text-gray-500">{anime.score || "N/A"}</span>

                                            </div>
                                            <span className="text-sm text-gray-500">{[AnimeKindMap[anime.kind]]} / {anime.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <hr className="text-hr-clr my-4" />
                    {/* Выбране аниме */}
                    {selectedAnime && (

                        <div className="p-4 flex flex-col gap-2">

                            <h1 className="text-primary-black font-medium text-xl">
                                Ви обрали аніме:
                            </h1>
                            <div className="flex  gap-4">
                                <img src={selectedAnime.posterUrl} alt="poster" className="w-[250px] h-[350px] object-cover rounded" />

                                <div className="flex-1 flex flex-col gap-2 ">

                                    <div className="flex flex-col">

                                        <Link href={`/anime/${selectedAnime.url}`} className="font-medium text-xl text-primary hover:underline">
                                            {selectedAnime.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value
                                                || selectedAnime.titles[0]?.value}
                                        </Link>

                                        <span className="font-light text-sm">
                                            {selectedAnime.titles.find((t: any) => t.language === "Romaji" && t.type === "Official")?.value
                                                || selectedAnime.titles[0]?.value}
                                        </span>

                                        <div className="text-primary-black text-md py-2 flex gap-1">
                                            <p className="underline">{[AnimeKindMap[selectedAnime.kind]]}</p>
                                            <p className="text-gray-dark">/ </p>
                                            <p className="underline">{selectedAnime.year}</p>
                                        </div>

                                        <p className="text-primary-black text-md line-clamp-5">
                                            {selectedAnime.description || ""}
                                        </p>
                                    </div>



                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="btn-primary bg-red-600 text-white rounded transition-colors cursor-pointer
                                        hover:bg-red-700 
                                        active:bg-red-800"
                                    >
                                        Видалити
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Модалка подтверждения */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-md w-80">
                                <h2 className="text-lg font-bold mb-4">Підтвердьте видалення</h2>
                                <p className="mb-4">Ви впевнені, що хочете видалити "<span className="font-medium">{selectedAnime.titles.find((t: any) => t.language === "Ukrainian" && t.type === "Official")?.value
                                    || selectedAnime.titles[0]?.value}</span>"?</p>
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
            </AnimesLayout>
        </AdminLayout>
    );
}
