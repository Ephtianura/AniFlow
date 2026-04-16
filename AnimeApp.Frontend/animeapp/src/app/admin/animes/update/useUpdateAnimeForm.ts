    "use client";
    import { useState, useEffect } from "react";
    import { apiFetch } from "@/lib/api";
    import { toast } from "react-toastify";
    import { TitleLanguage } from "@/core/types";
    import { TitleType } from "@/core/types";
    import { AnimeKindEnum } from "@/core/AnimeKind";
    import { AnimeStatusEnum } from "@/core/AnimeStatus";
    import { AnimeRatingEnum } from "@/core/AnimeRating";
    import { RelationKindEnum } from "@/core/RelationKind";


    interface Genre { id: number; nameUa: string; }
    interface Studio { id: number; name: string; }

    export function useUpdateAnimeForm(initialAnimeId?: number) {
        const [animeId, setAnimeId] = useState<number | null>(initialAnimeId ?? null);
        const [selectedAnime, setSelectedAnime] = useState<any>(null);
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState<Record<string, string[]>>({});

        // Основные поля формы
        const [titles, setTitles] = useState<{ value: string; language: TitleLanguage; type: TitleType }[]>([
            { value: "", language: TitleLanguage.Romaji, type: TitleType.Official }
        ]);
        const [poster, setPoster] = useState<File | null>(null);
        const [posterPreview, setPosterPreview] = useState<string | null>(null);
        const [screenshots, setScreenshots] = useState<File[]>([]);
        const [previews, setPreviews] = useState<string[]>([]);
        const [genres, setGenres] = useState<Genre[]>([]);
        const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
        const [studios, setStudios] = useState<Studio[]>([]);
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

        const [relatedAnimes, setRelatedAnimes] = useState<any[]>([]);

        const formatDate = (dateStr: string | null | undefined) => dateStr ? dateStr.split("T")[0] : "";

        // Загрузка жанров и студий
        useEffect(() => {
            async function fetchMeta() {
                try {
                    const genresData = await apiFetch("/Genres");
                    setGenres(Array.isArray(genresData) ? genresData : genresData.items || []);
                    const studiosData = await apiFetch("/Studios");
                    setStudios(Array.isArray(studiosData) ? studiosData : studiosData.items || []);
                } catch (err) {
                    console.error(err);
                }
            }
            fetchMeta();
        }, []);

        // Загрузка аниме по ID
        useEffect(() => {
            if (animeId === null) return;
            loadAnime(animeId);
        }, [animeId]);

        const loadAnime = async (id: number) => {
            setLoading(true);
            try {
                const anime = await apiFetch(`/Animes/${id}`);
                selectAnimeFromSearch(anime);
            } catch (err) {
                console.error(err);
                setErrors({ general: ["Не удалось загрузить данные аниме."] });
            } finally {
                setLoading(false);
            }
        };

    const selectAnimeFromSearch = (anime: any) => {
            setSelectedAnime(anime);
            setAnimeId(anime.id);

            setTitles(anime.titles?.map((t: any) => ({
                value: t.value || "",
                language: t.language ?? TitleLanguage.Romaji,
                type: t.type ?? TitleType.Official
            })) || [{ value: "", language: TitleLanguage.Romaji, type: TitleType.Official }]);

            setPosterPreview(anime.posterUrl || null);
            setPreviews(anime.screenshotsUrls || []);
            setSelectedGenres(anime.genres?.map((g: any) => g.id) || []);
            setSelectedStudio(anime.studio?.id || null);

            setAiredOn(formatDate(anime.airedOn));
            setReleasedOn(formatDate(anime.releasedOn));

            setKind((AnimeKindEnum as any)[anime.kind] ?? AnimeKindEnum.Unknown);
            setStatus((AnimeStatusEnum as any)[anime.status] ?? AnimeStatusEnum.Unknown);
            setRating((AnimeRatingEnum as any)[anime.rating] ?? AnimeRatingEnum.Unknown);

            setScore(anime.score ?? 0);
            setEpisodes(anime.episodes ?? 0);
            setEpisodesAired(anime.episodesAired ?? 0);
            setDuration(anime.duration ?? 0);
            setDescription(anime.description || "");

           setRelatedAnimes(anime.relateds?.map((r: any) => ({
  relatedAnimeId: r.id,
  relationKind: r.relationKind !== null && RelationKindEnum[r.relationKind as keyof typeof RelationKindEnum] !== undefined
    ? RelationKindEnum[r.relationKind as keyof typeof RelationKindEnum]
    : null,
                animeData: {
                    id: r.id,
                    titles: Array.isArray(r.titles) ? r.titles : [],
                    posterUrl: r.posterUrl || "/404.gif",
                    score: r.score ?? 0,
                    kind: r.kind ?? "Unknown",
                    year: r.year ?? 0,
                    episodes: r.episodes ?? 0,
                    rating: r.rating ?? "Unknown",
                    url: r.url ?? "#",
                }
            })) || []);
        };

        const handleFilesChange = (files: FileList) => {
            const arr = Array.from(files);
            setScreenshots(arr);
            setPreviews(arr.map(f => URL.createObjectURL(f)));
        };

        const handleURLChange = async (url: string, index: number) => {
            setPreviews(prev => {
                const newPrev = [...prev];
                newPrev[index] = url;
                return newPrev;
            });
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                const file = new File([blob], `screenshot-${index}.jpg`, { type: blob.type });
                setScreenshots(prev => {
                    const newFiles = [...prev];
                    newFiles[index] = file;
                    return newFiles;
                });
            } catch {
                console.warn("Не вдалося завантажити файл з URL");
            }
        };

        const removeScreenshot = (index: number) => {
            setScreenshots(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        };

        const handleSubmit = async () => {
            if (!selectedAnime) return;
            setErrors({});
            const body = {
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
                description: description.trim() || "No description",
                relatedsAnimes: relatedAnimes.map(r => ({
                    relatedAnimeId: r.relatedAnimeId,
                    relationKind: r.relationKind
                }))
            };

            try {
                await apiFetch(`/Animes/${animeId}`, {
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" }
                });

                if (poster || screenshots.length > 0 || posterPreview?.startsWith("http")) {
                    const formData = new FormData();
                    if (poster) formData.append("Poster", poster);
                    if (posterPreview?.startsWith("http")) formData.append("PosterUrl", posterPreview);
                    screenshots.forEach(f => f && f.size > 0 && formData.append("Screenshots", f));
                    previews.filter(src => src.startsWith("http")).forEach(url => formData.append("ScreenshotUrls", url));

                    await apiFetch(`/Animes/${animeId}/files`, { method: "PATCH", body: formData });
                }

                toast.success("Аніме оновлено!");
            } catch (err: any) {
                console.error(err);

                if (err.validationErrors) {
                    setErrors(err.validationErrors);
                } else if (err.error) {
                    setErrors({ error: [err.error] });
                }

                toast.error("Помилка під час оновлення аніме!");
            }
        };

        return {
            animeId, setAnimeId, selectedAnime, setSelectedAnime, loading, errors,
            titles, setTitles, poster, setPoster, posterPreview, setPosterPreview,
            screenshots, previews, handleFilesChange, removeScreenshot, handleURLChange,
            genres, selectedGenres, setSelectedGenres, studios, selectedStudio, setSelectedStudio,
            airedOn, setAiredOn, releasedOn, setReleasedOn,
            kind, setKind, status, setStatus, rating, setRating,
            score, setScore, episodes, setEpisodes, episodesAired, setEpisodesAired,
            duration, setDuration, description, setDescription,
            relatedAnimes, setRelatedAnimes,
            handleSubmit, loadAnime, selectAnimeFromSearch
        };
    }
