using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Parsimonie.Api.Migrations
{
    /// <inheritdoc />
    public partial class RosterManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Users_UserId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_Name_Realm",
                table: "Characters");

            migrationBuilder.RenameColumn(
                name: "Spec",
                table: "Characters",
                newName: "PrimarySpec");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Characters",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Characters",
                type: "character varying(12)",
                maxLength: 12,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByUserId",
                table: "Characters",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Characters",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Characters",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SecondarySpec",
                table: "Characters",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CreatedByUserId",
                table: "Characters",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_Name_Realm",
                table: "Characters",
                columns: new[] { "Name", "Realm" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Users_CreatedByUserId",
                table: "Characters",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Users_UserId",
                table: "Characters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Users_CreatedByUserId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Users_UserId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_CreatedByUserId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_Name_Realm",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "SecondarySpec",
                table: "Characters");

            migrationBuilder.RenameColumn(
                name: "PrimarySpec",
                table: "Characters",
                newName: "Spec");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Characters",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Characters",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(12)",
                oldMaxLength: 12);

            migrationBuilder.CreateIndex(
                name: "IX_Characters_Name_Realm",
                table: "Characters",
                columns: new[] { "Name", "Realm" });

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Users_UserId",
                table: "Characters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
