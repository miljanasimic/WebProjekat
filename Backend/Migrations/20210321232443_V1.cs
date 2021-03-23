using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Biblioteka",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Biblioteka", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Odeljenje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojRedova = table.Column<int>(type: "int", nullable: false),
                    BrPolicaPoRedu = table.Column<int>(type: "int", nullable: false),
                    BibliotekaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odeljenje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Odeljenje_Biblioteka_BibliotekaID",
                        column: x => x.BibliotekaID,
                        principalTable: "Biblioteka",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Knjiga",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(name: "Naziv ", type: "nvarchar(max)", nullable: true),
                    Autor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrStrana = table.Column<int>(type: "int", nullable: false),
                    GodIzdavanja = table.Column<int>(type: "int", nullable: false),
                    Kolicina = table.Column<int>(type: "int", nullable: false),
                    Red = table.Column<int>(type: "int", nullable: false),
                    PozUredu = table.Column<int>(type: "int", nullable: false),
                    OdeljenjeID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Knjiga", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Knjiga_Odeljenje_OdeljenjeID",
                        column: x => x.OdeljenjeID,
                        principalTable: "Odeljenje",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Knjiga_OdeljenjeID",
                table: "Knjiga",
                column: "OdeljenjeID");

            migrationBuilder.CreateIndex(
                name: "IX_Odeljenje_BibliotekaID",
                table: "Odeljenje",
                column: "BibliotekaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Knjiga");

            migrationBuilder.DropTable(
                name: "Odeljenje");

            migrationBuilder.DropTable(
                name: "Biblioteka");
        }
    }
}
