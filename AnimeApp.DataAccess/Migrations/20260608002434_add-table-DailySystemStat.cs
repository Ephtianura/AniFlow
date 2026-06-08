using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addtableDailySystemStat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailySystemStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "date", nullable: false),
                    VisitsCount = table.Column<int>(type: "integer", nullable: false),
                    UniquesCount = table.Column<int>(type: "integer", nullable: false),
                    RegistrationsCount = table.Column<int>(type: "integer", nullable: false),
                    UserInteractionsCount = table.Column<int>(type: "integer", nullable: false),
                    PlayerViewsCount = table.Column<int>(type: "integer", nullable: false),
                    PeakOnline = table.Column<int>(type: "integer", nullable: false),
                    AvgOnline = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailySystemStats", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailySystemStats_Date",
                table: "DailySystemStats",
                column: "Date",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailySystemStats");
        }
    }
}
