import Link from "next/link";
import { BiSolidStar } from "react-icons/bi";

interface AnimeCardPosterProps {
    title: string;
    rating: number;
    posterUrl?: string;
    url: string;
}

export default function AnimeCardPoster(props: AnimeCardPosterProps) {
    const { rating, posterUrl, title, url } = props;

    return (
        <div className="relative h-full w-full ">
            <div className="absolute top-2 left-[-5px] w-16 h-9 z-10 bg-[#FFD400]  flex items-center rounded-tl-[1px]"
                style={{ clipPath: "polygon(100% 0, 90% 35%, 100% 75%, 8% 75%, 8% 100%, 0 75%, 0 0)" }}>
                <div className="flex gap-1 items-center mb-2 px-2">
                    <BiSolidStar className="w-4 h-4" />
                    <p className="font-bold text-sm">{rating.toFixed(1)}</p>
                </div>
            </div>
            <Link href={`/anime/${url}`} className="text-primary text-xl hover:underline">
                <img src={posterUrl || "/404.gif"} alt={title} className="w-full h-full object-cover rounded-xs" />
            </Link>
        </div>
    )
}
