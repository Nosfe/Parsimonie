using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Parsimonie.Api.Models.DTOs.User;
using Parsimonie.Api.Services.User.Interfaces;

namespace Parsimonie.Api.Controllers;

[Authorize(Policy = "Raider")]
[ApiController]
[Route("api/[controller]")]
public class MeController : BaseController
{
    private readonly IUserService _userService;
    private readonly ILogger<MeController> _logger;

    public MeController(IUserService userService, ILogger<MeController> logger)
    {
        _userService = userService;
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
        var profile = await _userService.GetUserProfileAsync(CurrentUserId);

        if (profile == null)
        {
            _logger.LogWarning("User {UserId} not found in database", CurrentUserId);
            return NotFound(new { error = "user_not_found", message = "User not found" });
        }

        return Ok(profile);
    }

    /// <summary>
    /// Get current user's linked characters
    /// </summary>
    [HttpGet("characters")]
    [ProducesResponseType(typeof(List<CharacterDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyCharacters()
    {
        var characters = await _userService.GetUserCharactersAsync(CurrentUserId);
        return Ok(characters);
    }
}
