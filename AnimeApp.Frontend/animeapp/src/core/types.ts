import { RelationKindEnum } from "./enums/RelationKind";

// enums
export enum TitleType {
    Official = 1,
    Alternative = 2,
    Synonym = 3,
    Short = 4,
    FanTranslation = 5
}
export enum TitleLanguage {
    Romaji = 0,
    English = 1,
    Japanese = 2,
    Ukrainian = 3,
}

export enum SeasonEnum {
  Unknown = 0,
  Winter = 1,
  Spring = 2,
  Summer = 3,
  Fall = 4,
}
// Переводы
export const SeasonMap: Record<string, string> = {
  Unknown: "Невідомо",
  Winter: "Зима",
  Spring: "Весна",
  Summer: "Літо",
  Fall: "Осінь",
};


// interfaces 
export interface AnimeTitle {
    id: number;
    animeId: number;
    value: string;
    language: string;
    type: string;
}

export interface RelatedAnime {
    id: number;
    relationKind: keyof typeof RelationKindEnum;
    titles: AnimeTitle[];
    url: string;
    posterUrl: string | null;
    airedOn?: string;
    releasedOn?: string;
    score?: number;
    episodes?: number;
    season?: string;
    year?: number;
    rating?: string;
    kind?: string;
    status?: string;
    description?: string;
    genres: { id: number; nameUa: string }[];
}

export interface Anime {
    id: number;
    titles: AnimeTitle[];
    airedOn: string;
    releasedOn: string;
    score: number;
    totalScores: number;
    episodes: number;
    episodesAired: number;
    duration: number;
    season: string;
    year: number;
    rating: string;
    kind: string;
    status: string;
    description: string;
    posterUrl: string | null;
    screenshotsUrls: string[];
    url: string;
    studio: {
        id: number;
        name: string;
    };
    genres: { id: number; nameUa: string }[];
    relateds?: RelatedAnime[];
}

export interface Animes {
    id: number;
    titles: { value: string; language: string; type: string }[];
    score: number;
    episodes: number;
    kind: string;
    year: number;
    genres: { id: number, nameUa: string, nameEn: string }[];
    description: string;
    posterUrl?: string | null;
    url: string;
}

export interface ApiErrorResponse {
  title?: string;
  status?: number;
  errors?: Record<string, string[]>; 
}