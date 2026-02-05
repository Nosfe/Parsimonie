using Microsoft.AspNetCore.Mvc;

namespace Parsimonie.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var userIdClaim = User.FindFirst("sub")?.Value 
                           ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var id) ? id : Guid.Empty;
        }
    }

    protected string CurrentUserDiscordId
    {
        get
        {
            return User.FindFirst("discord_id")?.Value ?? string.Empty;
        }
    }

    protected bool IsOfficer => User.HasClaim("role", "Officer") || User.HasClaim("role", "GM");
    
    protected bool IsGM => User.HasClaim("role", "GM");
}
