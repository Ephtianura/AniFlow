"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { Studio } from "@/core/types";
import { IoWarningOutline } from "react-icons/io5";
import { StudioSearch } from "@/app/admin/_components/StudioSearch"; // Укажи свой правильный путь к компоненту

export default function DeleteStudio() {
    const [studioId, setStudioId] = useState<number | null>(null);
    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const targetTitle = selectedStudio?.name || "";

    const expectedConfirmationPhrase = `Я впевнений, що хочу видалити студію ${targetTitle}`;

    const isConfirmationValid = confirmationInput.trim() === expectedConfirmationPhrase;

    // Сбрасываем поле подтверждения при смене выбранной студии
    useEffect(() => {
        setConfirmationInput("");
    }, [studioId]);

    const handleSelectStudio = async (studio: Studio) => {
        setStudioId(studio.id);

        try {
            const data = await apiFetch<Studio>(`/Studios/${studio.id}`);
            setSelectedStudio(data);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося завантажити дані студії");
        }
    };

    const handleDelete = async () => {
        if (!studioId) return;
        setIsDeleting(true);

        try {
            await apiFetch(`/Studios/${studioId}`, { method: "DELETE" });
            toast.success("Студія успішно видалена!");
            setSelectedStudio(null);
            setStudioId(null);
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Не вдалося видалити студію");
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <div>
                <StudioSearch
                    placeholder="Почніть вводити назву студії для видалення..."
                    onSelect={handleSelectStudio}
                />
            </div>

            {selectedStudio && <hr className="border-gray-200 my-6" />}

            {selectedStudio && (
                <div className="bg-white border border-hr-clr rounded p-4 transition animate-fadeIn">
                    <h1 className="font-semibold text-lg mb-4">
                        Ви обрали студію для видалення:
                    </h1>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src={selectedStudio.posterUrl || "/NotFound.jpg"}
                            alt="poster"
                            className="w-full h-auto max-h-60  max-w-75 object-contain rounded-lg shadow-inner shadow-2xl-inner shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                <div>
                                    <span className="font-bold text-2xl text-purple-600">
                                        {targetTitle}
                                    </span>
                                </div>

                                {selectedStudio.description && (
                                    <p className="text-gray-600 text-sm line-clamp-4 pt-2 leading-relaxed">
                                        {selectedStudio.description}
                                    </p>
                                )}
                            </div>

                            <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 flex flex-col gap-3">
                                <p className="text-xs text-red-700 font-medium">
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
                                            ? "btn-red text-white"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        }`}
                                >
                                    Видалити студію з бази
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && selectedStudio && (
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
                                Ви дійсно впевнені, що хочете безповоротно видалити студію
                                <span className="font-semibold text-gray-800 block my-1">
                                    «{targetTitle}»
                                </span>
                                Цю дію неможливо буде скасувати, а всі пов'язані з нею аніме втратять посилання на цю студію.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                                className="btn-white w-full px-4 py-2 text-sm font-medium border border-hr-clr rounded-md"
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