// src/core/AnimeStatus.ts
export const AnimeStatusMap: Record<string, string> = {
  Unknown: "Невідомо",
  Anons: "Анонсовано",
  Ongoing: "Онгоінг",
  Released: "Вийшло",
};
export enum AnimeStatusEnum {
  Unknown = 0,
  Anons = 1,
  Ongoing = 2,
  Released = 3,
}