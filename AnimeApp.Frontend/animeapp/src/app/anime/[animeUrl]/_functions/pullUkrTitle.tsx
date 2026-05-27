import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { AnimeTitle } from "@/core/types";

export default function PullUkrTitle(titles: AnimeTitle[]) {
    const title =
        titles.find(t => t.language === TitleLanguage.Ukrainian && t.type === TitleType.Official)?.value
        || titles.find(t => t.language === TitleLanguage.Romaji && t.type === TitleType.Official)?.value
        || titles.find(t => t.language === TitleLanguage.Romaji)?.value;
    return title
}
