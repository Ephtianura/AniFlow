import Link from "next/link";
import AnimeCardPoster from "./AnimeCardPoster";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { Genre } from "@/core/types";
import AnimeDescription from "@/app/anime/[animeUrl]/_components/AnimeDescription";
import { KindLink } from "./KindLink";
import { YearLink } from "./YearLink";
import { TitleLink } from "./TitleLink";
import { SubTitle } from "./SubTitle";

export type ViewMode = "small" | "grid" | "gridLarge" | "list";

interface AnimeCardProps {
    id: number;
    title: string;
    subTitle?: string;
    rating: number;
    kind?: AnimeKindEnum | null;
    year?: number | null;
    genres: Genre[];
    description?: string | null;
    posterUrl?: string;
    url: string;
    viewMode: ViewMode;
}

export default function AnimeCard(props: AnimeCardProps) {
    const { title, subTitle, rating, kind, year, genres, description, posterUrl, url, viewMode } = props;

    const visibleListGenres = genres ? genres.slice(0, 10) : [];
    const visibleGridGenres = genres ? genres.slice(0, 3) : [];

    // Small
    if (viewMode === "small") {
        return (
            <div className="flex flex-col gap-2">

                {/* Постер */}
                <div className="relative w-full aspect-5/7">
                    <AnimeCardPoster
                        title={title}
                        rating={rating}
                        posterUrl={posterUrl}
                        url={url}
                    />
                </div>

                <div className="flex flex-col">
                    {/* Підназва */}
                    <SubTitle subTitle={subTitle} />

                    {/* Назва */}
                    <TitleLink title={title} url={url} className="line-clamp-1! break-all!" />
                </div>

            </div>
        );
    }

    // Grid Cols 1-4 
    if (viewMode === "grid") {
        return (
            <div className="flex flex-col gap-2">

                {/* Постер */}
                <div className="relative w-full aspect-5/7">
                    <AnimeCardPoster
                        title={title}
                        rating={rating}
                        posterUrl={posterUrl}
                        url={url}
                    />
                </div>

                <div className="flex flex-col">
                    {/* Підназва */}
                    <SubTitle subTitle={subTitle} />

                    {/* Назва */}
                    <TitleLink title={title} url={url} className="line-clamp-2!" />

                    <div className="text-primary-black text-md flex gap-1">
                        {/* KIND */}
                        {kind && <>
                            <KindLink kind={kind} />
                        </>}

                        {kind && year && <>
                            <span className="text-gray-dark">/</span>
                        </>}

                        {/* YEAR */}
                        {year && <>
                            <YearLink year={year} />
                        </>}
                    </div>
                </div>

            </div>
        );
    }

    // Grid Cols 1-2 
    if (viewMode === "gridLarge") {
        return (
            <div className="py-4">
                <div className="flex flex-col xs:flex-row gap-4">
                    {/* Постер */}
                    <div className="relative w-[90px] aspect-5/7 shrink-0">
                        <AnimeCardPoster
                            title={title}
                            rating={rating}
                            posterUrl={posterUrl}
                            url={url}
                        />
                    </div>

                    <div className="flex flex-col">
                        <TitleLink title={title} url={url} className="line-clamp-1! xs:line-clamp-2!" />
                        <SubTitle subTitle={subTitle} />

                        <div className="line-clamp-2">
                            <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1  ">

                                {/* KIND */}
                                {kind && <>
                                    <KindLink kind={kind} />
                                </>}

                                {kind && year && <>
                                    <span className="text-gray-dark">/</span>
                                </>}

                                {/* YEAR */}
                                {year && <>
                                    <YearLink year={year} />
                                    <span className="hidden sm:inline-flex text-gray-dark">/</span>
                                </>}

                                {/* GENRES */}
                                {visibleGridGenres.map((genre, index) => (
                                    <span key={genre.id} className="hidden sm:inline-flex items-center gap-0">
                                        <Link
                                            href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                            className="underline hover:text-primary"
                                        >
                                            {genre.nameUa}
                                        </Link>
                                        {index < visibleGridGenres.length - 1 && <span className="text-gray-dark">,</span>}
                                    </span>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW 
    return (
        <div className="py-4 ">
            <div className="flex flex-col xs:flex-row gap-4">

                {/* Постер */}
                <div className="relative w-[clamp(120px,20vw,150px)] aspect-5/7 shrink-0">
                    <AnimeCardPoster
                        title={title}
                        rating={rating}
                        posterUrl={posterUrl}
                        url={url}
                    />
                </div>

                <div className="flex flex-col">
                    {/* Назва */}
                    <TitleLink title={title} url={url} className="line-clamp-1! sm:line-clamp-2!" />

                    {/* Підназва */}
                    <SubTitle subTitle={subTitle} />

                    <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1">

                        {/* KIND */}
                        {kind && <>
                            <KindLink kind={kind} />
                        </>}

                        {kind && year && <>
                            <span className="text-gray-dark">/</span>
                        </>}

                        {/* YEAR */}
                        {year && <>
                            <YearLink year={year} />
                            <span className="hidden sm:inline-flex text-gray-dark">/</span>
                        </>}

                        {/* GENRES */}
                        {visibleListGenres.map((genre, index) => (
                            <span key={genre.id} className="hidden sm:flex items-center gap-0 ">
                                <Link
                                    href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                    className="underline hover:text-primary"
                                >
                                    {genre.nameUa}
                                </Link>
                                {index < visibleListGenres.length - 1 && <span className="text-gray-dark">,</span>}
                            </span>
                        ))}

                    </div>

                    {/* Опис */}
                    <div className="hidden md:block">
                        <AnimeDescription description={description} className="line-clamp-3! max-h-18!" />
                    </div>
                </div>

            </div>
        </div>
    );
}
