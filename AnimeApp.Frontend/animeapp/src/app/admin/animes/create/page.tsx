"use client";

import { AdminLayout } from "@/app/admin/AdminLayout";
import { AnimesLayout } from "@/app/admin/animes/_components/AnimesLayout";

import { AnimeTitlesEditor } from "../_components/AnimeTitlesEditor";
import { AnimePosterUploader } from "../_components/AnimePosterUploader";
import { AnimeScreenshotsUploader } from "../_components/AnimeScreenshotsUploader";
import { AnimeGenresSelector } from "../_components/AnimeGenresSelector";
import { AnimeStudioSelector } from "../_components/AnimeStudioSelector";
import { AnimeMainData } from "../_components/AnimeMainData";
import { FormErrors } from "../_components/FormErrors";

import { PrimaryButton } from "../../PrimaryButton";


import { useAnimeForm } from "./useAnimeForm";

export default function CreateAnime() {
    const form = useAnimeForm();

    return (
        <AdminLayout>
            <AnimesLayout>
                <div className="space-y-6 ">

                    {/* Форма */}
                    <div className="flex flex-col gap-6">

                        {/* Назви та постер */}
                        <div className="flex flex-col md:flex-row justify-between gap-6">

                            {/* Назви */}
                            <AnimeTitlesEditor titles={form.titles} setTitles={form.setTitles} />

                            {/* Постер */}
                            <AnimePosterUploader
                                poster={form.poster}
                                setPoster={form.setPoster}
                                posterPreview={form.posterPreview}
                                setPosterPreview={form.setPosterPreview}
                            />
                        </div>

                        <hr className="text-hr-clr" />

                        {/* Скріншоти */}
                        <AnimeScreenshotsUploader
                            previews={form.previews}
                            handleFilesChange={form.handleFilesChange}
                            handleURLChange={form.handleURLChange}
                            removeScreenshot={form.removeScreenshot}
                        />

                        <hr className="text-hr-clr" />

                        {/* Жанри */}
                        <AnimeGenresSelector
                            genres={form.genres}
                            selectedGenres={form.selectedGenres}
                            setSelectedGenres={form.setSelectedGenres}
                        />

                        <hr className="text-hr-clr" />

                        {/* Студія */}
                        <AnimeStudioSelector
                            studios={form.studios}
                            selectedStudio={form.selectedStudio}
                            setSelectedStudio={form.setSelectedStudio}
                        />

                        <hr className="text-hr-clr" />

                        {/* Основні дані */}
                        <AnimeMainData
                            airedOn={form.airedOn}
                            setAiredOn={form.setAiredOn}
                            releasedOn={form.releasedOn}
                            setReleasedOn={form.setReleasedOn}
                            kind={form.kind}
                            setKind={form.setKind}
                            status={form.status}
                            setStatus={form.setStatus}
                            rating={form.rating}
                            setRating={form.setRating}
                            score={form.score}
                            setScore={form.setScore}
                            episodes={form.episodes}
                            setEpisodes={form.setEpisodes}
                            episodesAired={form.episodesAired}
                            setEpisodesAired={form.setEpisodesAired}
                            duration={form.duration}
                            setDuration={form.setDuration}
                            description={form.description}
                            setDescription={form.setDescription}
                        />

                        {/* Submit */}
                        <PrimaryButton onClick={form.handleSubmit}>
                            Створити аніме
                        </PrimaryButton>

                        {/* Виведення помилок */}
                        <FormErrors errors={form.errors} />

                    </div>
                </div>
            </AnimesLayout>
        </AdminLayout>
    );
}
