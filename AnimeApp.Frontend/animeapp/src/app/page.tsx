import AnimeCard from '@/components/AnimeCard';
import WhiteCard from "@/components/WhiteCard";
import { AnimeKindEnum } from '@/core/enums/AnimeKind';
import { getCurrentSeason, SeasonTextMap } from '@/core/enums/Season';
import Link from 'next/link';

export const metadata = {
  title: "AniFlow – дивитись Аніме онлайн безкоштовно українською",
  description:
    "Дивись аніме онлайн безкоштовно: нові серії, популярні тайтли та зручний каталог. Українська локалізація, швидкий доступ і перегляд у HD"
};

export default function Home() {
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()

  return (
    <main className="space-y-4">

      <div className='flex flex-col gap-2'>

        <Link href={{
          pathname: "/anime",
          query: {
            Year: currentYear,
            Season: currentSeason,
          },
        }}
        >
          <h3 className="text-[2rem] font-medium ">
            Аніме {SeasonTextMap[currentSeason]} сезону
          </h3>
        </Link>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 '>
          <AnimeCard
            key={1}
            id={1}
            title={"Аніме"}
            subTitle={"Anime"}
            rating={5.0}
            kind={AnimeKindEnum.TV}
            year={2023}
            genres={[]}
            description={"Опис аніме"}
            posterUrl={undefined}
            url={"Anime"}
            viewMode={"small"}
          />
        </div>

      </div>


      <WhiteCard>
        <h3 className='text-[1.75rem] font-medium'>Оновлення аніме</h3>
        <div className='grid grid-cols-2'>
          <div>
            1
          </div>
          <div>
            1
          </div>
        </div>
      </WhiteCard>

      <WhiteCard>
        <div className="flex flex-col gap-3">

          <Link href={{
            pathname: "/anime",
            query: {
              Year: currentYear,
              Season: currentSeason,
            },
          }}
          >
            <h3 className="text-[1.75rem] font-medium">
              Новинки на сайті
            </h3>
          </Link>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>

            <AnimeCard
              key={1}
              id={1}
              title={"Аніме"}
              subTitle={"Anime"}
              rating={5.0}
              kind={AnimeKindEnum.TV}
              year={2023}
              genres={[]}
              description={"Опис аніме"}
              posterUrl={undefined}
              url={"Anime"}
              viewMode={"grid"}
            />
          </div>
        </div>

      </WhiteCard>
    </main >
  );
}
