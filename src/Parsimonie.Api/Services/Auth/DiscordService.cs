using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Parsimonie.Api.Infrastructure.Extensions;
using Parsimonie.Api.Services.Auth.Interfaces;

namespace Parsimonie.Api.Services.Auth;

public class DiscordService : IDiscordService
{
    private readonly HttpClient _httpClient;
    private readonly DiscordOptions _options;
    private readonly ILogger<DiscordService> _logger;

    public DiscordService(
        HttpClient httpClient,
        IOptions<DiscordOptions> options,
        ILogger<DiscordService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public string GetAuthorizationUrl(string state)
    {
        var queryParams = new Dictionary<string, string>
        {
            ["client_id"] = _options.ClientId,
            ["redirect_uri"] = _options.RedirectUri,
            ["response_type"] = "code",
            ["scope"] = DiscordOptions.Scopes,
            ["state"] = state
        };

        var queryString = string.Join("&", queryParams.Select(kvp => 
            $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));

        return $"{DiscordOptions.AuthorizeUrl}?{queryString}";
    }

    public async Task<DiscordTokenResponse?> ExchangeCodeAsync(string code)
    {
        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["client_id"] = _options.ClientId,
            ["client_secret"] = _options.ClientSecret,
            ["grant_type"] = "authorization_code",
            ["code"] = code,
            ["redirect_uri"] = _options.RedirectUri
        });

        try
        {
            var response = await _httpClient.PostAsync(DiscordOptions.TokenUrl, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Log.TokenExchangeFailed(_logger, error);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordTokenResponse>(json);
        }
        catch (Exception ex)
        {
            Log.ExchangeCodeError(_logger, ex);
            return null;
        }
    }

    public async Task<DiscordUser?> GetUserAsync(string accessToken)
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, $"{DiscordOptions.ApiBaseUrl}/users/@me");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                Log.GetUserFailed(_logger, response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordUser>(json);
        }
        catch (Exception ex)
        {
            Log.GetUserError(_logger, ex);
            return null;
        }
    }

    public async Task<DiscordGuildMember?> GetGuildMemberAsync(string accessToken, string guildId)
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, 
                $"{DiscordOptions.ApiBaseUrl}/users/@me/guilds/{guildId}/member");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                Log.UserNotInGuild(_logger, guildId);
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                Log.GetGuildMemberFailed(_logger, response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordGuildMember>(json);
        }
        catch (Exception ex)
        {
            Log.GetGuildMemberError(_logger, ex);
            return null;
        }
    }

    public bool HasRequiredRole(DiscordGuildMember member, string roleName, List<DiscordRole> guildRoles)
    {
        if (member.Roles == null || member.Roles.Length == 0)
            return false;

        // Find the role ID for the required role name
        var requiredRole = guildRoles.FirstOrDefault(r => 
            r.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));

        if (requiredRole == null)
        {
            Log.RoleNotFound(_logger, roleName);
            return false;
        }

        return member.Roles.Contains(requiredRole.Id);
    }
}

internal static partial class Log
{
    [LoggerMessage(Level = LogLevel.Error, Message = "Discord token exchange failed: {Error}")]
    public static partial void TokenExchangeFailed(ILogger logger, string error);

    [LoggerMessage(Level = LogLevel.Error, Message = "Error exchanging Discord code")]
    public static partial void ExchangeCodeError(ILogger logger, Exception ex);

    [LoggerMessage(Level = LogLevel.Error, Message = "Failed to get Discord user: {Status}")]
    public static partial void GetUserFailed(ILogger logger, System.Net.HttpStatusCode status);

    [LoggerMessage(Level = LogLevel.Error, Message = "Error getting Discord user")]
    public static partial void GetUserError(ILogger logger, Exception ex);

    [LoggerMessage(Level = LogLevel.Warning, Message = "User is not a member of guild {GuildId}")]
    public static partial void UserNotInGuild(ILogger logger, string guildId);

    [LoggerMessage(Level = LogLevel.Error, Message = "Failed to get guild member: {Status}")]
    public static partial void GetGuildMemberFailed(ILogger logger, System.Net.HttpStatusCode status);

    [LoggerMessage(Level = LogLevel.Error, Message = "Error getting guild member")]
    public static partial void GetGuildMemberError(ILogger logger, Exception ex);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Role '{RoleName}' not found in guild roles")]
    public static partial void RoleNotFound(ILogger logger, string roleName);
}
