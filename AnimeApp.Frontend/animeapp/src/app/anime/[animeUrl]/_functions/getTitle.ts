import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle";
import { AnimeTitle } from "@/core/types";

export function getTitle(
  titles: AnimeTitle[],
  lang: TitleLanguage,
  type: TitleType,
) {
  const title =
    titles.find((t) => t.language === lang && t.type === type)?.value || "";

  return title;
}
