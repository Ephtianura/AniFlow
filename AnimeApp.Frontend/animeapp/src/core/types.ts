import { AnimeKindEnum } from "./enums/AnimeKind";
import { AnimeRatingEnum } from "./enums/AnimeRating";
import { AnimeSource } from "./enums/AnimeSource";
import { AnimeStatusEnum } from "./enums/AnimeStatus";
import { TitleLanguage, TitleType } from "./enums/AnimeTitle";
import { MyListEnum } from "./enums/MyList";
import { OstType } from "./enums/OstType";
import { RelationKindEnum } from "./enums/RelationKind";
import { SeasonEnum } from "./enums/Season";
import { TagType } from "./enums/TagType";
import { UserRole } from "./enums/UserRole";
import { VideoKind } from "./enums/VideoKind";

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
  url: string;
  titles: AnimeTitle[];
  airedOn: string;
  releasedOn: string;
  score: number;
  totalScores: number;
  episodes: number;
  episodesAired: number;
  duration: number;
  season: SeasonEnum;
  year: number | null;
  nsfw: boolean;
  rating: AnimeRatingEnum | null;
  kind: AnimeKindEnum | null;
  status: AnimeStatusEnum | null;
  source?: AnimeSource | null;
  description: string | null;
  posterUrl: string | null;
  screenshotsUrls: string[];
  createdAt: string;
  updatedAt: string;
  music: AnimeOstResponse[];
  promos: AnimeVideoResponse[];
  externalLinks: ExternalLink[];
  studio: Studio;
  genres: Genre[];
  relateds?: RelatedAnime[];
}
export interface ExternalLink {
  url: string;
  text: string;
  type?: string | null;
}
export interface AnimeVideoResponse {
  id: number;
  url: string;
  kind: VideoKind;
  index: number;
}
export interface AnimeOstResponse {
  id: number;
  title: string;
  description?: string | null;
  author?: string | null;
  type: OstType;
  spotifyUrl?: string | null;
  index: number;
  videos: AnimeVideoResponse[];
}

export interface AnimeCreateReponse {
  id: number;
  titles: AnimeTitle[];
  url: string;
}

export interface AnimeCreateReponse {
  id: number;
  titles: AnimeTitle[];
  url: string;
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
  genres: Genre[];
}

export interface UserAnime {
  animeId: number;
  myList: string | null;
  rating: number | null;
  isFavorite: boolean | null;
}

export interface Animes {
  id: number;
  titles: AnimeTitle[];
  url: string;
  posterUrl?: string | null;
  airedOn?: string | null;
  releasedOn?: string | null;
  score: number;
  episodes?: number | null;
  season?: SeasonEnum | null;
  year?: number | null;
  rating?: AnimeRatingEnum | null;
  kind?: AnimeKindEnum | null;
  status?: AnimeStatusEnum | null;
  description?: string | null;
  genres: Genre[];
  studio?: Studio | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious : boolean;
}

export interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  traceId?: string;
  errors?: Record<string, string[]>;
  message?: string;
  error?: string;
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

export interface Genre {
  id: number;
  nameEn: string;
  slug: string;
  nameUa?: string;
  nameRu?: string;
  type: TagType;
}
export interface Studio {
  id: number;
  malId?: number;
  slug: string;
  name: string;
  description: string;
  posterUrl?: string;
}

export interface UserProfile {
  id: number;
  nickname: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  email: string;
  dateOfRegistration: string;

  favorites: number;
  watching: number;
  completed: number;
  planned: number;
  dropped: number;
  rewatching: number;
  totalAnime: number;
  totalEpisodes: number;
  averageScore: number;
  timeSpent: string;
}
export interface UserMeResponse {
  id: number,
  nickname: string,
  avatarUrl: string | null,
  role: UserRole,
}

export interface UserAnimeList {
  favorites: number;
  watching: number;
  completed: number;
  planned: number;
  dropped: number;
  rewatching: number;
  on_hold: number;
  totalAnime: number;
  animes: AnimeInListResponse[];
}
export interface AnimeInListResponse {
  id: number;
  url: string;
  titles: AnimeTitle[];
  score: number;
  isFavorite: boolean;
  myRating?: number | null;
  myList?: MyListEnum | null;
  totalScores: number;
  episodes?: number | null;
  kind?: AnimeKindEnum | null;
  posterUrl?: string | null;
}

