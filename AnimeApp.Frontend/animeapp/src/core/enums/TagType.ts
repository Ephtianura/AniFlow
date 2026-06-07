export enum TagType {
  Genre = "Genre",
  Theme= "Theme",
  Demographic= "Demographic",
}
export const tagTypeLabels: Record<TagType, string> = {
    [TagType.Genre]: "Жанри",
    [TagType.Theme]: "Теми",
    [TagType.Demographic]: "Демографія",
};