namespace Parsimonie.Api.Infrastructure.Extensions;

public class DiscordOptions
{
    public const string SectionName = "Discord";
    
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string GuildId { get; set; } = string.Empty;
    public string RoleName { get; set; } = "Raider";
    public string RedirectUri { get; set; } = string.Empty;
    
    // OAuth URLs
    public const string AuthorizeUrl = "https://discord.com/api/oauth2/authorize";
    public const string TokenUrl = "https://discord.com/api/oauth2/token";
    public const string ApiBaseUrl = "https://discord.com/api/v10";
    
    // Required scopes
    public const string Scopes = "identify guilds.members.read";
}
