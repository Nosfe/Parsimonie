using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Models.DTOs.User;
using Parsimonie.Api.Models.Entities;
using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Controllers;

[Authorize(Policy = "Officer")]
[ApiController]
[Route("api/[controller]")]
public class RosterController : BaseController
{
    private readonly ParsimonieDbContext _dbContext;
    private readonly ILogger<RosterController> _logger;

    public RosterController(ParsimonieDbContext dbContext, ILogger<RosterController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Get all users with their characters (Officer only)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<RosterMemberDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetRoster()
    {
        var users = await _dbContext.Users
            .Include(u => u.Characters)
            .OrderBy(u => u.DiscordUsername)
            .Select(u => new RosterMemberDto(
                u.Id,
                u.DiscordId,
                u.DiscordUsername,
                u.DiscordAvatar,
                GetRoleStrings(u.Roles),
                u.LastLoginAt,
                u.Characters.Select(c => new CharacterDto(
                    c.Id,
                    c.Name,
                    c.Realm,
                    c.Class,
                    c.Spec,
                    c.IsMain,
                    c.CreatedAt
                )).ToList()
            ))
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>
    /// Assign a character to a user (Officer only)
    /// </summary>
    [HttpPost("{userId}/characters")]
    [ProducesResponseType(typeof(CharacterDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignCharacter(Guid userId, [FromBody] AssignCharacterRequest request)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { error = "user_not_found", message = "User not found" });
        }

        // Check if character already exists
        var existingChar = await _dbContext.Characters
            .FirstOrDefaultAsync(c => c.Name == request.Name && c.Realm == request.Realm);

        if (existingChar != null)
        {
            return BadRequest(new { error = "character_exists", message = "Character already assigned to a user" });
        }

        // If setting as main, unset other mains
        if (request.IsMain)
        {
            var currentMains = await _dbContext.Characters
                .Where(c => c.UserId == userId && c.IsMain)
                .ToListAsync();
            
            foreach (var main in currentMains)
            {
                main.IsMain = false;
            }
        }

        var character = new Character
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Realm = request.Realm,
            Class = request.Class,
            Spec = request.Spec,
            IsMain = request.IsMain,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Characters.Add(character);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Character {CharName}-{Realm} assigned to user {UserId} by {OfficerId}",
            character.Name, character.Realm, userId, CurrentUserId);

        var dto = new CharacterDto(
            character.Id,
            character.Name,
            character.Realm,
            character.Class,
            character.Spec,
            character.IsMain,
            character.CreatedAt
        );

        return CreatedAtAction(nameof(GetRoster), dto);
    }

    /// <summary>
    /// Update a character's details (Officer only)
    /// </summary>
    [HttpPut("characters/{characterId}")]
    [ProducesResponseType(typeof(CharacterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCharacter(Guid characterId, [FromBody] UpdateCharacterRequest request)
    {
        var character = await _dbContext.Characters.FindAsync(characterId);
        if (character == null)
        {
            return NotFound(new { error = "character_not_found", message = "Character not found" });
        }

        // If setting as main, unset other mains
        if (request.IsMain && !character.IsMain)
        {
            var currentMains = await _dbContext.Characters
                .Where(c => c.UserId == character.UserId && c.IsMain && c.Id != characterId)
                .ToListAsync();
            
            foreach (var main in currentMains)
            {
                main.IsMain = false;
            }
        }

        character.Spec = request.Spec;
        character.IsMain = request.IsMain;
        character.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(new CharacterDto(
            character.Id,
            character.Name,
            character.Realm,
            character.Class,
            character.Spec,
            character.IsMain,
            character.CreatedAt
        ));
    }

    /// <summary>
    /// Remove a character assignment (Officer only)
    /// </summary>
    [HttpDelete("characters/{characterId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveCharacter(Guid characterId)
    {
        var character = await _dbContext.Characters.FindAsync(characterId);
        if (character == null)
        {
            return NotFound(new { error = "character_not_found", message = "Character not found" });
        }

        _dbContext.Characters.Remove(character);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Character {CharId} removed by {OfficerId}", characterId, CurrentUserId);

        return NoContent();
    }

    private static string[] GetRoleStrings(UserRole roles)
    {
        var roleList = new List<string>();
        if (roles.HasFlag(UserRole.GM)) roleList.Add("GM");
        if (roles.HasFlag(UserRole.Officer)) roleList.Add("Officer");
        if (roles.HasFlag(UserRole.Raider)) roleList.Add("Raider");
        return roleList.ToArray();
    }
}

public record RosterMemberDto(
    Guid Id,
    string DiscordId,
    string Username,
    string? Avatar,
    string[] Roles,
    DateTime LastLoginAt,
    List<CharacterDto> Characters
);

public record AssignCharacterRequest(
    string Name,
    string Realm,
    WowClass Class,
    WowSpec Spec,
    bool IsMain
);

public record UpdateCharacterRequest(
    WowSpec Spec,
    bool IsMain
);
