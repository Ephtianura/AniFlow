"use client";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WhiteCard from '@/components/WhiteCard';
import ScreenshotsPreview from '@/components/ScreenshotsPreview';
import PosterViewer from '@/components/PosterViewer';
import { BsFillStarFill } from "react-icons/bs";
import { AnimeInfo } from "./_components/AnimeInfo";
import { RelatedAnimeList } from "./_components/RelatedAnimeList";
import ListSelect from "./_components/ListSelect";
import { useAnime } from "./_hooks/useAnime";
import { useAnimeUserData } from "./_hooks/useAnimeUserData";
import { useAnimePageEffects } from "./_hooks/useAnimePageEffects";
import AnimePlayer from "./_components/AnimePlayer";
import WatchButton from "./_components/WatchButton";
import Rating from "./_components/Rating";
import { DropdownButton } from "./_components/ListSelect copy";

export default function AnimePage({
    params,
}: {
    params: Promise<{ animeUrl: string }>;
}) {
    const router = useRouter();
    const { animeUrl } = use(params);

    const id = useMemo(() => {
        return animeUrl.split("-").at(-1) || "";
    }, [animeUrl]);

    const { anime, loading, error } = useAnime(id);

    const { data: userAnimeData } = useAnimeUserData(anime?.id);

    const { title } = useAnimePageEffects({
        animeUrl,
        anime,
        loading,
        error,
        router,
    });


    if (error) return <WhiteCard>Помилка: {error}</WhiteCard>;
    if (!anime) return null;

    return (
        <WhiteCard>
            <div className='flex flex-col'>

                {/* Постер та інформація */}
                <div className='grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:gap-6'>

                    {/* Постер та додаваня у список */}
                    <div className='flex flex-col gap-4 order-3 sm:order-1'>

                        {/* Постер */}
                        <PosterViewer posterUrl={anime.posterUrl || "/404.gif"} />

                        {/* Кнопка та список */}
                        <WhiteCard>
                            <div className="flex flex-col gap-2">
                                <WatchButton />
                                <ListSelect
                                    animeId={anime.id}
                                    initialStatus={userAnimeData?.myList}
                                />
                            </div>
                        </WhiteCard>
                    </div>

                    <div className="sm:hidden order-5 mt-6">
                        <AnimeInfo anime={anime} />
                    </div>
                    
                    {/* Інформація */}
                    <div className='flex flex-col order-1 sm:order-2'>

                        {/* Рейтинг */}
                        <div className="order-1">
                            <Rating
                                animeId={anime.id}
                                score={anime.score}
                                totalScores={anime.totalScores}
                                userRating={userAnimeData?.rating ?? undefined}
                            />
                        </div>

                        {/* Назви */}
                        <div className='flex flex-col order-2'>
                            <p className='text-primary-black text-[40px] font-medium py-1'>
                                {anime.titles.find(t => t.language === "Ukrainian" && t.type === "Official")?.value
                                    || anime.titles.find(t => t.language === "Ukrainian")?.value}
                            </p>
                            <p className='text-primary-black text-sm'>
                                {anime.titles.find(t => t.language === "Romaji" && t.type === "Official")?.value
                                    || anime.titles.find(t => t.language === "Romaji")?.value}
                            </p>
                            <p className='text-primary-black text-sm'>
                                {anime.titles.find(t => t.language === "English" && t.type === "Official")?.value
                                    || anime.titles.find(t => t.language === "English")?.value}
                            </p>
                            <p className='text-primary-black text-sm'>
                                {anime.titles.find(t => t.language === "Japanese" && t.type === "Official")?.value
                                    || anime.titles.find(t => t.language === "Japanese")?.value}
                            </p>
                        </div>

                        <hr className='text-hr-clr my-4 order-4 sm:order-3' />

                        {/* Anime-info */}
                        <div className="hidden sm:block order-5 sm:order-4">
                            <AnimeInfo anime={anime} />
                        </div>
                    </div>
                </div>

                {/* Опис */}
                <div className='py-4'>
                    {anime.description.split('\n').map((param, index) => (
                        <p key={index} className='text-primary-black text-justify mb-2'>
                            {param}
                        </p>
                    ))}
                </div>

                {/* Кадри */}
                <div className='mt-3 w-full'>
                    <ScreenshotsPreview images={anime.screenshotsUrls} />
                </div>

                {/* Пов'язане */}
                <RelatedAnimeList relateds={anime.relateds || []} />

                {/* Плеєр */}
                <div id="anime-player">
                    <AnimePlayer title={title} rating={anime.rating} />
                </div>

            </div>
        </WhiteCard>
    )
}