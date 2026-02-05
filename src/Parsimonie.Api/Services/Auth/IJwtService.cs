using Parsimonie.Api.Models.Entities;

namespace Parsimonie.Api.Services.Auth;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<User?> ValidateRefreshTokenAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
    Task<RefreshToken> CreateRefreshTokenAsync(User user);
}
