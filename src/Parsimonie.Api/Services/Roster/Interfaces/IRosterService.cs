using Parsimonie.Api.Models.DTOs.Roster;
using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Services.Roster.Interfaces;

/// <summary>
/// Service interface for roster/character management operations
/// </summary>
public interface IRosterService
{
    /// <summary>
    /// Get all roster characters
    /// </summary>
    /// <param name="includeInactive">Include inactive characters (officer only)</param>
    /// <param name="isOfficer">Whether the requester is an officer</param>
    Task<RosterResponse> GetRosterAsync(bool includeInactive, bool isOfficer);

    /// <summary>
    /// Get a specific character by ID
    /// </summary>
    Task<ServiceResult<CharacterResponse>> GetCharacterAsync(Guid id, bool isOfficer);

    /// <summary>
    /// Create a new character (officer operation)
    /// </summary>
    Task<ServiceResult<CharacterResponse>> CreateCharacterAsync(CreateCharacterRequest request, Guid createdByUserId);

    /// <summary>
    /// Update a character (officer operation)
    /// </summary>
    Task<ServiceResult<CharacterResponse>> UpdateCharacterAsync(Guid id, UpdateCharacterRequest request);

    /// <summary>
    /// Soft delete a character (officer operation)
    /// </summary>
    Task<ServiceResult> DeleteCharacterAsync(Guid id, Guid deletedByUserId);

    /// <summary>
    /// Assign or unassign a character to a user (officer operation)
    /// </summary>
    Task<ServiceResult<CharacterResponse>> AssignCharacterAsync(Guid id, Guid? userId, Guid assignedByUserId);

    /// <summary>
    /// Update a character's spec (raider self-service operation)
    /// </summary>
    Task<ServiceResult<CharacterResponse>> UpdateSpecAsync(Guid characterId, WowSpec primarySpec, WowSpec? secondarySpec, Guid userId);

    /// <summary>
    /// Set a character as the user's main (raider self-service operation)
    /// </summary>
    Task<ServiceResult<CharacterResponse>> SetAsMainAsync(Guid characterId, Guid userId);
}

/// <summary>
/// Standard service result for operations that may fail
/// </summary>
public record ServiceResult(bool Success, string? ErrorCode = null, string? ErrorMessage = null)
{
    public static ServiceResult Ok() => new(true);
    public static ServiceResult Fail(string errorCode, string message) => new(false, errorCode, message);
}

/// <summary>
/// Service result with data payload
/// </summary>
public record ServiceResult<T>(bool Success, T? Data = default, string? ErrorCode = null, string? ErrorMessage = null)
{
    public static ServiceResult<T> Ok(T data) => new(true, data);
    public static ServiceResult<T> Fail(string errorCode, string message) => new(false, default, errorCode, message);
    public static ServiceResult<T> NotFound(string message = "Not found") => Fail("not_found", message);
    public static ServiceResult<T> Forbidden(string message = "Access denied") => Fail("forbidden", message);
}
