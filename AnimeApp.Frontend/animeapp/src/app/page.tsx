import AnimeCard from '@/components/AnimeCard';
import AnimeHomeSeason from '@/components/AnimeHomeSeason';
import WhiteCard from "@/components/WhiteCard";
import { AnimeSortBy } from '@/core/enums/AnimeSortBy';
import { getCurrentSeason, SeasonTextMap } from '@/core/enums/Season';
import { getHomeAnimes } from '@/hooks/getHomeAnimes';
import Link from 'next/link';
import { MdNavigateNext } from 'react-icons/md';
import AnimeHomeUpdates from '@/components/AnimeHomeUpdates';
import AboutAniflow from '@/components/AboutAniflow';

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


      <WhiteCard>
        <h3 className='text-[1.75rem] font-medium mb-3'>Оновлення аніме</h3>
       <AnimeHomeUpdates updatesAnimes={updatedAnimes}/>
      </WhiteCard>

      <WhiteCard>
        <div className="flex flex-col gap-3">

          <Link className='flex items-center group'
            href={{
              pathname: "/animes",
              query: {
                sortBy: AnimeSortBy.CreatedAt,
              },
            }}
          >
            <h3 className="text-[1.75rem] font-medium">
              Новинки на сайті
            </h3>
            <MdNavigateNext className='w-8 h-8 mt-2 opacity-0 group-hover:opacity-100 transition duration-300' />
          </Link>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-7'>

            {newAnimes.items.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.titles.find(t => t.language === "Ukrainian")?.value || anime.titles[0].value}
                subTitle={anime.titles.find(t => t.language === "Romaji")?.value}
                rating={anime.score}
                kind={anime.kind}
                year={anime.year}
                genres={anime.genres}
                description={anime.description}
                posterUrl={anime.posterUrl || undefined}
                url={anime.url}
                viewMode={"grid"}
              />
            ))}
          </div>
        </div>
      </WhiteCard>
      
      <AboutAniflow/>
    </main >
  );
}
