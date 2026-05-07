using System;
using System.Collections.Generic;
using AnimeApp.Core.Enums;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class newOstModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Studios",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Genres",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Year",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Season",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Kind",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "EpisodesAired",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Episodes",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Duration",
                table: "Animes",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Animes",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddColumn<int>(
                name: "AniListId",
                table: "Animes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<List<ExternalLink>>(
                name: "ExternalLinks",
                table: "Animes",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "KodikId",
                table: "Animes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MalId",
                table: "Animes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MoonId",
                table: "Animes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoonSlug",
                table: "Animes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Nsfw",
                table: "Animes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Source",
                table: "Animes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Animes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "AnimeIdCatalog",
                columns: table => new
                {
                    MoonId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    KodikId = table.Column<int>(type: "integer", nullable: true),
                    MalId = table.Column<int>(type: "integer", nullable: false),
                    IsParsed = table.Column<bool>(type: "boolean", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeIdCatalog", x => x.MoonId);
                });

            migrationBuilder.CreateTable(
                name: "AnimeOsts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Author = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Type = table.Column<string>(type: "text", nullable: false),
                    SpotifyUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Index = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeOsts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnimeOsts_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnimeVideos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnimeId = table.Column<int>(type: "integer", nullable: false),
                    AnimeOstId = table.Column<int>(type: "integer", nullable: true),
                    Url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Kind = table.Column<string>(type: "text", nullable: false),
                    Index = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeVideos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnimeVideos_AnimeOsts_AnimeOstId",
                        column: x => x.AnimeOstId,
                        principalTable: "AnimeOsts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnimeVideos_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAnimes_IsFavorite",
                table: "UserAnimes",
                column: "IsFavorite");

            migrationBuilder.CreateIndex(
                name: "IX_Animes_Url",
                table: "Animes",
                column: "Url",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeIdCatalog_KodikId",
                table: "AnimeIdCatalog",
                column: "KodikId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeIdCatalog_MalId",
                table: "AnimeIdCatalog",
                column: "MalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeOsts_AnimeId_Index",
                table: "AnimeOsts",
                columns: new[] { "AnimeId", "Index" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeVideos_AnimeId_Index",
                table: "AnimeVideos",
                columns: new[] { "AnimeId", "Index" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeVideos_AnimeOstId",
                table: "AnimeVideos",
                column: "AnimeOstId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnimeIdCatalog");

            migrationBuilder.DropTable(
                name: "AnimeVideos");

            migrationBuilder.DropTable(
                name: "AnimeOsts");

            migrationBuilder.DropIndex(
                name: "IX_UserAnimes_IsFavorite",
                table: "UserAnimes");

            migrationBuilder.DropIndex(
                name: "IX_Animes_Url",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Studios");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "AniListId",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "ExternalLinks",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "KodikId",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "MalId",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "MoonId",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "MoonSlug",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Nsfw",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Animes");

            migrationBuilder.AddColumn<int>(
                name: "Theme",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "Year",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Season",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Kind",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EpisodesAired",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Episodes",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Duration",
                table: "Animes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Animes",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);
        }
    }
}
