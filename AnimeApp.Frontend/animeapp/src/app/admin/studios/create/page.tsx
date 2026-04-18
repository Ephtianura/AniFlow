"use client";

import { AdminLayout } from "@/app/admin/AdminLayout";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import { StudiosLayout } from "@/app/admin/studios/StudiosLayout";

export default function CreateStudio() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [poster, setPoster] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Загрузка превью постера
    const handlePosterChange = (files: FileList) => {
        if (files[0]) {
            setPoster(files[0]);
            setPosterPreview(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async () => {
        setErrors({});
        try {
            // 1️⃣ Создаем студию
            const payload = {
                name: name.trim(),
                description: description.trim() || "No description",
            };

            const createdStudio = await apiFetch("/Studios", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            // 2️⃣ Загружаем постер если есть
            if (poster && createdStudio.id) {
                const formData = new FormData();
                formData.append("Poster", poster);
                await apiFetch(`/Studios/${createdStudio.id}/UploadFiles`, {
                    method: "PATCH",
                    body: formData,
                });
            }

            // Очистка формы
            setName("");
            setDescription("");
            setPoster(null);
            setPosterPreview(null);
            toast.success("Студія успішно створена!");
        } catch (err: any) {
            if (err.validationErrors) {
                setErrors(err.validationErrors);
                return;
            }
            toast.error(err.message || "Помилка при створенні студії");
        }
    };

    return (
        <AdminLayout>
            <StudiosLayout>
                <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Створити студію</h2>

                    <div className="flex flex-col gap-4">
                        {/* Назва */}
                        <div>
                            <label className="font-medium">Назва</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="btn-primary"
                                placeholder="Назва студії"
                            />
                        </div>

                        {/* Описание */}
                        <div>
                            <label className="font-medium">Опис</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                className="btn-primary"
                                placeholder="Опис студії"
                            />
                        </div>

                        {/* Постер */}
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
                                        alt="preview"
                                        className=" object-cover rounded"
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
                                                            transition-colors duration-200 cursor-pointer
                                                            hover:border-btn-border-dark hover:bg-red-200
                                                            active:border-btn-border-dark
                                                            active:bg-red-300
                                                            active:shadow-[0_0_5px_rgba(0,0,0,0.1)] pr-4"
                                    >
                                        <IoClose className="w-5 h-5 mt-[2px]" />
                                        <p>Прибрати</p>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="border-2 border-primary text-primary px-6 py-2 rounded font-bold cursor-pointer
                                hover:bg-purple-600 hover:text-white hover:border-purple-700
                                active:bg-purple-700 active:border-purple-800
                                transition-colors duration-200"
                            >
                                Створити студію
                            </button>
                        </div>

                        {/* Виведення помилок */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-4 p-4 border-2 border-red-400 bg-red-100 rounded">
                                <h3 className="text-red-600 font-bold mb-2">Помилки валідації:</h3>
                                <ul className="list-disc list-inside text-red-600">
                                    {Object.entries(errors).map(([field, msgs]) =>
                                        msgs.map((msg, i) => (
                                            <li key={`${field}-error-${i}`}>{field}: {msg}</li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </StudiosLayout>
        </AdminLayout>
    );
}
