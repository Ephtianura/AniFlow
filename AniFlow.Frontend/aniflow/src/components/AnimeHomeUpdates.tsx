import { getTitle } from "@/app/anime/[animeUrl]/_functions/getTitle";
import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { Animes, PagedResult } from "@/core/types";
import Link from "next/link";
import { format, isToday, isYesterday } from 'date-fns'
import { uk } from 'date-fns/locale'

type Props = {
    updatesAnimes: PagedResult<Animes> | null;
}

export default function AnimeHomeUpdates({ updatesAnimes }: Props) {
    if (updatesAnimes == null|| updatesAnimes.items.length == 0) return null;
    return (
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-215 overflow-auto'>
            {updatesAnimes.items.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.url}`} className='border border-hr-clr bg-[#F5F5F5] rounded-lg p-1.5 flex gap-2'>
                    <img src={anime.posterUrl || "/NotFoundPurple.webp"} alt="" className='aspect-5/7 object-cover shrink-0 w-12.5 rounded-lg' />
                    <div className='flex flex-col gap '>
                        <p className="line-clamp-2">
                            {getTitle(anime.titles, TitleLanguage.Ukrainian, TitleType.Official) ||
                                getTitle(anime.titles, TitleLanguage.Romaji, TitleType.Official)}
                        </p>
                        <p className="line-clamp-1 text-[#4D4E4E]">
                            {anime.episodesAired && (
                                <span>{anime.episodesAired}/</span>
                            )}
                            {anime.episodes ? (
                                <span>{anime.episodes}</span>
                            ) : (
                                <span>{anime.episodesAired && (
                                    <span>?</span>
                                )}</span>
                            )}
                            {anime.episodesAired && (
                                <span> Серія · </span>
                            )}
                            {formatAnimeDate(anime.updatedAt)}
                        </p>
                    </div>
                </Link>
            ))}

        </div>
    )
}

export function formatAnimeDate(dateStr?: string | null) {
    if (!dateStr) return ''

    const date = new Date(dateStr)

    const time = format(date, 'HH:mm')

    if (isToday(date)) {
        return `Сьогодні, ${time}`
    }

    if (isYesterday(date)) {
        return `Вчора, ${time}`
    }

    return format(date, 'dd.MM.yy, HH:mm', { locale: uk })
}
