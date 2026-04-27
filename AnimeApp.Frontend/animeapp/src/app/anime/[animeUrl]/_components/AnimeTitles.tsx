import { AnimeTitle, TitleLanguage, TitleType } from "@/core/types";

type Props = {
    titles: AnimeTitle[]
}

export default function AnimeTitles({ titles }: Props) {

    const getTitle = (lang: TitleLanguage, typ: TitleType) =>
        titles.find(t => t.language === lang && t.type === typ)?.value
        || titles.find(t => t.language === lang)?.value

    return (
        <div className="flex flex-col">
            <p className="text-primary-black text-[clamp(1.5rem,1.375rem+1.5vw,2.5rem)] font-medium py-1">
                {getTitle(TitleLanguage.Ukrainian, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(TitleLanguage.Romaji, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(TitleLanguage.English, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(TitleLanguage.Japanese, TitleType.Official)}
            </p>
        </div>
    )
}
