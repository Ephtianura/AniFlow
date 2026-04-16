import Link from "next/link";
import { BiSolidStar } from "react-icons/bi";
import { AnimeKindMap } from "@/core/AnimeKind";
import AnimeCardPoster from "./AnimeCardPoster";

interface Genre {
    id: number;
    nameEn: string;
    nameUa: string;
}
interface AnimeCardProps {
    id: number;
    title: string;
    subTitle?: string;
    rating: number;
    kind: string;
    year: number;
    genres: Genre[];
    description: string;
    posterUrl?: string;
    url: string;

    viewMode: "small" | "grid" | "gridLarge" | "list";
}

export default function AnimeCard(props: AnimeCardProps) {
    const { viewMode } = props;

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
                            <p className="font-bold text-sm">{props.rating.toFixed(1)}</p>
                        </div>
                    </div>
                    <Link href={`/anime/${props.url}`} className="text-primary text-xl hover:underline">
                        <img src={props.posterUrl || "/404.gif"} alt={props.title} className="w-full h-full object-cover rounded" />
                    </Link>
                </div>

                <div className="flex flex-col">
                    {/* Підназва */}
                    {props.subTitle && (
                        <p className="text-gray-dark text-xs line-clamp-1">{props.subTitle}</p>
                    )}
                    {/* Назва */}
                    <Link href={`/anime/${props.url}`} className="text-primary text-xl hover:underline line-clamp-1">
                        {props.title}
                    </Link>
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
                        title={props.title}
                        rating={props.rating}
                        posterUrl={props.posterUrl}
                        url={props.url}
                    />
                </div>

                <div className="flex flex-col">

                    {/* Підназва */}
                    {props.subTitle && (
                        <p className="text-gray-dark text-xs line-clamp-1">{props.subTitle}</p>
                    )}
                    {/* Назва */}
                    <Link href={`/anime/${props.url}`} className="text-primary text-xl hover:underline line-clamp-2">
                        {props.title}
                    </Link>
                    <div className="text-primary-black text-md flex gap-1">
                        {/* KIND */}
                        <Link
                            href={{ pathname: "/animes", query: { kind: props.kind } }}
                            className="underline hover:text-primary"
                        >
                            {AnimeKindMap[props.kind]}
                        </Link>

                        <span className="text-gray-dark">/</span>

                        {/* YEAR */}
                        <Link
                            href={{ pathname: "/animes", query: { year: props.year } }}
                            className="underline hover:text-primary"
                        >
                            {props.year}
                        </Link>
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
                            title={props.title}
                            rating={props.rating}
                            posterUrl={props.posterUrl}
                            url={props.url}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Link href={`/anime/${props.url}`} className="text-primary text-xl hover:underline line-clamp-3">
                            {props.title}
                        </Link>
                        {props.subTitle && (
                            <p className="text-gray-dark text-xs line-clamp-1">{props.subTitle}</p>
                        )}
                        <div className="line-clamp-2">
                            <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1  ">

                                {/* KIND */}
                                <Link
                                    href={{ pathname: "/animes", query: { kind: props.kind } }}
                                    className="underline hover:text-primary"
                                >
                                    {AnimeKindMap[props.kind]}
                                </Link>

                                <span className="text-gray-dark">/</span>

                                {/* YEAR */}
                                <Link
                                    href={{ pathname: "/animes", query: { year: props.year } }}
                                    className="underline hover:text-primary"
                                >
                                    {props.year}
                                </Link>

                                <span className="hidden sm:inline-flex text-gray-dark">/</span>

                                {/* GENRES */}
                                {props.genres.map((genre, index) => (
                                    <span key={genre.id} className="hidden sm:inline-flex items-center gap-0">
                                        <Link
                                            href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                            className="underline hover:text-primary"
                                        >
                                            {genre.nameUa}
                                        </Link>
                                        {index < props.genres.length - 1 && <span className="text-gray-dark">,</span>}
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
                        title={props.title}
                        rating={props.rating}
                        posterUrl={props.posterUrl}
                        url={props.url}
                    />
                </div>

                {/* Назва */}
                <div className="flex flex-col">
                    <Link
                        href={`/anime/${props.url}`}
                        className="text-primary text-xl hover:underline"
                    >
                        {props.title}
                    </Link>

                    {/* Підназва */}
                    {props.subTitle && (
                        <p className="text-gray-dark text-xs">{props.subTitle}</p>
                    )}

                    <div className="text-primary-black text-md py-2 flex flex-wrap items-center gap-1">

                        {/* KIND */}
                        <Link
                            href={{ pathname: "/animes", query: { kind: props.kind } }}
                            className="underline hover:text-primary"
                        >
                            {AnimeKindMap[props.kind]}
                        </Link>

                        <span className="text-gray-dark">/</span>

                        {/* YEAR */}
                        <Link
                            href={{ pathname: "/animes", query: { year: props.year } }}
                            className="underline hover:text-primary"
                        >
                            {props.year}
                        </Link>

                        <span className="text-gray-dark">/</span>

                        {/* GENRES */}
                        {props.genres.map((genre, index) => (
                            <span key={genre.id} className="flex items-center gap-0">
                                <Link
                                    href={{ pathname: "/animes", query: { GenresId: genre.id } }}
                                    className="underline hover:text-primary"
                                >
                                    {genre.nameUa}
                                </Link>
                                {index < props.genres.length - 1 && <span className="text-gray-dark">,</span>}
                            </span>
                        ))}

                    </div>

                    {/* Опис */}
                    <div className="hidden md:block">
                        <p className="text-primary-black text-md line-clamp-3">
                            {props.description || ""}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
