import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { TitleLanguage } from "@/core/types";
import { TitleType } from "@/core/types";
import { AnimeKindEnum } from "@/core/AnimeKind";
import { AnimeStatusEnum } from "@/core/AnimeStatus";
import { AnimeRatingEnum } from "@/core/AnimeRating";

export function useAnimeForm() {
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
        setErrors({});
        try {
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

            const formData = new FormData();

            if (poster) formData.append("Poster", poster, poster.name);
            if (posterPreview?.startsWith("http")) formData.append("PosterUrl", posterPreview);
            screenshots.forEach(f => f && f.size > 0 && formData.append("Screenshots", f, f.name));
            previews.filter(src => src.startsWith("http")).forEach(url => formData.append("ScreenshotUrls", url));

            if (formData.has("Poster") || formData.has("PosterUrl") || formData.has("Screenshots") || formData.has("ScreenshotUrls")) {
                await apiFetch(`/Animes/${createdAnime.id}/files`, { method: "PATCH", body: formData });
            }

            // Очистка формы
            setTitles([{ value: "", language: TitleLanguage.Romaji, type: TitleType.Official }]);
            setPoster(null); setPosterPreview(null);
            setScreenshots([]); setPreviews([]);
            setSelectedGenres([]); setSelectedStudio(null);
            setAiredOn(""); setReleasedOn("");
            setKind(AnimeKindEnum.Unknown); setStatus(AnimeStatusEnum.Unknown); setRating(AnimeRatingEnum.Unknown);
            setScore(0); setEpisodes(0); setEpisodesAired(0); setDuration(0); setDescription("");

            toast.success("Аніме успішно створено!");
        } catch (err: any) {
            if (err.validationErrors) { setErrors(err.validationErrors); return; }
            toast.error(err.message || "Помилка");
        }
    };

    return {
        errors, titles, setTitles, poster, setPoster, posterPreview, setPosterPreview,
        screenshots, previews, handleFilesChange, removeScreenshot, handleURLChange,
        genres, selectedGenres, setSelectedGenres, studios, selectedStudio, setSelectedStudio,
        airedOn, setAiredOn, releasedOn, setReleasedOn,
        kind, setKind, status, setStatus, rating, setRating,
        score, setScore, episodes, setEpisodes, episodesAired, setEpisodesAired,
        duration, setDuration, description, setDescription,
        handleSubmit
    };
}
