using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Models.DTOs.User;
using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Controllers;

[Authorize(Policy = "Raider")]
[ApiController]
[Route("api/[controller]")]
public class MeController : BaseController
{
    private readonly ParsimonieDbContext _dbContext;
    private readonly ILogger<MeController> _logger;

    public MeController(ParsimonieDbContext dbContext, ILogger<MeController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Get current user profile with linked characters
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(MeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMe()
    {
        var user = await _dbContext.Users
            .Include(u => u.Characters)
            .FirstOrDefaultAsync(u => u.Id == CurrentUserId);

        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found in database", CurrentUserId);
            return NotFound(new { error = "user_not_found", message = "User not found" });
        }

        var response = new MeResponseDto(
            Id: user.Id,
            DiscordId: user.DiscordId,
            Username: user.DiscordUsername,
            Avatar: user.DiscordAvatar,
            Roles: GetRoleStrings(user.Roles),
            CreatedAt: user.CreatedAt,
            LastLoginAt: user.LastLoginAt,
            Characters: user.Characters.Select(c => new CharacterDto(
                Id: c.Id,
                Name: c.Name,
                Realm: c.Realm,
                Class: c.Class,
                Spec: c.Spec,
                IsMain: c.IsMain,
                CreatedAt: c.CreatedAt
            )).ToList()
        );

        return Ok(response);
    }

    /// <summary>
    /// Get current user's linked characters
    /// </summary>
    [HttpGet("characters")]
    [ProducesResponseType(typeof(List<CharacterDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyCharacters()
    {
        var characters = await _dbContext.Characters
            .Where(c => c.UserId == CurrentUserId)
            .OrderByDescending(c => c.IsMain)
            .ThenBy(c => c.Name)
            .Select(c => new CharacterDto(
                c.Id,
                c.Name,
                c.Realm,
                c.Class,
                c.Spec,
                c.IsMain,
                c.CreatedAt
            ))
            .ToListAsync();

        return Ok(characters);
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
