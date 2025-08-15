using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewsAppBecend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserEditionsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EditionsItems_Users_UserId",
                table: "EditionsItems");

            migrationBuilder.DropIndex(
                name: "IX_EditionsItems_UserId",
                table: "EditionsItems");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "EditionsItems");

            migrationBuilder.CreateTable(
                name: "EditionsItemUser",
                columns: table => new
                {
                    EditionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EditionsItemUser", x => new { x.EditionsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_EditionsItemUser_EditionsItems_EditionsId",
                        column: x => x.EditionsId,
                        principalTable: "EditionsItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EditionsItemUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EditionsItemUser_UsersId",
                table: "EditionsItemUser",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EditionsItemUser");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "EditionsItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EditionsItems_UserId",
                table: "EditionsItems",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EditionsItems_Users_UserId",
                table: "EditionsItems",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
