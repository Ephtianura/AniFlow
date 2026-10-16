import { Anime } from "@/core/types";

export function formatAnimeDates(anime: Anime): string {
    if (!anime) return "";

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    const format = (date?: string) =>
        date
            ? new Intl.DateTimeFormat("uk-UA", options).format(new Date(date))
            : null;

    const from = format(anime.airedOn);
    const to = format(anime.releasedOn);

    if (from && to) return `з ${from} по ${to}`;
    if (from) return `з ${from}`;
    if (to) return `до ${to}`;

    return "";
}