// src/core/AnimeKind.ts
export const AnimeKindMap: Record<string, string> = {
  Unknown: "Невідомо",
  TV: "ТБ Серіал",
  Movie: "Фільм",
  OVA: "OVA",
  ONA: "ONA",
  Special: "Спешл",
  TVSpecial: "ТБ Спешл",
  Music: "Музичний",
  PV: "PV",
  CM: "CM",
};
export enum AnimeKindEnum {
  Unknown = 0,
  TV = 1,
  Movie = 2,
  OVA = 3,
  ONA = 4,
  Special = 5,
  TVSpecial = 6,
  Music = 7,
  PV = 8,
  CM = 9,
}