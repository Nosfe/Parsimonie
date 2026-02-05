namespace Parsimonie.Api.Services.Auth;

public interface IDiscordService
{
    string GetAuthorizationUrl(string state);
    Task<DiscordTokenResponse?> ExchangeCodeAsync(string code);
    Task<DiscordUser?> GetUserAsync(string accessToken);
    Task<DiscordGuildMember?> GetGuildMemberAsync(string accessToken, string guildId);
    bool HasRequiredRole(DiscordGuildMember member, string roleName, List<DiscordRole> guildRoles);
}

public record DiscordTokenResponse(
    string access_token,
    string token_type,
    int expires_in,
    string refresh_token,
    string scope
);

public record DiscordUser(
    string id,
    string username,
    string? avatar,
    string? global_name
);

public record DiscordGuildMember(
    DiscordUser? user,
    string? nick,
    string[]? roles
);

public record DiscordRole(
    string id,
    string name
);
