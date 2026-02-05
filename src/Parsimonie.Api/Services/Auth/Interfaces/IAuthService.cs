using Parsimonie.Api.Models.DTOs.Auth;
using Parsimonie.Api.Services.Roster.Interfaces;

namespace Parsimonie.Api.Services.Auth.Interfaces;

/// <summary>
/// Service interface for authentication operations
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Get the Discord OAuth authorization URL
    /// </summary>
    string GetAuthorizationUrl(string state);

    /// <summary>
    /// Process Discord OAuth callback and authenticate user
    /// </summary>
    /// <param name="code">Authorization code from Discord</param>
    /// <param name="state">OAuth state for CSRF protection</param>
    Task<ServiceResult<AuthResult>> ProcessCallbackAsync(string code);

    /// <summary>
    /// Refresh an access token
    /// </summary>
    Task<ServiceResult<AuthResult>> RefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Logout and revoke refresh token
    /// </summary>
    Task RevokeTokenAsync(string refreshToken);
}

/// <summary>
/// Result of successful authentication
/// </summary>
public record AuthResult(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);
