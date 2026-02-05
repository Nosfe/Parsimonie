using Parsimonie.Api.Models.Entities;

namespace Parsimonie.Api.Services.Auth.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(Models.Entities.User user);
    string GenerateRefreshToken();
    Task<Models.Entities.User?> ValidateRefreshTokenAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
    Task<RefreshToken> CreateRefreshTokenAsync(Models.Entities.User user);
}
