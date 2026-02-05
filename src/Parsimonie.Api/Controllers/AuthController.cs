using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Infrastructure.Extensions;
using Parsimonie.Api.Models.DTOs.Auth;
using Parsimonie.Api.Models.Entities;
using Parsimonie.Api.Models.Enums;
using Parsimonie.Api.Services.Auth;
using System.Text.Json;

namespace Parsimonie.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IDiscordService _discordService;
    private readonly IJwtService _jwtService;
    private readonly ParsimonieDbContext _dbContext;
    private readonly DiscordOptions _discordOptions;
    private readonly ILogger<AuthController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(
        IDiscordService discordService,
        IJwtService jwtService,
        ParsimonieDbContext dbContext,
        IOptions<DiscordOptions> discordOptions,
        ILogger<AuthController> logger,
        IHttpClientFactory httpClientFactory)
    {
        _discordService = discordService;
        _jwtService = jwtService;
        _dbContext = dbContext;
        _discordOptions = discordOptions.Value;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Initiates Discord OAuth flow
    /// </summary>
    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? returnUrl = null)
    {
        var state = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        
        // Store state in a cookie for validation on callback
        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(10)
        });

        if (!string.IsNullOrEmpty(returnUrl))
        {
            Response.Cookies.Append("return_url", returnUrl, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(10)
            });
        }

        var authUrl = _discordService.GetAuthorizationUrl(state);
        return Redirect(authUrl);
    }

    /// <summary>
    /// Discord OAuth callback - validates guild membership and role
    /// </summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        // Validate state
        var savedState = Request.Cookies["oauth_state"];
        if (string.IsNullOrEmpty(savedState) || savedState != state)
        {
            _logger.LogWarning("OAuth state mismatch");
            return BadRequest(new AuthErrorDto("invalid_state", "OAuth state validation failed"));
        }

        // Clear state cookie
        Response.Cookies.Delete("oauth_state");

        // Exchange code for token
        var tokenResponse = await _discordService.ExchangeCodeAsync(code);
        if (tokenResponse == null)
        {
            return BadRequest(new AuthErrorDto("token_exchange_failed", "Failed to exchange authorization code"));
        }

        // Get Discord user info
        var discordUser = await _discordService.GetUserAsync(tokenResponse.access_token);
        if (discordUser == null)
        {
            return BadRequest(new AuthErrorDto("user_fetch_failed", "Failed to get Discord user information"));
        }

        // Check guild membership
        var guildMember = await _discordService.GetGuildMemberAsync(tokenResponse.access_token, _discordOptions.GuildId);
        if (guildMember == null)
        {
            return Unauthorized(new AuthErrorDto("not_guild_member", 
                "You must be a member of the Parsimonie Discord server to access this application"));
        }

        // Get guild roles to check for required role
        var guildRoles = await GetGuildRolesAsync();
        if (!_discordService.HasRequiredRole(guildMember, _discordOptions.RoleName, guildRoles))
        {
            return Unauthorized(new AuthErrorDto("missing_role", 
                $"You must have the '{_discordOptions.RoleName}' role to access Parsimonie"));
        }

        // Find or create user
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.DiscordId == discordUser.id);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                DiscordId = discordUser.id,
                DiscordUsername = discordUser.global_name ?? discordUser.username,
                DiscordAvatar = discordUser.avatar,
                Roles = DetermineUserRoles(guildMember, guildRoles),
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
        }
        else
        {
            user.DiscordUsername = discordUser.global_name ?? discordUser.username;
            user.DiscordAvatar = discordUser.avatar;
            user.Roles = DetermineUserRoles(guildMember, guildRoles);
            user.LastLoginAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await _jwtService.CreateRefreshTokenAsync(user);

        var loginResponse = new LoginResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshToken.Token,
            ExpiresAt: DateTime.UtcNow.AddMinutes(1440),
            User: MapToUserDto(user)
        );

        // Get return URL if present
        var returnUrl = Request.Cookies["return_url"];
        Response.Cookies.Delete("return_url");

        // For API-only response, return JSON
        // For frontend integration, redirect with tokens in URL fragment
        if (!string.IsNullOrEmpty(returnUrl))
        {
            var redirectUrl = $"{returnUrl}#access_token={accessToken}&refresh_token={refreshToken.Token}";
            return Redirect(redirectUrl);
        }

        return Ok(loginResponse);
    }

    /// <summary>
    /// Refresh access token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request)
    {
        var user = await _jwtService.ValidateRefreshTokenAsync(request.RefreshToken);
        if (user == null)
        {
            return Unauthorized(new AuthErrorDto("invalid_refresh_token", "Refresh token is invalid or expired"));
        }

        // Revoke old token and create new one
        await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);
        
        var accessToken = _jwtService.GenerateAccessToken(user);
        var newRefreshToken = await _jwtService.CreateRefreshTokenAsync(user);

        return Ok(new LoginResponseDto(
            AccessToken: accessToken,
            RefreshToken: newRefreshToken.Token,
            ExpiresAt: DateTime.UtcNow.AddMinutes(1440),
            User: MapToUserDto(user)
        ));
    }

    /// <summary>
    /// Logout - revoke refresh token
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto request)
    {
        await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);
        return NoContent();
    }

    private async Task<List<DiscordRole>> GetGuildRolesAsync()
    {
        // Note: This requires a bot token with the proper permissions
        // For now, we'll use a simplified approach that checks role IDs directly
        // In production, you'd want to cache guild roles or use a bot to fetch them
        
        // For development, we'll return an empty list and adjust the role checking logic
        // to work with role IDs if role names aren't available
        return new List<DiscordRole>();
    }

    private UserRole DetermineUserRoles(DiscordGuildMember member, List<DiscordRole> guildRoles)
    {
        var roles = UserRole.Raider; // Default - they passed the role check

        // Check for Officer/GM roles based on Discord role names
        // This can be customized based on your guild's role structure
        if (member.roles != null)
        {
            foreach (var roleId in member.roles)
            {
                var role = guildRoles.FirstOrDefault(r => r.id == roleId);
                if (role != null)
                {
                    if (role.name.Equals("Officer", StringComparison.OrdinalIgnoreCase))
                        roles |= UserRole.Officer;
                    if (role.name.Equals("GM", StringComparison.OrdinalIgnoreCase) || 
                        role.name.Equals("Guild Master", StringComparison.OrdinalIgnoreCase))
                        roles |= UserRole.GM | UserRole.Officer;
                }
            }
        }

        return roles;
    }

    private static UserDto MapToUserDto(User user)
    {
        var roles = new List<string>();
        if (user.Roles.HasFlag(UserRole.GM)) roles.Add("GM");
        if (user.Roles.HasFlag(UserRole.Officer)) roles.Add("Officer");
        if (user.Roles.HasFlag(UserRole.Raider)) roles.Add("Raider");

        return new UserDto(
            user.Id,
            user.DiscordId,
            user.DiscordUsername,
            user.DiscordAvatar,
            roles.ToArray()
        );
    }
}
