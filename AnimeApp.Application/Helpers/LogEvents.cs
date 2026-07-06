using Microsoft.Extensions.Logging;

namespace AnimeApp.Application.Helpers
{

    public static class LogEvents
    {
        // ========= SYSTEM =========

        public static readonly EventId UnhandledException =
            new(1000, nameof(UnhandledException));

        // ========= IMPORT / PARSING =========

        public static readonly EventId AnimeImportStarted =
            new(1100, nameof(AnimeImportStarted));

        public static readonly EventId AnimeImportCompleted =
            new(1101, nameof(AnimeImportCompleted));

        public static readonly EventId AnimeImportFailed =
            new(1102, nameof(AnimeImportFailed));

        public static readonly EventId AnimeAlreadyExists =
            new(1103, nameof(AnimeAlreadyExists));

        public static readonly EventId AnimeUpdated =
            new(1104, nameof(AnimeUpdated));

        public static readonly EventId AnimeConstructed =
            new(1105, nameof(AnimeConstructed));

        public static readonly EventId AnimeUrlUpdated =
            new(1106, nameof(AnimeUrlUpdated));

        public static readonly EventId AnimeMusicLoaded =
           new(1107, nameof(AnimeMusicLoaded));

        public static readonly EventId AnimeMusicFailed =
            new(1108, nameof(AnimeMusicFailed));


        // ========= EXTERNAL APIs =========

        public static readonly EventId MoonApiDataReceived =
            new(1200, nameof(MoonApiDataReceived));

        public static readonly EventId MoonApiDataInvalid =
          new(1201, nameof(MoonApiDataInvalid));



        public static readonly EventId KodikApiDataReceived =
            new(1250, nameof(KodikApiDataReceived));

        public static readonly EventId KodikScreenshotsLoaded =
            new(1251, nameof(KodikScreenshotsLoaded));

        public static readonly EventId KodikScreenshotsFailed =
            new(1252, nameof(KodikScreenshotsFailed));


        // ========= SYNC / CATALOG =========

        public static readonly EventId CatalogDumpStarted =
            new(1300, nameof(CatalogDumpStarted));

        public static readonly EventId CatalogDumpCompleted =
            new(1301, nameof(CatalogDumpCompleted));

        public static readonly EventId AnimeDatabaseFillStarted =
            new(1302, nameof(AnimeDatabaseFillStarted));

        public static readonly EventId AnimeQueuePublished =
            new(1303, nameof(AnimeQueuePublished));

        public static readonly EventId AnimeUpdateCheckStarted =
            new(1304, nameof(AnimeUpdateCheckStarted));

        public static readonly EventId NewAnimeFound =
            new(1305, nameof(NewAnimeFound));

        public static readonly EventId AnimeUpdateFound =
            new(1306, nameof(AnimeUpdateFound));



        // ========= STUDIO =========

        public static readonly EventId StudioFound =
            new(1400, nameof(StudioFound));

        public static readonly EventId StudioCreated =
            new(1401, nameof(StudioCreated));

        public static readonly EventId StudioUpdated =
            new(1402, nameof(StudioUpdated));

    }
}
