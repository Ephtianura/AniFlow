import Link from "next/link";
import { BiSolidStar } from "react-icons/bi";
import AnimeCardPoster from "./AnimeCardPoster";
import { AnimeKindEnum, AnimeKindMap } from "@/core/enums/AnimeKind";
import { Genre } from "@/core/types";
import AnimeDescription from "@/app/anime/[animeUrl]/_components/AnimeDescription";
import { KindLink } from "./KindLink";
import { YearLink } from "./YearLink";
import { TitleLink } from "./TitleLink";
import { SubTitle } from "./SubTitle";

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
    viewMode: "small" | "grid" | "gridLarge" | "list";
}

export default function AnimeCard(props: AnimeCardProps) {
    const { title, subTitle, rating, kind, year, genres, description, posterUrl, url, viewMode } = props;

    // Small
    if (viewMode === "small") {
        return (
            <div className="flex flex-col gap-2">

                {/* Постер */}
                <div className="relative w-full aspect-5/7">
                    <div className="absolute top-2 left-[-5px] w-16 h-9 bg-[#FFD400] flex items-center rounded-tl-[1px]"
                        style={{ clipPath: "polygon(100% 0, 90% 35%, 100% 75%, 8% 75%, 8% 100%, 0 75%, 0 0)" }}>
                        <div className="flex gap-1 items-center mb-2 px-2">
                            <BiSolidStar className="w-4 h-4" />
                            <p className="font-bold text-sm">{rating.toFixed(1)}</p>
                        </div>
                    </div>
                    <Link href={`/anime/${url}`} className="text-primary text-xl hover:underline">
                        <img src={posterUrl || "/404.gif"} alt={title} className="w-full h-full object-cover rounded" />
                    </Link>
                </div>

                <div className="flex flex-col">
                    {/* Підназва */}
                    <SubTitle subTitle={subTitle} />

                    {/* Назва */}
                    <TitleLink title={title} url={url} className="line-clamp-1" />
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
                    <TitleLink title={title} url={url} className="line-clamp-2" />

                    <div className="text-primary-black text-md flex gap-1">
                        {/* KIND */}
                        {kind && <>
                            <KindLink kind={kind} />
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
                <div className="flex gap-4">
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
                        <TitleLink title={title} url={url} />
                        <SubTitle subTitle={subTitle} />

                        <div className="line-clamp-2">
                            <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1  ">

                                {/* KIND */}
                                {kind && <>
                                    <KindLink kind={kind} />
                                    <span className="text-gray-dark">/</span>
                                </>}

                                {/* YEAR */}
                                {year && <>
                                    <YearLink year={year} />
                                    <span className="hidden sm:inline-flex text-gray-dark">/</span>
                                </>}

                                {/* GENRES */}
                                {genres.map((genre, index) => (
                                    <span key={genre.id} className="hidden sm:inline-flex items-center gap-0">
                                        <Link
                                            href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                            className="underline hover:text-primary"
                                        >
                                            {genre.nameUa}
                                        </Link>
                                        {index < genres.length - 1 && <span className="text-gray-dark">,</span>}
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
        <div className="py-4">
            <div className="flex gap-4">

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
                    <TitleLink title={title} url={url} />

                    {/* Підназва */}
                    <SubTitle subTitle={subTitle} />

                    <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1">

                        {/* KIND */}
                        {kind && <>
                            <KindLink kind={kind} />
                            <span className="text-gray-dark">/</span>
                        </>}

                        {/* YEAR */}
                        {year && <>
                            <YearLink year={year} />
                            <span className="hidden sm:flex text-gray-dark">/</span>
                        </>}

                        {/* GENRES */}
                        {genres.map((genre, index) => (
                            <span key={genre.id} className="hidden sm:flex items-center gap-0 ">
                                <Link
                                    href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                    className="underline hover:text-primary"
                                >
                                    {genre.nameUa}
                                </Link>
                                {index < genres.length - 1 && <span className="text-gray-dark">,</span>}
                            </span>
                        ))}

                    </div>

                    {/* Опис */}
                    <div className="hidden md:block">
                        <AnimeDescription description={description} className="line-clamp-3" />
                    </div>
                </div>

            </div>
        </div>
    );
}
