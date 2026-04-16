import Link from "next/link";
import { AnimeKindEnum, AnimeKindMap } from "@/core/AnimeKind";
import { RelationKindEnum, RelationKindMap } from "@/core/RelationKind";
import { RelatedAnime } from "@/core/types";

interface Props {
    relateds: RelatedAnime[];
}

function episodesText(count: number | undefined) {
    if (!count) return "";
    if (count % 10 === 1 && count % 100 !== 11) return `${count} епізод`;
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} епізоди`;
    return `${count} епізодів`;
}

export const RelatedAnimeList: React.FC<Props> = ({ relateds }) => {
    if (!relateds || relateds.length === 0) return null;

    const getAnimeKindLabel = (kind?: string | AnimeKindEnum | null) => {
        if (!kind) return "";
        const enumValue =
            typeof kind === "number"
                ? kind
                : (AnimeKindEnum[kind as keyof typeof AnimeKindEnum] ?? AnimeKindEnum.Unknown);
        return AnimeKindMap[AnimeKindEnum[enumValue] as keyof typeof AnimeKindMap] ?? "";
    };

    return (
        <div className="my-3">
            <h4 className="text-primary-black text-2xl font-medium">Пов'язане</h4>
            <hr className="text-[#CCCCCC] my-4" />

            <div className="flex gap-4 overflow-x-auto">
                {relateds.map(rel => {
                    const title =
                        rel.titles.find(t => t.language === "Ukrainian" && t.type === "Official")?.value ||
                        rel.titles.find(t => t.language === "Romaji" && t.type === "Official")?.value ||
                        rel.titles.find(t => t.language === "Romaji")?.value ||
                        "Без назви";

                    const airedYear = rel.airedOn ? new Date(rel.airedOn).getFullYear() : rel.year;

                    return (
                        <div key={rel.id} className="flex flex-col gap-1 max-w-[300px]">
                            <Link href={`/anime/${rel.url}`} className="text-primary-black truncate underline hover:text-primary">
                                {title}
                            </Link>
                            <div className="flex gap-2 cursor-pointer min-w-[200px] items-center">
                                <Link href={`/anime/${rel.url}`} className="text-primary-black underline hover:text-primary">
                                    <img
                                        src={rel.posterUrl || "/404.gif"}
                                        alt={title}
                                        className="w-[52px] h-[73px] object-cover rounded-xs"
                                    />
                                </Link>

                                <div className="flex flex-col justify-center gap-1 text-[#7F7F7F] text-[13px]">
                                    <p>
                                        {getAnimeKindLabel(rel.kind)}
                                        {airedYear ? ` / ${airedYear}` : ""}
                                    </p>

                                    <p>{episodesText(rel.episodes)}</p>

                                    <p>{RelationKindMap[RelationKindEnum[rel.relationKind]]?.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};