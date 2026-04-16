"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AnimeKindEnum } from "@/core/AnimeKind";
import { AnimeRatingEnum } from "@/core/AnimeRating";
import { AnimeStatusEnum } from "@/core/AnimeStatus";
import { TitleLanguage } from "@/core/types";
import { TitleType } from "@/core/types";
import { IoClose } from "react-icons/io5";
import { TbFileUpload } from "react-icons/tb";
import { RiFolderUploadLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { AnimesLayout } from "@/app/admin/animes/_components/AnimesLayout";
import { AnimeTitlesEditor } from "../_components/AnimeTitlesEditor";

export default function CreateAnime() {
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [titles, setTitles] = useState<{ value: string; language: TitleLanguage; type: TitleType }[]>([
        { value: "", language: TitleLanguage.Romaji, type: TitleType.Official }
    ]);
    const [poster, setPoster] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [screenshots, setScreenshots] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [genres, setGenres] = useState<{ id: number; nameUa: string }[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [studios, setStudios] = useState<{ id: number; name: string }[]>([]);
    const [selectedStudio, setSelectedStudio] = useState<number | null>(null);
    const [airedOn, setAiredOn] = useState("");
    const [releasedOn, setReleasedOn] = useState("");
    const [kind, setKind] = useState<AnimeKindEnum>(AnimeKindEnum.Unknown);
    const [status, setStatus] = useState<AnimeStatusEnum>(AnimeStatusEnum.Unknown);
    const [rating, setRating] = useState<AnimeRatingEnum>(AnimeRatingEnum.Unknown);
    const [score, setScore] = useState(0);
    const [episodes, setEpisodes] = useState(0);
    const [episodesAired, setEpisodesAired] = useState(0);
    const [duration, setDuration] = useState(0);
    const [description, setDescription] = useState("");

    const handleFilesChange = (files: FileList) => {
        const newFiles = Array.from(files);
        setScreenshots((prev) => [...prev, ...newFiles]);
        setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    };

    const removeScreenshot = (index: number) => {
        const newScreenshots = [...screenshots];
        const newPreviews = [...previews];
        newScreenshots.splice(index, 1);
        newPreviews.splice(index, 1);
        setScreenshots(newScreenshots);
        setPreviews(newPreviews);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const genresData = await apiFetch("/Genres");
                setGenres(genresData);

                const studiosData = await apiFetch("/Studios");
                setStudios(studiosData.items || []);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    const handleURLChange = async (url: string, index: number) => {
        setPreviews((prev) => {
            const newPreviews = [...prev];
            newPreviews[index] = url;
            return newPreviews;
        });
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const file = new File([blob], `screenshot-${index}.jpg`, { type: blob.type });
            setScreenshots((prev) => {
                const newFiles = [...prev];
                newFiles[index] = file;
                return newFiles;
            });
        } catch {
            console.warn("Не удалось загрузить файл с URL");
        }
    };
    const handleSubmit = async () => {
        setErrors({}); // сброс ошибок
        try {
            // 1️⃣ Создаем аниме через JSON
            const payload = {
                titles,
                studiosId: selectedStudio,
                genresId: selectedGenres,
                airedOn: airedOn || null,
                releasedOn: releasedOn || null,
                kind,
                status,
                rating,
                score,
                episodes,
                episodesAired,
                duration,
                description: description.trim() || "No description"
            };

            const createdAnime = await apiFetch("/Animes", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });

            if (!createdAnime.id) throw new Error("Не удалось создать аніме");

            // 2️⃣ Если есть файлы или URL — загружаем через UploadFiles
            const formData = new FormData();

            // Постер локальный
            if (poster) {
                formData.append("Poster", poster, poster.name);
            }
            // Постер URL
            if (posterPreview && posterPreview.startsWith("http")) {
                formData.append("PosterUrl", posterPreview);
            }

            // Скриншоты локальные
            screenshots.forEach((file) => {
                if (file && file.size > 0) formData.append("Screenshots", file, file.name);
            });

            // Скриншоты через URL
            previews
                .filter(src => typeof src === "string" && src.startsWith("http"))
                .forEach(url => formData.append("ScreenshotUrls", url));

            // Отправка
            if (formData.has("Poster") || formData.has("PosterUrl") || formData.has("Screenshots") || formData.has("ScreenshotUrls")) {
                await apiFetch(`/Animes/${createdAnime.id}/UploadFiles`, {
                    method: "PATCH",
                    body: formData,
                });
            }

            // Очистка формы
            setTitles([{ value: "", language: TitleLanguage.Romaji, type: TitleType.Official }]);
            setPoster(null);
            setPosterPreview(null);
            setScreenshots([]);
            setPreviews([]);
            setSelectedGenres([]);
            setSelectedStudio(null);
            setAiredOn("");
            setReleasedOn("");
            setKind(AnimeKindEnum.Unknown);
            setStatus(AnimeStatusEnum.Unknown);
            setRating(AnimeRatingEnum.Unknown);
            setScore(0);
            setEpisodes(0);
            setEpisodesAired(0);
            setDuration(0);
            setDescription("");

            toast.success("Аніме успішно створено!");

        } catch (err: any) {
            if (err.validationErrors) {
                setErrors(err.validationErrors);
                return;
            }
            toast.error(err.message || "Помилка");
        }
    };






    return (
        <AdminLayout>
            <AnimesLayout>

                <div className="space-y-6 ">


                    {/* Форма */}
                    <div className="flex flex-col gap-6">

                        {/* Назви та картинки */}
                        <div className="flex justify-between gap-6">

                            {/* Назви */}
                            <div>
                                <h2 className="font-medium text-xl mb-2">Додати назви</h2>
                                <div className=" max-h-110 overflow-y-auto pr-2">

                                    {titles.map((t, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2 items-center ">
                                            <input
                                                type="text"
                                                placeholder="Назва аніме"
                                                className="flex items-center justify-between
                                                    px-3 py-[6px] bg-white text-gray-text-dark 
                                                    shadow-sm rounded-xs border border-btn-border-light 
                                                    transition-colors duration-200
                                                    hover:border-btn-border-dark 
                                                    focus:outline-none focus:border-btn-border-dark 
                                                    focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                                                value={t.value}
                                                onChange={(e) => {
                                                    const newTitles = [...titles];
                                                    newTitles[idx].value = e.target.value;
                                                    setTitles(newTitles);
                                                }}
                                            />

                                            {/* Вибір мови */}
                                            <select
                                                value={t.language}
                                                onChange={(e) => {
                                                    const newTitles = [...titles];
                                                    // безопасное приведение через unknown
                                                    newTitles[idx].language = e.target.value as unknown as TitleLanguage;
                                                    setTitles(newTitles);
                                                }}
                                                className="flex items-center justify-between
                                                    px-3 py-[6px] bg-white text-gray-text-dark 
                                                    shadow-sm rounded-xs border border-btn-border-light 
                                                    transition-colors duration-200
                                                    hover:border-btn-border-dark 
                                                    focus:outline-none focus:border-btn-border-dark 
                                                    focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                                            >
                                                {Object.keys(TitleLanguage)
                                                    .filter(k => isNaN(Number(k))) // только имена
                                                    .map(lang => (
                                                        <option key={lang} value={lang}>
                                                            {lang}
                                                        </option>
                                                    ))}
                                            </select>

                                            {/* Вибір типу */}
                                            <select
                                                value={t.type}
                                                onChange={(e) => {
                                                    const newTitles = [...titles];
                                                    newTitles[idx].type = e.target.value as unknown as TitleType;
                                                    setTitles(newTitles);
                                                }}
                                                className="flex items-center justify-between
                                                    px-3 py-[6px] bg-white text-gray-text-dark 
                                                    shadow-sm rounded-xs border border-btn-border-light 
                                                    transition-colors duration-200
                                                    hover:border-btn-border-dark 
                                                    focus:outline-none focus:border-btn-border-dark 
                                                    focus:shadow-[0_0_5px_rgba(0,0,0,0.1)]"
                                            >
                                                {Object.keys(TitleType)
                                                    .filter(k => isNaN(Number(k)))
                                                    .map(type => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                            </select>

                                            {/* Прибрати назву */}
                                            <button
                                                className="cursor-pointer
                                            text-red-400 border-2 border:red-400
                                            hover:text-white hover:bg-red-400 
                                            rounded-sm transition-colors duration-100"
                                                onClick={() => setTitles(titles.filter((_, i) => i !== idx))}
                                            >
                                                <IoClose className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Додати назву */}
                                <button
                                    className="border-2 border-green-400 text-green-400 px-3 py-1 mt-2 rounded-sm cursor-pointer font-medium
                                    hover:border-green-600 hover:bg-green-500 hover:text-white
                                    transition-colors duration-100"
                                    onClick={() =>
                                        setTitles([...titles, { value: "", language: TitleLanguage.Romaji, type: TitleType.Official }])
                                    }
                                >
                                    Додати назву
                                </button>
                            </div>

                            {/* Постер та скріни */}
                            <div className="flex flex-col items-center">
                                <h2 className="font-medium text-xl mb-2">Постер</h2>

                                <div className="flex flex-col gap-4 items-center">
                                    {/* Предпросмотр постера */}
                                    {posterPreview && (
                                        <div className="flex flex-col gap-1 items-center">
                                            <p className="text-primary-black font-medium">Вибрано постер:</p>

                                            <img
                                                src={posterPreview}
                                                alt="preview"
                                                className="w-[250px] h-[350px] rounded object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Кнопки загрузки / видалення */}
                                    <div className="flex flex-col items-center">

                                        {/* Захований input */}
                                        <input
                                            id="posterInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    const file = e.target.files[0];
                                                    setPoster(file);
                                                    setPosterPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />

                                        {/* Кнопка загрузки */}
                                        <label
                                            htmlFor="posterInput"
                                            className="px-3 py-1 bg-white text-gray-text-dark 
                                                        shadow-sm rounded-xs border border-btn-border-light
                                                        transition-colors duration-200 cursor-pointer
                                                        hover:border-btn-border-dark active:border-btn-border-dark
                                                        active:shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-2"
                                        >
                                            <div className="flex items-center gap-1">
                                                <TbFileUpload className="w-5 h-5" />
                                                <p>Завантажити постер</p>
                                            </div>
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Або вставте URL "
                                            className="btn-primary w-full mb-2"
                                            onChange={async (e) => {
                                                const url = e.target.value;
                                                setPosterPreview(url);

                                                try {
                                                    const res = await fetch(url);
                                                    const blob = await res.blob();
                                                    const file = new File([blob], "poster.jpg", { type: blob.type });
                                                    setPoster(file);
                                                } catch {
                                                    console.warn("Невдалось завантажити файл з URL");
                                                }
                                            }}
                                        />

                                        {/* Кнопка "Прибрати */}
                                        {poster && (
                                            <button
                                                onClick={() => {
                                                    setPoster(null);
                                                    setPosterPreview(null);

                                                    const input = document.getElementById("posterInput") as HTMLInputElement;
                                                    if (input) input.value = "";
                                                }}
                                                className=" w-30 h-7 flex items-center gap-1 px-3 py-1 bg-white text-gray-text-dark
                                                            shadow-sm rounded-xs border border-btn-border-light
                                                            transition-colors duration-200 cursor-pointer
                                                            hover:border-btn-border-dark hover:bg-red-200
                                                            active:border-btn-border-dark
                                                            active:bg-red-300
                                                            active:shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-2"
                                            >
                                                <IoClose className="w-5 h-5 mt-[2px]" />
                                                <p>Прибрати</p>
                                            </button>
                                        )}

                                        {/* Текст имени файла */}
                                        <span className="ml-3 text-gray-400 text-xs text-center">
                                            {poster ? poster.name : "Постер не вибрано"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <hr className="text-hr-clr" />


                        {/* Скріншоти */}
                        <div className="flex flex-col gap-4">
                            <h2 className="font-medium text-xl">Скріншоти</h2>

                            {/* Кнопка загрузки файлов */}
                            <div>
                                <input
                                    id="screenshotsInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleFilesChange(e.target.files)}
                                />
                                <label
                                    htmlFor="screenshotsInput"
                                    className="px-3 py-1 bg-white text-gray-text-dark shadow-sm rounded-xs border border-btn-border-light cursor-pointer flex items-center gap-1 hover:border-btn-border-dark"
                                >
                                    <RiFolderUploadLine className="w-5 h-5" />
                                    <p>Завантажити скріншоти</p>
                                </label>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {/* Динамические инпуты для URL */}

                                {previews.map((src, i) => (
                                    <div key={i} className="relative w-[150px] h-[100px] rounded overflow-hidden">
                                        <img src={src} className="w-full h-full object-cover rounded" alt={`screenshot-${i}`} />
                                        <button
                                            onClick={() => removeScreenshot(i)}
                                            className="absolute top-1 right-1 bg-red-400 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors duration-100 cursor-pointer"
                                        >
                                            <IoClose className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Новый пустой input для вставки ссылки */}
                            <div className="flex flex-wrap gap-2 items-center mt-2">
                                {Array(previews.length + 1)
                                    .fill(0)
                                    .map((_, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            placeholder="Вставте URL скріншоту"
                                            className="btn-primary max-w-50"
                                            value={previews[i] || ""}
                                            onChange={(e) => handleURLChange(e.target.value, i)}
                                        />
                                    ))}
                            </div>
                        </div>


                        <hr className="text-hr-clr" />

                        {/* Жанри */}
                        <div>
                            <h2 className="font-medium text-xl mb-2 flex items-center justify-between">
                                Жанри
                                {selectedGenres.length > 0 && (
                                    <button
                                        onClick={() => setSelectedGenres([])}
                                        className="text-sm text-primary hover:underline cursor-pointer font-normal"
                                    >
                                        Скинути вибір
                                    </button>
                                )}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(g => (
                                    <button
                                        key={g.id}
                                        onClick={() =>
                                            selectedGenres.includes(g.id)
                                                ? setSelectedGenres(selectedGenres.filter(id => id !== g.id))
                                                : setSelectedGenres([...selectedGenres, g.id])
                                        }
                                        className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-300 transition-colors duration-100
                    ${selectedGenres.includes(g.id) ? "bg-primary text-white hover:bg-purple-600 active:bg-purple-700" : "bg-gray-200 "}`}
                                    >
                                        {g.nameUa}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="text-hr-clr" />

                        {/* Студія */}
                        <div>
                            <h2 className="font-bold mb-2">Студія</h2>
                            <select className="btn-primary" value={selectedStudio || ""} onChange={e => setSelectedStudio(Number(e.target.value))}>
                                <option value="">Оберіть студію</option>
                                {studios.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <hr className="text-hr-clr" />
                        {/* Основные данные */}
                        <div className="col-span-2 grid grid-cols-3 gap-4">
                            <div>
                                <label>Дата виходу</label>
                                <input type="date" value={airedOn} onChange={e => setAiredOn(e.target.value)}
                                    className="btn-primary" />
                            </div>
                            <div>
                                <label>Дата реліза</label>
                                <input type="date" value={releasedOn} onChange={e => setReleasedOn(e.target.value)}
                                    className="btn-primary" />
                            </div>
                            <div>
                                <label>Тип</label>
                                <select value={kind} onChange={e => setKind(Number(e.target.value))}
                                    className="btn-primary" >
                                    {Object.keys(AnimeKindEnum).filter(k => isNaN(Number(k))).map(k => (
                                        <option key={k} value={AnimeKindEnum[k as keyof typeof AnimeKindEnum]}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Статус</label>
                                <select value={status} onChange={e => setStatus(Number(e.target.value))} className="btn-primary">
                                    {Object.keys(AnimeStatusEnum).filter(k => isNaN(Number(k))).map(k => (
                                        <option key={k} value={AnimeStatusEnum[k as keyof typeof AnimeStatusEnum]}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Rating</label>
                                <select value={rating} onChange={e => setRating(Number(e.target.value))} className="btn-primary">
                                    {Object.keys(AnimeRatingEnum).filter(k => isNaN(Number(k))).map(k => (
                                        <option key={k} value={AnimeRatingEnum[k as keyof typeof AnimeRatingEnum]}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Оцінка</label>
                                <input type="number" value={score} onChange={e => setScore(Number(e.target.value))} className="btn-primary" />
                            </div>
                            <div>
                                <label>Епізоди</label>
                                <input type="number" value={episodes} onChange={e => setEpisodes(Number(e.target.value))} className="btn-primary" />
                            </div>
                            <div>
                                <label>Епізодів вийшло</label>
                                <input type="number" value={episodesAired} onChange={e => setEpisodesAired(Number(e.target.value))} className="btn-primary" />
                            </div>
                            <div>
                                <label>Тривалість</label>
                                <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="btn-primary" />
                            </div>
                            <div className="col-span-3">
                                <label>Опис</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="btn-primary max-h-100 overflow-y-auto" rows={4} />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="col-span-2 mt-4">
                            <button onClick={handleSubmit} className="border-2 border-primary text-primary px-6 py-2 rounded font-bold cursor-pointer
                            hover:bg-purple-600 hover:text-white hover:border-purple-700
                            active:bg-purple-700 active:border-purple-800
                            transition-colors duration-200 w-full">

                                Створити аніме
                            </button>
                        </div>
                        <div>

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
                </div>

            </AnimesLayout>
        </AdminLayout>
    );
}
