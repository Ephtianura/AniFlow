namespace AnimeApp.Core.Enums
{
    public enum VideoKind
    {
        Other = 0,

        // Музикальні типи
        AnimeVersion = 1,       // TV-Size
        ArtistVersion = 2,      // Full
        Live = 3,               // Концерт

        // Короткі промо/трейлери
        Promo = 10,              // PV
        Trailer = 11,
        Teaser = 12,
        Commercial = 13,         // CM
    }
}
