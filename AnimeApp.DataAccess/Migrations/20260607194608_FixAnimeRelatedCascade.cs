using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixAnimeRelatedCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimeRelateds_Animes_RelatedAnimeId",
                table: "AnimeRelateds");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeRelateds_Animes_RelatedAnimeId",
                table: "AnimeRelateds",
                column: "RelatedAnimeId",
                principalTable: "Animes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimeRelateds_Animes_RelatedAnimeId",
                table: "AnimeRelateds");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeRelateds_Animes_RelatedAnimeId",
                table: "AnimeRelateds",
                column: "RelatedAnimeId",
                principalTable: "Animes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
