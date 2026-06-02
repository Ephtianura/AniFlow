export enum VideoKind {
  // Other
  Other = "Other",

  // Музикальні типи
  AnimeVersion = "AnimeVersion", // TV-Size
  ArtistVersion = "ArtistVersion", // Full
  Live = "Live", // Концерт

  // Короткі промо/трейлери
  Promo = "Promo", // PV
  Trailer = "Trailer",
  Teaser = "Teaser",
  Commercial = "Commercial", // CM
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