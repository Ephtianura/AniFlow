import { Animes, PagedResult } from "@/core/types";
import Link from "next/link";
import WhiteCard from "./WhiteCard";
import AnimeCard from "./AnimeCard";
import { MdNavigateNext } from "react-icons/md";
import { AnimeSortBy } from "@/core/enums/AnimeSortBy";

type Props = {
    newAnimes: PagedResult<Animes> | null;
}

export default function AnimeHomeNews({ newAnimes }: Props) {
    if (newAnimes == null || newAnimes.items.length == 0) return null;
    return (
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
    )
}
