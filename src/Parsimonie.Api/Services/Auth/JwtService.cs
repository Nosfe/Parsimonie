using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Infrastructure.Extensions;
using Parsimonie.Api.Models.Entities;
using Parsimonie.Api.Models.Enums;
using Parsimonie.Api.Services.Auth.Interfaces;

namespace Parsimonie.Api.Services.Auth;

public class JwtService : IJwtService
{
    private readonly ParsimonieDbContext _dbContext;
    private readonly JwtOptions _options;
    private readonly ILogger<JwtService> _logger;

    public JwtService(
        ParsimonieDbContext dbContext,
        IOptions<JwtOptions> options,
        ILogger<JwtService> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _logger = logger;
    }

    public string GenerateAccessToken(Models.Entities.User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("discord_id", user.DiscordId),
            new("username", user.DiscordUsername)
        };

        // Add role claims
        if (user.Roles.HasFlag(UserRole.GM))
            claims.Add(new Claim("role", "GM"));
        if (user.Roles.HasFlag(UserRole.Officer))
            claims.Add(new Claim("role", "Officer"));
        if (user.Roles.HasFlag(UserRole.Raider))
            claims.Add(new Claim("role", "Raider"));

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public async Task<RefreshToken> CreateRefreshTokenAsync(Models.Entities.User user)
    {
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<Models.Entities.User?> ValidateRefreshTokenAsync(string token)
    {
        var refreshToken = await _dbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken == null)
        {
            _logger.LogWarning("Refresh token not found");
            return null;
        }

        if (!refreshToken.IsActive)
        {
            _logger.LogWarning("Refresh token is not active (expired or revoked)");
            return null;
        }

        return refreshToken.User;
    }

    public async Task RevokeRefreshTokenAsync(string token)
    {
        var refreshToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken != null)
        {
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }
}
