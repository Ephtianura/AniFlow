export enum VideoKind {
  Other = 0,

  // Музикальні типи
  AnimeVersion = 1, // TV-Size
  ArtistVersion = 2, // Full
  Live = 3, // Концерт

  // Короткі промо/трейлери
  Promo = 10, // PV
  Trailer = 11,
  Teaser = 12,
  Commercial = 13, // CM
}

export const VideoKindLabel: Record<VideoKind, string> = {
  [VideoKind.Other]: "Інше",
  
  [VideoKind.AnimeVersion]: "TV-версія",
  [VideoKind.ArtistVersion]: "Повна версія",
  [VideoKind.Live]: "Концерт",

  [VideoKind.Promo]: "Промо",
  [VideoKind.Trailer]: "Трейлер",
  [VideoKind.Teaser]: "Тізер",
  [VideoKind.Commercial]: "Реклама",
};