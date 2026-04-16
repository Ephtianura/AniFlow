export enum AnimeRatingEnum {
    Unknown = 0,
    G,
    PG,
    PG13,
    R,
    RPlus,
    RX
}
export const AnimeRatingMap: Record<string, string> = {
  Unknown: "",
  G: "0+",
  PG: "6+",
  PG13: "13+",
  R: "16+",
  RPlus: "18+",
  RX: "18+",
};