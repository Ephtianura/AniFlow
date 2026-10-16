"use client";

import { toast } from "react-toastify";
import { Anime, Genre, Studio } from "@/core/types";
import { FormProvider } from "react-hook-form";
import { useAnimeForm } from "../../_components/useAnimeForm";
import { AnimeTitlesEditor } from "../../_components/AnimeTitlesEditor";
import { AnimePosterUploader } from "../../_components/AnimePosterUploader";
import { AnimeGenresSelector } from "../../_components/AnimeGenresSelector";
import { AnimeStudioSelector } from "../../_components/AnimeStudioSelector";
import { AnimeMainData } from "../../_components/AnimeMainData";
import { AnimeScreenshotsUploader } from "./AnimeScreenshotsUploader";
import { AdminAnimeSearch } from "../AdminAnimeSearch";
import Link from "next/link";
import { RelatedAnimeSelector } from "./RelatedAnimeSelector";
import { FaPlay } from "react-icons/fa";

type Props = {
    anime: Anime
    genres: Genre[]
    studio: Studio | null;
}

export default function UpdateAnimeForms({ anime, genres, studio }: Props) {
    if (!genres) toast.warning("Не вдалося завантажити жанри")

    const methods = useAnimeForm(anime);

    return (
        <FormProvider {...methods}>
            <AdminAnimeSearch hrefTemplate="/admin/anime/update/:slug" />

            <div className="flex flex-col gap-6 mt-6">
                <hr className="text-hr-clr" />
                {/* Назви та постер */}
                <div className="flex flex-col items-center md:items-start md:flex-row justify-between gap-6">

                    {/* Назви */}
                    <div className="order-2 md:order-1 w-full md:w-auto">
                        <AnimeTitlesEditor animeId={anime.id} initialTitles={anime.titles} />
                    </div>

                    {/* Постер */}
                    <div className="order-1 md:order-2">
                        <AnimePosterUploader animeId={anime.id} initialUrl={anime.posterUrl} />
                    </div>
                </div>

                <hr className="text-hr-clr" />

                <AnimeScreenshotsUploader animeId={anime.id} initialScreenshots={anime.screenshotsUrls} />

                <hr className="text-hr-clr" />

                {/* Жанри */}
                <AnimeGenresSelector
                    genres={genres}
                    animeId={anime.id}
                    initialGenreIds={anime.genres.map(g => g.id)}
                />

                <hr className="text-hr-clr" />

                {/* Студія */}
                <div className="w-full">
                    <AnimeStudioSelector animeId={anime.id} initialStudio={studio ?? anime.studio} />
                </div>

                <hr className="text-hr-clr" />

                {/* Основні дані */}
                <AnimeMainData animeId={anime.id} initialData={anime} />

                <hr className="text-hr-clr" />

                {/* RelatedAnime */}
                <RelatedAnimeSelector animeId={anime.id} initialRelateds={anime.relateds} />

                {/* <hr className="text-hr-clr" /> */}
                {/* Player */}
                {/* <button className="btn-purple w-full font-medium py-2 flex items-center justify-center gap-2">
                    <FaPlay />Редагувати Ости
                </button> */}
            </div>

            <Link
                href={`/anime/${anime.url}`}
                target="_blank"
                className="fixed top-20 left-4 xl:left-auto xl:right-4 btn-purple font-medium z-10">
                Переглянути аніме
            </Link>

        </FormProvider>
    );
}
