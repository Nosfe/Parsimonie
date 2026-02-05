using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Models.Entities;

public class User
{
    public Guid Id { get; set; }
    public string DiscordId { get; set; } = string.Empty;
    public string DiscordUsername { get; set; } = string.Empty;
    public string? DiscordAvatar { get; set; }
    public UserRole Roles { get; set; } = UserRole.None;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Character> Characters { get; set; } = new List<Character>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
