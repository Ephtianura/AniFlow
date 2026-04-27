using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addFavoritefield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "UserAnimes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "UserAnimes");
        }
    }
}
