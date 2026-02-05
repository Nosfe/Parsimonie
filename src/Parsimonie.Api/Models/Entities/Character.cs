using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Models.Entities;

public class Character
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }  // Nullable until assigned to a user
    
    public string Name { get; set; } = string.Empty;
    public string Realm { get; set; } = "Mograine";  // Default TBC realm
    
    public WowClass Class { get; set; }
    public WowSpec PrimarySpec { get; set; }
    public WowSpec? SecondarySpec { get; set; }
    
    public bool IsMain { get; set; }
    public bool IsActive { get; set; } = true;  // Soft delete flag
    
    public string? Notes { get; set; }  // Officer notes
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedByUserId { get; set; }  // Officer who created this character

    // Navigation properties
    public User? User { get; set; }
    public User? CreatedByUser { get; set; }
}
