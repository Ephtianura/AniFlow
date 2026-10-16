'use client';

import AnimeCard, { ViewMode } from '@/components/AnimeCard';
import { Animes, PagedResult } from '@/core/types';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildApiQuery } from '../_functions/buildApiQuery';
import { parseSearchParams } from '../_functions/parseSearchParams';
import { getAnimes } from '../_functions/getAnimes';

type Props = {
    pagedAnimes: PagedResult<Animes>
    viewMode: ViewMode;
    apiQuery: string;
    hasNext: boolean
}

export default function AnimesCards({ pagedAnimes, viewMode, hasNext: initHasNext, apiQuery: initApiQuery }: Props) {
    const params = parseSearchParams(useSearchParams());

    const [page, setPage] = useState<number>(pagedAnimes.page);
    const [animes, setAnimes] = useState<Animes[]>(pagedAnimes.items);
    const [hasNextPage, sethasNextPage] = useState<boolean>(initHasNext ?? false);
    const { ref, inView } = useInView();

    const fetchNewAnimes = async () => {

        const apiQuery1 = buildApiQuery(params, page + 1, 20);

        const res = await getAnimes(apiQuery1);

        if (res && res.items.length > 0) {
            setAnimes(prev => [...prev, ...res.items]);
            setPage(prev => prev + 1);
            sethasNextPage(res.hasNext)
        }

    }

    useEffect(() => {
        if (!inView) return;
        if (!hasNextPage) return;

        fetchNewAnimes();
    }, [inView, animes.length, hasNextPage]);

    useEffect(() => {
        setAnimes(pagedAnimes.items);
        setPage(pagedAnimes.page);
        sethasNextPage(initHasNext ?? false);
    }, [initApiQuery]);

    return (
        <div className={clsx(
            viewMode === "grid" && "grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            viewMode === "gridLarge" && "grid md:grid-cols-2",
            viewMode === "list" && "flex flex-col"
        )}>

            {animes.map((anime) => (
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
                    viewMode={viewMode}
                />
            ))}
            <div ref={ref} />
        </div>
    );
}