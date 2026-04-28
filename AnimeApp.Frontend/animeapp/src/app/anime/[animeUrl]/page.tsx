import WhiteCard from '@/components/WhiteCard';
import ScreenshotsPreview from '@/components/ScreenshotsPreview';
import PosterViewer from '@/components/PosterViewer';
import { AnimeInfo } from "./_components/AnimeInfo";
import { RelatedAnimeList } from "./_components/RelatedAnimeList";
import ListSelect from "./_components/ListSelect";
import AnimePlayer from "./_components/AnimePlayer";
import WatchButton from "./_components/WatchButton";
import Rating from "./_components/Rating";
import { getAnimePageData } from "./_functions/getAnimePageData";
import AnimeTitles from "./_components/AnimeTitles";
import { TitleLanguage, TitleType } from "@/core/types";
import { UserAnimeHydrator } from '@/app/store/userAnimeHydrator';
import pullUkrTitle from './_functions/pullUkrTitle';

// Сделать название вкладки
export async function generateMetadata({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = await params;
    const { anime } = await getAnimePageData(animeUrl); // Запрос кешируется
    const title = pullUkrTitle(anime.titles);
    return {
        title: `${title} | AniFlow`,
        description: anime?.description?.slice(0, 160) || `Дивитися аніме ${title} українською мовою на AniFlow`,
    };
}

export default async function AnimePage({ params, }: { params: { animeUrl: string }; }) {
    console.log("params:", params);
    const { animeUrl } = await params;
    const { anime, userStatus } = await getAnimePageData(animeUrl)

    return (
        <WhiteCard>
            {/* Засунути дані користувача у сховище */}
            <UserAnimeHydrator data={userStatus} />
            <div className='flex flex-col'>

                {/* Постер та інформація */}
                <div className='grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:gap-6'>

                    {/* Постер та додаваня у список */}
                    <div className='flex flex-col gap-4 order-3 sm:order-1'>

                        {/* Постер */}
                        {/* Та додати до обраного */}
                        <PosterViewer posterUrl={anime.posterUrl || "/404.gif"} /> 

                        {/* Кнопка та список */}
                        <WhiteCard>
                            <div className="flex flex-col gap-2">
                                <WatchButton /> 
                                <ListSelect/>
                            </div>
                        </WhiteCard>
                    </div>

                    <div className="sm:hidden order-5 mt-6">
                        <AnimeInfo anime={anime} />
                    </div>

                    {/* Інформація */}
                    <div className='flex flex-col order-1 sm:order-2'>

                        {/* Рейтинг */}
                        {/* Та додати до обраного */}
                        <div className="order-1"> 
                            <Rating 
                                animeId={anime.id}
                                score={anime.score}
                                totalScores={anime.totalScores}
                                userRating={userStatus?.rating ?? undefined}
                                isFavorite={userStatus?.isFavorite ?? null}  //TODO
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
                    <AnimePlayer titles={anime.titles} rating={anime.rating} />
                </div>

            </div>
        </WhiteCard>
    )
}