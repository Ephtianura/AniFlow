export enum AnimeSource {
  Original = "Original",
  Manga = "Manga",
  LightNovel = "LightNovel",
  WebNovel = "WebNovel",
  VisualNovel = "VisualNovel",
  Game = "Game",
  Book = "Book",
  PictureBook = "PictureBook",
  MixedMedia = "MixedMedia"
}

export const AnimeSourceMap: Record<string, string> = {
  [AnimeSource.Original]: "Оригінальний сценарій",

  [AnimeSource.Manga]: "Манга",
  [AnimeSource.LightNovel]: "Ранобе",
  [AnimeSource.WebNovel]: "Веб-новела",
  [AnimeSource.VisualNovel]: "Візуальна новела",

  [AnimeSource.Game]: "Гра",

  [AnimeSource.Book]: "Книга",
  [AnimeSource.PictureBook]: "Ілюстрована книга",

  [AnimeSource.MixedMedia]: "Мультимедійний проєкт",
};