using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAnimeTitleTrigramIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
            CREATE EXTENSION IF NOT EXISTS pg_trgm;

            CREATE INDEX "IX_AnimeTitles_Value_Trgm"
            ON "AnimeTitles"
            USING GIN ("Value" gin_trgm_ops);
        """);
            }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
            DROP INDEX IF EXISTS "IX_AnimeTitles_Value_Trgm";
        """);
        }
    }
}
