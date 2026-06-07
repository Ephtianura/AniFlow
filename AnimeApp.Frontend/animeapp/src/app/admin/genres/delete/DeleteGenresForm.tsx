"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { Genre } from "@/core/types";
import { tagTypeLabels } from "@/core/enums/TagType";
import { IoWarningOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import GenreGroupList from "../_components/GenreGroupList";

interface Props {
    genres: Genre[];
}

export default function DeleteGenresForm({ genres }: Props) {
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const targetTitle = selectedGenre ? (selectedGenre.nameUa || selectedGenre.nameEn) : "";
    const expectedConfirmationPhrase = `Я впевнений, що хочу видалити жанр ${targetTitle}`;
    const isConfirmationValid = confirmationInput.trim() === expectedConfirmationPhrase;

    useEffect(() => {
        setConfirmationInput("");
    }, [selectedGenre]);

    const handleDelete = async () => {
        if (!selectedGenre) return;
        setIsDeleting(true);

        try {
            await apiFetch(`/genres/${selectedGenre.id}`, { method: "DELETE" });
            toast.success("Жанр/тег успішно видалено!");
            setSelectedGenre(null);
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося видалити жанр");
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <div className="space-y-6 w-full">

            {selectedGenre ? (
                <div className="bg-white border border-hr-clr rounded p-6 max-w-xl mx-auto w-full transition animate-fadeIn shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-bold text-lg text-gray-800">
                            Ви обрали елемент для видалення:
                        </h1>
                        <button
                            type="button"
                            onClick={() => setSelectedGenre(null)}
                            className="text-sm primary-link hover:text-purple-700 cursor-pointer"
                        >
                            Скасувати
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Информационный блок о жанре */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
                            <div>
                                <span className="text-xs font-semibold text-gray-400 block">Назва UA / EN</span>
                                <span className="font-bold text-xl text-purple-600">
                                    {selectedGenre.nameUa || "—"} <span className="text-gray-400 text-sm font-normal">({selectedGenre.nameEn})</span>
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 block">Слаг</span>
                                    <code className="font-mono bg-white px-1.5 py-0.5 border border-gray-200 rounded text-gray-700 text-xs">
                                        {selectedGenre.slug}
                                    </code>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 block">Тип системи</span>
                                    <span className="font-medium text-gray-700">
                                        {tagTypeLabels[selectedGenre.type] || selectedGenre.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Блок подтверждения удаления */}
                        <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 flex flex-col gap-3">
                            <p className="text-xs text-red-700 font-medium leading-relaxed">
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
                                className={`select-none w-full py-2.5 px-4 font-semibold text-sm rounded-md transition-all flex items-center justify-center gap-2
                                    ${isConfirmationValid
                                        ? "btn-red text-white cursor-pointer shadow-sm"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    }`}
                            >
                                Видалити з бази даних
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center text-center justify-center p-8 h-[423px] border-2 border-dashed border-hr-clr rounded-lg text-gray-400 mx-auto max-w-xl w-full">
                    Натисніть на капсулу жанру нижче, щоб почати видалення.
                </div>
            )}

            <GenreGroupList
                genres={genres}
                title="Оберіть елемент для видалення:"
                selectedGenreId={selectedGenre?.id}
                onSelect={setSelectedGenre}
            />

            {selectedGenre && <hr className="border-gray-200 my-6" />}


            {/* Модалка окончательного подтверждения */}
            {showModal && selectedGenre && (
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
                                Ви дійсно впевнені, що хочете безповоротно видалити елемент
                                <span className="font-bold text-red-600 block my-1">
                                    «{targetTitle}»
                                </span>
                                Цю дію неможливо скасувати. Всі пов'язані релізи втратять цей тег/жанр.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                                className="btn-white w-full px-4 py-2 text-sm font-medium border border-hr-clr rounded-md cursor-pointer"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full px-4 py-2 text-sm font-semibold btn-red text-white shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                                {isDeleting ? "Видалення..." : "Так, видалити"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}