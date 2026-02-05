using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Models.Entities;

public class Character
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Realm { get; set; } = string.Empty;
    public WowClass Class { get; set; }
    public WowSpec Spec { get; set; }
    public bool IsMain { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
