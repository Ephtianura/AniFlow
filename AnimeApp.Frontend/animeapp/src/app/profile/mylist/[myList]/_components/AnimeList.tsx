import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { KindLink } from "@/components/KindLink";
import { SubTitle } from "@/components/SubTitle";
import { TitleLink } from "@/components/TitleLink";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { UserAnimeList } from "@/core/types";
import clsx from "clsx";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

type Props = {
    userAnimeList?: UserAnimeList | null;
}


export default function AnimeList({ userAnimeList: animeList }: Props) {
    if (!animeList || animeList.animes.length <= 0)
        return (
            <p className="text-[#525353]">
                Список пустий
            </p>
        );

    return (

        <div className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-6.5">

                {animeList.animes.map((anime, index) => (
                    <div key={anime.id} className="flex gap-3 items-start">
                        <div className="flex gap-3 items-center">

                            <span className="text-2xl font-semibold text-[#A7ACB1] w-9 text-right shrink-0 select-none">
                                {index + 1}.
                            </span>

                            <Link className="w-25 aspect-5/7" href={`/anime/${anime.url}`}>
                                <img src={anime.posterUrl ?? "/NotFound.jpg"} alt="123" className="w-full h-full aspect-5/7 shrink-0 object-cover rounded-lg" />

                            </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <TitleLink
                                title={getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official)}
                                url={anime.url}
                                className="line-clamp-1!"
                            />
                            <SubTitle subTitle={getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official)} />

                            {anime.kind && <KindLink kind={anime.kind} />}

                            {anime.myRating && (
                                <p className="text-[#8B8C8C] text-sm -mt-1">
                                    Моя оцінка
                                    <span className="text-primary text-xl"> {anime.myRating}</span>
                                </p>
                            )}

                            {anime.isFavorite && (
                                <Link href={"/profile/mylist/Favorites"} className="text-primary hover:underline text-sm flex items-center gap-2">
                                    <span>Улюблене</span>
                                    <FaHeart />
                                </Link>
                            )}
                        </div>
                    </div>


                ))}
            </div>


        </div >
    );
}