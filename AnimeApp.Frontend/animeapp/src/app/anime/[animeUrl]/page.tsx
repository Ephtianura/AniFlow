import WhiteCard from '@/components/WhiteCard';
import ScreenshotsPreview from '@/components/ScreenshotsPreview';
import PosterViewer from '@/components/PosterViewer';
import { AnimeInfo } from "./_components/AnimeInfo";
import { RelatedAnimeList } from "./_components/RelatedAnimeList";
import ListSelect from "./_components/ListSelect";
import AnimePlayer from "./_components/Player/AnimePlayer";
import WatchButton from "./_components/WatchButton";
import AnimeTitles from "./_components/AnimeTitles";
import { UserAnimeHydrator } from '@/stores/userAnimeHydrator';
import pullUkrTitle from './_functions/pullUkrTitle';
import { getUserStatus } from './_functions/getUserStatus';
import { getAnime } from './_functions/getAnime';
import { AnimeIdProvider } from './_components/animeIdProvider';
import AnimeDescription from './_components/AnimeDescription';
import { getPlayers } from './_functions/getPlayers';
import Rating from './_components/Rating';
import OstsPreview from './_components/OstsPreview';
import Nsfw from './_components/Nsfw';
import ExternalLinks from './_components/ExternalLinks';

export async function generateMetadata({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = await params;
    const anime = await getAnime(animeUrl);
    const title = pullUkrTitle(anime.titles);
    return {
        title: `${title} | AniFlow`,
        description: `${anime?.description?.slice(0, 80)} Дивитись всі серіі онлайн українською на AniFlow`
            || `Дивитися аніме ${title} українською мовою на AniFlow`,
    };
}

export default async function AnimePage({ params, }: { params: { animeUrl: string }; }) {
    const { animeUrl } = await params;

    const anime = await getAnime(animeUrl)

    const userStatusPromise = getUserStatus(anime.id)
    const playersPromise = getPlayers(anime.malId)

    const [userStatus, players] = await Promise.all([
        userStatusPromise,
        playersPromise,
    ]);

    return (
        <WhiteCard>
            <AnimeIdProvider animeId={anime.id} userAnime={userStatus}>
                {/* Помістити дані користувача у сховище */}
                <UserAnimeHydrator data={userStatus} />

                {/* Nsfw */}
                <Nsfw isNsfw={anime.nsfw} />

                <div className='flex flex-col'>

                    {/* Постер та інформація */}
                    <div className='grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:gap-6'>

                        {/* Постер та додаваня у список */}
                        <div className='flex flex-col gap-4 order-3 sm:order-1'>

                            {/* Постер */}
                            {/* Та додати до обраного */}
                            <PosterViewer posterUrl={anime.posterUrl || "/NotFound.jpg"} />

                            {/* Кнопка та список */}
                            <WhiteCard>
                                <div className="flex flex-col gap-2">
                                    <WatchButton />
                                    <ListSelect />
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
                                    score={anime.score}
                                    totalScores={anime.totalScores}
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

                    {/* Лінки */}
                    <div className='pt-4 hidden xs:flex'>
                        <ExternalLinks externalLinks={anime.externalLinks} />
                    </div>

                    {/* Опис */}
                    <div className='pt-2'>
                        <AnimeDescription description={anime.description} />
                    </div>

                    {/* Кадри */}
                    <div className='w-full'>
                        <ScreenshotsPreview images={anime.screenshotsUrls} />
                    </div>

                    {/* Ости */}
                    <OstsPreview anime={anime} />

                    {/* Пов'язане */}
                    <RelatedAnimeList relateds={anime.relateds || []} />

                    {/* Плеєр */}
                    <div id="anime-player">
                        <AnimePlayer titles={anime.titles} rating={anime.rating} players={players} />
                    </div>

                </div>
            </AnimeIdProvider>
        </WhiteCard>
    )
}