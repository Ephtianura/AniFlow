using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class deleteUniqueOstsIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AnimeVideos_AnimeId_Index",
                table: "AnimeVideos");

            migrationBuilder.DropIndex(
                name: "IX_AnimeOsts_AnimeId_Index",
                table: "AnimeOsts");

            migrationBuilder.CreateIndex(
                name: "IX_AnimeVideos_AnimeId",
                table: "AnimeVideos",
                column: "AnimeId");

            migrationBuilder.CreateIndex(
                name: "IX_AnimeOsts_AnimeId",
                table: "AnimeOsts",
                column: "AnimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AnimeVideos_AnimeId",
                table: "AnimeVideos");

            migrationBuilder.DropIndex(
                name: "IX_AnimeOsts_AnimeId",
                table: "AnimeOsts");

            migrationBuilder.CreateIndex(
                name: "IX_AnimeVideos_AnimeId_Index",
                table: "AnimeVideos",
                columns: new[] { "AnimeId", "Index" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeOsts_AnimeId_Index",
                table: "AnimeOsts",
                columns: new[] { "AnimeId", "Index" },
                unique: true);
        }
    }
}
