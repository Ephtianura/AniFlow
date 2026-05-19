import { RelationKindEnum } from "./enums/RelationKind";

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

export enum TitleLanguage {
  Ukrainian = "Ukrainian",
  English = "English",
  Japanese = "Japanese",
  Romaji = "Romaji"
}

export enum TitleType {
  Official = "Official",
  Synonym = "Synonym"
}

// interfaces 
export interface AnimeTitle {
    id: number;
    animeId: number;
    value: string;
    language: TitleLanguage;
    type: TitleType;
}

export interface Anime {
    id: number;
    malId?: number;
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

export interface UserAnime {
  animeId: number
  myList: string | null;
  rating: number | null;
  isFavorite: boolean | null;
};

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

export interface Pagination<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number
}

export interface ApiErrorResponse {
  title?: string;
  status?: number;
  errors?: Record<string, string[]>; 
}

// Player
export interface PlayerEpisodeSet {
  player: string;
  voices: VoiceEpisodeSet[];
}
export interface VoiceEpisodeSet {
  voice: string;
  episodes: EpisodeInfo[]; 
}
export interface EpisodeInfo {
  episode: number;
  videoUrl: string;
  poster?: string;
  subtitles: boolean;
}

