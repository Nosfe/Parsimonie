using System.Text.Json.Serialization;

namespace Parsimonie.Api.Services.Auth.Interfaces;

public interface IDiscordService
{
    string GetAuthorizationUrl(string state);
    Task<DiscordTokenResponse?> ExchangeCodeAsync(string code);
    Task<DiscordUser?> GetUserAsync(string accessToken);
    Task<DiscordGuildMember?> GetGuildMemberAsync(string accessToken, string guildId);
    bool HasRequiredRole(DiscordGuildMember member, string roleName, List<DiscordRole> guildRoles);
}

public record DiscordTokenResponse(
    [property: JsonPropertyName("access_token")] string AccessToken,
    [property: JsonPropertyName("token_type")] string TokenType,
    [property: JsonPropertyName("expires_in")] int ExpiresIn,
    [property: JsonPropertyName("refresh_token")] string RefreshToken,
    [property: JsonPropertyName("scope")] string Scope
);

public record DiscordUser(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("username")] string Username,
    [property: JsonPropertyName("avatar")] string? Avatar,
    [property: JsonPropertyName("global_name")] string? GlobalName
);

public record DiscordGuildMember(
    [property: JsonPropertyName("user")] DiscordUser? User,
    [property: JsonPropertyName("nick")] string? Nick,
    [property: JsonPropertyName("roles")] string[]? Roles
);

public record DiscordRole(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name
);
