using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateGenre_Studiofields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MalId",
                table: "Studios",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Genres",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MalId",
                table: "Studios");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Genres");
        }
    }
}
