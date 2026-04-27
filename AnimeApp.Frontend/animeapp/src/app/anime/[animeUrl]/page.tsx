import WhiteCard from '@/components/WhiteCard';
import ScreenshotsPreview from '@/components/ScreenshotsPreview';
import PosterViewer from '@/components/PosterViewer';
import { AnimeInfo } from "./_components/AnimeInfo";
import { RelatedAnimeList } from "./_components/RelatedAnimeList";
import ListSelect from "./_components/ListSelect";
import AnimePlayer from "./_components/AnimePlayer";
import WatchButton from "./_components/WatchButton";
import Rating from "./_components/Rating";
import { getAnimePageData } from "./_hooks/getAnimePageData";
import AnimeTitles from "./_components/AnimeTitles";
import { Anime, TitleLanguage, TitleType } from "@/core/types";
import { UserAnimeHydrator } from '@/app/store/userAnimeHydrator';

export default async function AnimePage({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = params;
    const { anime, userAnimeData } = await getAnimePageData(animeUrl)

    // Потом куда то вынесу
    const title = "Аніме"
    // anime.titles.find(t => t.language === TitleLanguage.Ukrainian && t.type === TitleType.Official)?.value 
    // || anime?.titles.find(t => t.language === TitleLanguage.Romaji && t.type === TitleType.Official)?.value 
    // || anime?.titles.find(t => t.language === TitleLanguage.Romaji)?.value; 

    return (
        <WhiteCard>
            <UserAnimeHydrator data={userAnimeData} />
            <div className='flex flex-col'>

                {/* Постер та інформація */}
                <div className='grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:gap-6'>

                    {/* Постер та додаваня у список */}
                    <div className='flex flex-col gap-4 order-3 sm:order-1'>

                        {/* Постер */}
                        <PosterViewer
                            posterUrl={anime.posterUrl || "/404.gif"}
                            isFavorite={userAnimeData?.isFavorite ?? null} />

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
                                isFavorite={userAnimeData?.isFavorite ?? null}
                            />
                        </div>

                        {/* Назви */}
                        <div className='order-2'>
                            <AnimeTitles titles={anime.titles} />
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
                    <AnimePlayer title={"title"} rating={anime.rating} />
                </div>

            </div>
        </WhiteCard>
    )
}