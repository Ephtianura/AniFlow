import AnimeHomeSeason from '@/components/AnimeHomeSeason';
import WhiteCard from "@/components/WhiteCard";
import { getCurrentSeason, SeasonTextMap } from '@/core/enums/Season';
import { getHomeAnimes } from '@/hooks/getHomeAnimes';
import Link from 'next/link';
import { MdNavigateNext } from 'react-icons/md';
import AnimeHomeUpdates from '@/components/AnimeHomeUpdates';
import AboutAniflow from '@/components/AboutAniflow';
import AnimeHomeNews from '@/components/AnimeHomeNews';

export const metadata = {
  title: "AniFlow – дивитись Аніме онлайн безкоштовно українською",
  description:
    "Дивись аніме онлайн безкоштовно: нові серії, популярні тайтли та зручний каталог. Українська локалізація, швидкий доступ і перегляд у HD"
};

export default async function Home() {
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()

  const [seasonAnimes, updatedAnimes, newAnimes] = await getHomeAnimes({ currentYear, currentSeason });
  return (
    <main className="space-y-4">

      {seasonAnimes && (

        <div className='flex flex-col gap-2'>
          <Link className='flex items-center group'
            href={{
              pathname: "/animes",
              query: {
                year: currentYear,
                season: currentSeason,
              },
            }}
          >
            <h3 className="text-[2rem] font-medium ">
              Аніме {SeasonTextMap[currentSeason]} сезону
            </h3>
            <MdNavigateNext className='w-8 h-8 mt-2 opacity-0 group-hover:opacity-100 transition duration-300' />
          </Link>

          <AnimeHomeSeason seasonAnimes={seasonAnimes} />
        </div>
      )}

      {updatedAnimes && (
        <WhiteCard>
          <h3 className='text-[1.75rem] font-medium mb-3'>Оновлення аніме</h3>
          <AnimeHomeUpdates updatesAnimes={updatedAnimes} />
        </WhiteCard>
      )}

      <AnimeHomeNews newAnimes={newAnimes} />

      <AboutAniflow />
    </main >
  );
}
