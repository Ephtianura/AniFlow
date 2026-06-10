import { format } from "date-fns";
import { uk } from "date-fns/locale";

type FormattedDate = {
    text: string;
    full: string;
};

function getUkrWord(n: number, one: string, few: string, many: string) {
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 14) return many;

    const mod10 = n % 10;

    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;

    return many;
}

export function formatLastOnlineDate(dateString: string | null): FormattedDate | null {
    if(!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMin = diffMs / 60000;
    const diffHours = diffMin / 60;
    const diffDays = diffHours / 24;

    const full = format(date, "dd.MM.yyyy HH:mm");

    // щойно
    if (diffMin < 1) {
        return {
            text: "щойно",
            full,
        };
    }

    // хвилини
    if (diffMin < 60) {
        const m = Math.floor(diffMin);
        return {
            text: `${m} ${getUkrWord(m, "хвилина", "хвилини", "хвилин")} тому`,
            full,
        };
    }

    // години
    if (diffHours < 24) {
        const h = Math.floor(diffHours);
        return {
            text: `${h} ${getUkrWord(h, "година", "години", "годин")} тому`,
            full,
        };
    }

    // вчора
    if (diffDays < 2) {
        return {
            text: "вчора",
            full,
        };
    }

    // до 7 днів
    if (diffDays < 7) {
        const d = Math.floor(diffDays);
        return {
            text: `${d} ${getUkrWord(d, "день", "дні", "днів")} тому`,
            full,
        };
    }

    // 14 березня
    return {
        text: format(date, "d MMMM", { locale: uk }),
        full,
    };
}