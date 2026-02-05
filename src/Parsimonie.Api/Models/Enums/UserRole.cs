namespace Parsimonie.Api.Models.Enums;

[Flags]
public enum UserRole
{
    None = 0,
    Raider = 1,
    Officer = 2,
    GM = 4
}
