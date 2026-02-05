using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Infrastructure.Extensions;
using Parsimonie.Api.Models.DTOs.Auth;
using Parsimonie.Api.Models.Entities;
using Parsimonie.Api.Models.Enums;
using Parsimonie.Api.Services.Auth.Interfaces;
using Parsimonie.Api.Services.Roster.Interfaces;

namespace Parsimonie.Api.Services.Auth;

/// <summary>
/// Service implementation for authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IDiscordService _discordService;
    private readonly IJwtService _jwtService;
    private readonly ParsimonieDbContext _dbContext;
    private readonly DiscordOptions _discordOptions;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IDiscordService discordService,
        IJwtService jwtService,
        ParsimonieDbContext dbContext,
        IOptions<DiscordOptions> discordOptions,
        ILogger<AuthService> logger)
    {
        _discordService = discordService;
        _jwtService = jwtService;
        _dbContext = dbContext;
        _discordOptions = discordOptions.Value;
        _logger = logger;
    }

    public string GetAuthorizationUrl(string state)
    {
        return _discordService.GetAuthorizationUrl(state);
    }

    public async Task<ServiceResult<AuthResult>> ProcessCallbackAsync(string code)
    {
        // Exchange code for token
        var tokenResponse = await _discordService.ExchangeCodeAsync(code);
        if (tokenResponse == null)
        {
            return ServiceResult<AuthResult>.Fail("token_exchange_failed", "Failed to exchange authorization code");
        }

        // Get Discord user info
        var discordUser = await _discordService.GetUserAsync(tokenResponse.AccessToken);
        if (discordUser == null)
        {
            return ServiceResult<AuthResult>.Fail("user_fetch_failed", "Failed to get Discord user information");
        }

        // Check guild membership
        var guildMember = await _discordService.GetGuildMemberAsync(tokenResponse.AccessToken, _discordOptions.GuildId);
        if (guildMember == null)
        {
            return ServiceResult<AuthResult>.Fail("not_guild_member", 
                "You must be a member of the Parsimonie Discord server to access this application");
        }

        // Get guild roles to check for required role
        var guildRoles = new List<DiscordRole>(); // Note: Would need bot token for this
        if (!_discordService.HasRequiredRole(guildMember, _discordOptions.RoleName, guildRoles))
        {
            return ServiceResult<AuthResult>.Fail("missing_role", 
                $"You must have the '{_discordOptions.RoleName}' role to access Parsimonie");
        }

        // Find or create user
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.DiscordId == discordUser.Id);

        if (user == null)
        {
            user = new Models.Entities.User
            {
                Id = Guid.NewGuid(),
                DiscordId = discordUser.Id,
                DiscordUsername = discordUser.GlobalName ?? discordUser.Username,
                DiscordAvatar = discordUser.Avatar,
                Roles = DetermineUserRoles(guildMember, guildRoles),
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
        }
        else
        {
            user.DiscordUsername = discordUser.GlobalName ?? discordUser.Username;
            user.DiscordAvatar = discordUser.Avatar;
            user.Roles = DetermineUserRoles(guildMember, guildRoles);
            user.LastLoginAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await _jwtService.CreateRefreshTokenAsync(user);

        return ServiceResult<AuthResult>.Ok(new AuthResult(
            accessToken,
            refreshToken.Token,
            DateTime.UtcNow.AddMinutes(1440),
            MapToUserDto(user)
        ));
    }

    public async Task<ServiceResult<AuthResult>> RefreshTokenAsync(string refreshToken)
    {
        var user = await _jwtService.ValidateRefreshTokenAsync(refreshToken);
        if (user == null)
        {
            return ServiceResult<AuthResult>.Fail("invalid_refresh_token", "Refresh token is invalid or expired");
        }

        // Revoke old token and create new one
        await _jwtService.RevokeRefreshTokenAsync(refreshToken);
        
        var accessToken = _jwtService.GenerateAccessToken(user);
        var newRefreshToken = await _jwtService.CreateRefreshTokenAsync(user);

        return ServiceResult<AuthResult>.Ok(new AuthResult(
            accessToken,
            newRefreshToken.Token,
            DateTime.UtcNow.AddMinutes(1440),
            MapToUserDto(user)
        ));
    }

    public async Task RevokeTokenAsync(string refreshToken)
    {
        await _jwtService.RevokeRefreshTokenAsync(refreshToken);
    }

    private static UserRole DetermineUserRoles(DiscordGuildMember member, List<DiscordRole> guildRoles)
    {
        var roles = UserRole.Raider; // Default - they passed the role check

        if (member.Roles != null)
        {
            foreach (var roleId in member.Roles)
            {
                var role = guildRoles.FirstOrDefault(r => r.Id == roleId);
                if (role != null)
                {
                    if (role.Name.Equals("Officer", StringComparison.OrdinalIgnoreCase))
                        roles |= UserRole.Officer;
                    if (role.Name.Equals("GM", StringComparison.OrdinalIgnoreCase) || 
                        role.Name.Equals("Guild Master", StringComparison.OrdinalIgnoreCase))
                        roles |= UserRole.GM | UserRole.Officer;
                }
            }
        }

        return roles;
    }

    private static UserDto MapToUserDto(Models.Entities.User user)
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
