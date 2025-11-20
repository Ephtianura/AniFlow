using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addRelated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnimeRelated");

            migrationBuilder.CreateTable(
                name: "AnimeRelateds",
                columns: table => new
                {
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    RelatedAnimeId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeRelateds", x => new { x.AnimeId, x.RelatedAnimeId });
                    table.ForeignKey(
                        name: "FK_AnimeRelateds_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnimeRelateds_Animes_RelatedAnimeId",
                        column: x => x.RelatedAnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnimeRelateds_RelatedAnimeId",
                table: "AnimeRelateds",
                column: "RelatedAnimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnimeRelateds");

            migrationBuilder.CreateTable(
                name: "AnimeRelated",
                columns: table => new
                {
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    RelatedAnimeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeRelated", x => new { x.AnimeId, x.RelatedAnimeId });
                    table.ForeignKey(
                        name: "FK_AnimeRelated_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnimeRelated_Animes_RelatedAnimeId",
                        column: x => x.RelatedAnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnimeRelated_RelatedAnimeId",
                table: "AnimeRelated",
                column: "RelatedAnimeId");
        }
    }
}
