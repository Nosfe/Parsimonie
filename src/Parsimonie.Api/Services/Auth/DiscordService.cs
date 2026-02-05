using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Parsimonie.Api.Infrastructure.Extensions;

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
                _logger.LogError("Discord token exchange failed: {Error}", error);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordTokenResponse>(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exchanging Discord code");
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
                _logger.LogError("Failed to get Discord user: {Status}", response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordUser>(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Discord user");
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
                _logger.LogWarning("User is not a member of guild {GuildId}", guildId);
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to get guild member: {Status}", response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<DiscordGuildMember>(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting guild member");
            return null;
        }
    }

    public bool HasRequiredRole(DiscordGuildMember member, string roleName, List<DiscordRole> guildRoles)
    {
        if (member.roles == null || member.roles.Length == 0)
            return false;

        // Find the role ID for the required role name
        var requiredRole = guildRoles.FirstOrDefault(r => 
            r.name.Equals(roleName, StringComparison.OrdinalIgnoreCase));

        if (requiredRole == null)
        {
            _logger.LogWarning("Role '{RoleName}' not found in guild roles", roleName);
            return false;
        }

        return member.roles.Contains(requiredRole.id);
    }
}
