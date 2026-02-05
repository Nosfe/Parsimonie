using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Parsimonie.Api.Models.DTOs.Roster;
using Parsimonie.Api.Services.Roster.Interfaces;

namespace Parsimonie.Api.Controllers;

/// <summary>
/// Roster management endpoints for character CRUD
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RosterController : BaseController
{
    private readonly IRosterService _rosterService;
    private readonly ILogger<RosterController> _logger;

    public RosterController(IRosterService rosterService, ILogger<RosterController> logger)
    {
        _rosterService = rosterService;
        _logger = logger;
    }

    /// <summary>
    /// Get all roster characters (active only for non-officers)
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "Raider")]
    [ProducesResponseType(typeof(RosterResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoster([FromQuery] bool includeInactive = false)
    {
        var result = await _rosterService.GetRosterAsync(includeInactive, IsOfficer);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific character
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "Raider")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCharacter(Guid id)
    {
        var result = await _rosterService.GetCharacterAsync(id, IsOfficer);
        return ToActionResult(result);
    }

    /// <summary>
    /// Create a new character (Officer only)
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "Officer")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCharacter([FromBody] CreateCharacterRequest request)
    {
        var result = await _rosterService.CreateCharacterAsync(request, CurrentUserId);
        
        if (!result.Success)
        {
            return BadRequest(new { error = result.ErrorCode, message = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetCharacter), new { id = result.Data!.Id }, result.Data);
    }

    /// <summary>
    /// Update a character (Officer only)
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "Officer")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCharacter(Guid id, [FromBody] UpdateCharacterRequest request)
    {
        var result = await _rosterService.UpdateCharacterAsync(id, request);
        return ToActionResult(result);
    }

    /// <summary>
    /// Soft delete a character (Officer only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "Officer")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCharacter(Guid id)
    {
        var result = await _rosterService.DeleteCharacterAsync(id, CurrentUserId);
        
        if (!result.Success)
        {
            return NotFound(new { error = result.ErrorCode, message = result.ErrorMessage });
        }

        return NoContent();
    }

    /// <summary>
    /// Assign/unassign character to user (Officer only)
    /// </summary>
    [HttpPut("{id:guid}/assign")]
    [Authorize(Policy = "Officer")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignCharacter(Guid id, [FromBody] AssignCharacterRequest request)
    {
        var result = await _rosterService.AssignCharacterAsync(id, request.UserId, CurrentUserId);
        return ToActionResult(result);
    }

    /// <summary>
    /// Update own character's spec (Raider - own character only)
    /// </summary>
    [HttpPut("{id:guid}/spec")]
    [Authorize(Policy = "Raider")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateSpec(Guid id, [FromBody] UpdateSpecRequest request)
    {
        var result = await _rosterService.UpdateSpecAsync(id, request.PrimarySpec, request.SecondarySpec, CurrentUserId);
        return ToActionResult(result);
    }

    /// <summary>
    /// Set character as main (Raider - own character only)
    /// </summary>
    [HttpPut("{id:guid}/main")]
    [Authorize(Policy = "Raider")]
    [ProducesResponseType(typeof(CharacterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetAsMain(Guid id)
    {
        var result = await _rosterService.SetAsMainAsync(id, CurrentUserId);
        return ToActionResult(result);
    }

    /// <summary>
    /// Convert service result to appropriate HTTP response
    /// </summary>
    private IActionResult ToActionResult<T>(ServiceResult<T> result)
    {
        if (result.Success)
        {
            return Ok(result.Data);
        }

        return result.ErrorCode switch
        {
            "not_found" => NotFound(new { error = result.ErrorCode, message = result.ErrorMessage }),
            "forbidden" => Forbid(),
            _ => BadRequest(new { error = result.ErrorCode, message = result.ErrorMessage })
        };
    }
}
