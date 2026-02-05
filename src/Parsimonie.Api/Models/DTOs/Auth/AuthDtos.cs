namespace Parsimonie.Api.Models.DTOs.Auth;

public record LoginResponseDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    Guid Id,
    string DiscordId,
    string Username,
    string? Avatar,
    string[] Roles
);

public record RefreshTokenRequestDto(string RefreshToken);

public record AuthErrorDto(string Error, string Message);
