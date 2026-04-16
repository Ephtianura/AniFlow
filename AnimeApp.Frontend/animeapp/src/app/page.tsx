import AnimeCard from '@/components/AnimeCard';
import WhiteCard from "@/components/WhiteCard";

export default function Home() {
  return (
    <main className="">
      <WhiteCard>
        <div className="flex flex-col gap-3">

          <h3 className="text-[1.75rem] font-medium">
            Новинки на  сайті
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>

            <AnimeCard
              key={1}
              id={1}
              title={"Аніме"}
              subTitle={"Anime"}
              rating={5.0}
              kind={"TV"}
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
    </main>
  );
}
