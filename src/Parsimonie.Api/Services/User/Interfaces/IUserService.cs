using Parsimonie.Api.Models.DTOs.User;

namespace Parsimonie.Api.Services.User.Interfaces;

/// <summary>
/// Service interface for user profile operations
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Get the current user's profile with linked characters
    /// </summary>
    Task<MeResponseDto?> GetUserProfileAsync(Guid userId);

    /// <summary>
    /// Get the current user's characters
    /// </summary>
    Task<List<CharacterDto>> GetUserCharactersAsync(Guid userId);

    /// <summary>
    /// Get basic user info by ID
    /// </summary>
    Task<UserBasicInfo?> GetUserBasicInfoAsync(Guid userId);

    /// <summary>
    /// Check if a user exists
    /// </summary>
    Task<bool> UserExistsAsync(Guid userId);
}

/// <summary>
/// Basic user information for references
/// </summary>
public record UserBasicInfo(Guid Id, string Username, string? Avatar);
