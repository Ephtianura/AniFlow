import WhiteCard from '@/components/WhiteCard';
import SortSelect from '@/app/animes/_components/SortSelect';
import { AnimeKindEnum } from '@/core/enums/AnimeKind';
import { AnimeStatusEnum } from '@/core/enums/AnimeStatus';
import { AnimeRatingEnum } from '@/core/enums/AnimeRating';
import { SeasonEnum } from '@/core/enums/Season';
import SortDescButton from './_components/SortDescButton';
import ViewModeButton, { ViewMode } from './_components/ViewModeButton';
import { getAnimes } from './_functions/getAnimes';
import { buildApiQuery } from './_functions/buildApiQuery';
import { AnimeSortBy } from '@/core/enums/AnimeSortBy';
import AnimesCards from './_components/AnimesCards';
import AnimeFilter from './_components/AnimeFilter';

export type SearchParams = {
    search?: string

    //slug
    genres?: string
    //slug
    studio?: string

    kind?: AnimeKindEnum
    status?: AnimeStatusEnum
    rating?: AnimeRatingEnum
    season?: SeasonEnum
    year?: string

    airedFrom?: string
    airedTo?: string

    releasedFrom?: string
    releasedTo?: string

    minScore?: string
    maxScore?: string

    minEpisodes?: string
    maxEpisodes?: string

    sortBy?: AnimeSortBy
    sortDesc?: string

    page?: string

    view: ViewMode
}

type SearchParamsProps = {
    searchParams: Promise<SearchParams>
}

export default async function AnimeListPage({ searchParams }: SearchParamsProps) {
    const resolvedParams = await searchParams

    const viewMode = resolvedParams.view || "list";

    const apiQuery = buildApiQuery(resolvedParams, 1, 20);

    const res = await getAnimes(apiQuery);

    if (!res || !res.items.length)
        return (
            <>
                <WhiteCard>
                    <div>
                        <h1 className='text-primary-black text-4xl font-medium pb-4'>
                            Список аніме
                        </h1>
                        <div className='p-4 bg-purple-200 border-2 border-purple-300 rounded-lg text-primary-black'>
                            Нічого не знайдено ¯\_(ツ)_/¯
                        </div>
                    </div>
                </WhiteCard>

                <AnimeFilter />
            </>
        )

    const hasNext = res.hasNext;

    // const parsedPage = Number(resolvedParams.page);
    // const animes = res.items;
    // const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    return (
        <>
            <WhiteCard>
                <div >
                    <h1 className='text-primary-black text-4xl font-medium pb-4'>
                        Список аніме
                    </h1>

                    {/* Панель управління */}
                    <div className='py-4 mb-4 border-hr-clr border-y select-none'>
                        <div className='flex flex-col gap-2 items-center sm:flex-row sm:justify-between '>

                            {/* --- Сортування --- */}
                            <div className='flex items-center gap-2'>
                                <p className=' text-gray-text-dark text-sm'>
                                    Сортувати по:
                                </p>

                                {/* По якому критерію сортувати */}
                                <SortSelect initSortBy={resolvedParams.sortBy} />

                                {/* За зростанням або спаданням */}
                                <SortDescButton />
                            </div>

                            {/* --- Режим --- */}
                            <ViewModeButton view={viewMode} />

                        </div>
                    </div>

                    {/* --- Карточки --- */}
                    <AnimesCards pagedAnimes={res} viewMode={viewMode} apiQuery={apiQuery} hasNext={hasNext} />
                </div>
            </WhiteCard>

            <AnimeFilter />
        </>
    );
}
