"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { Anime, Animes } from "@/core/types";
import { AnimeKindMap } from "@/core/enums/AnimeKind";
import { IoWarningOutline } from "react-icons/io5";
import { AdminAnimeSearch } from "../update/AdminAnimeSearch";
import { TitleLink } from "@/components/TitleLink";
import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { SubTitle } from "@/components/SubTitle";
import AnimeDescription from "@/app/anime/[animeUrl]/_components/AnimeDescription";

export default function DeleteAnime() {
    const [animeId, setAnimeId] = useState<number | null>(null);
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const getMainTitle = (anime: Anime | null) => {
        if (!anime) return "";
        return getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official) ||
            getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official);
    };

    const targetTitle = getMainTitle(selectedAnime);

    const expectedConfirmationPhrase = `Я впевнений, що хочу видалити аніме ${targetTitle}`;

    const isConfirmationValid = confirmationInput.trim() === expectedConfirmationPhrase;

    useEffect(() => {
        setConfirmationInput("");
    }, [animeId]);

    const handleSelectAnime = async (anime: Animes) => {
        setAnimeId(anime.id);

        try {
            const data = await apiFetch<Anime>(`/anime/${anime.id}`);
            setSelectedAnime(data);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося завантажити аніме");
        }
    };

    const handleDelete = async () => {
        if (!animeId) return;
        setIsDeleting(true);

        try {
            await apiFetch(`/anime/${animeId}`, { method: "DELETE" });
            toast.success("Аніме успішно видалено!");
            setSelectedAnime(null);
            setAnimeId(null);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося видалити аніме");
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <div>
                <AdminAnimeSearch
                    placeholder="Почніть вводити назву аніме для видалення..."
                    onSelect={handleSelectAnime}
                />
            </div>

            {selectedAnime && <hr className="border-gray-200 my-6" />}

            {selectedAnime && (
                <div className="bg-white border border-hr-clr rounded p-4 transition animate-fadeIn">
                    <h1 className="font-semibold text-lg mb-4">
                        Ви обрали аніме для видалення:
                    </h1>

                    <div className="flex flex-col items-start md:flex-row gap-6">
                        <img
                            src={selectedAnime.posterUrl || "NoFound.jpg"}
                            alt="poster"
                            className="w-full md:w-75 aspect-5/7 object-cover rounded-lg shadow-inner shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                <div>
                                    <TitleLink
                                        url={selectedAnime.url}
                                        title={targetTitle}
                                        className="font-bold text-2xl text-purple-600 hover:text-purple-700"
                                    />
                                    <SubTitle subTitle={getTitle(selectedAnime.titles, TitleLanguage.Romaji, TitleType.Official)} className="text-sm!" />
                                </div>


                                <div className="text-gray-600 text-sm flex gap-2 items-center">
                                    {selectedAnime.kind && (
                                        <>
                                            <span className="bg-gray-100 px-2.5 py-0.5 rounded-md font-medium text-gray-700">
                                                {AnimeKindMap[selectedAnime.kind]}
                                            </span>
                                            <span className="text-gray-300">|</span>
                                        </>
                                    )}
                                    {selectedAnime.year &&
                                        <span className="font-semibold">{selectedAnime.year} рік</span>
                                    }
                                </div>
                                {selectedAnime.description && (
                                    <AnimeDescription description={selectedAnime.description} className="line-clamp-4!" />
                                )}

                            </div>

                            <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 flex flex-col gap-3">
                                <p className="text-xs text-red-700 font-medium ">
                                    Для розблокування кнопки видалення, скопіюйте або введіть фразу повністю:
                                    <br />
                                    <span className="select-all font-mono bg-white px-1.5 py-0.5 border border-red-200 rounded text-red-600 inline-block mt-1 font-bold">
                                        {expectedConfirmationPhrase}
                                    </span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Введіть фразу-підтвердження тут..."
                                    value={confirmationInput}
                                    onChange={(e) => setConfirmationInput(e.target.value)}
                                    className="w-full text-sm px-3 py-2 border border-red-200 bg-white rounded-md outline-none focus:border-red-400 transition-colors placeholder:text-gray-400 text-gray-800"
                                />

                                <button
                                    onClick={() => setShowModal(true)}
                                    disabled={!isConfirmationValid}
                                    className={`w-full select-none py-2.5 px-4 font-semibold text-sm rounded-md transition-all flex items-center justify-center gap-2
                                        ${isConfirmationValid
                                            ? "btn-red text-white"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        }`}
                                >
                                    Видалити аніме з бази
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && selectedAnime && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 animate-scaleUp">

                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                                <IoWarningOutline className="w-6 h-6" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Остаточне підтвердження
                            </h2>

                            <p className="text-sm text-gray-500 leading-relaxed">
                                Ви дійсно впевнені, що хочете безповоротно видалити аніме
                                <span className="font-semibold text-gray-800 block my-1">
                                    «{targetTitle}»
                                </span>
                                Цю дію неможливо буде скасувати, а всі зв'язки будуть стерті.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                                className="btn-white w-full px-4 py-2 text-sm font-medium border border-hr-clr rounded-md "
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full px-4 py-2 text-sm font-semibold btn-red text-white shadow-sm disabled:opacity-50"
                            >
                                Так, видалити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}