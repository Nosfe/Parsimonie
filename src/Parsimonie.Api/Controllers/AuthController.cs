using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Parsimonie.Api.Models.DTOs.Auth;
using Parsimonie.Api.Services.Auth.Interfaces;
using Parsimonie.Api.Services.Roster.Interfaces;

namespace Parsimonie.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Initiates Discord OAuth flow
    /// </summary>
    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? returnUrl = null)
    {
        var state = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        
        // Store state in a cookie for validation on callback
        Response.Cookies.Append("oauth_state", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(10)
        });

        if (!string.IsNullOrEmpty(returnUrl))
        {
            Response.Cookies.Append("return_url", returnUrl, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(10)
            });
        }

        var authUrl = _authService.GetAuthorizationUrl(state);
        return Redirect(authUrl);
    }

    /// <summary>
    /// Discord OAuth callback - validates guild membership and role
    /// </summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        // Validate state
        var savedState = Request.Cookies["oauth_state"];
        if (string.IsNullOrEmpty(savedState) || savedState != state)
        {
            _logger.LogWarning("OAuth state mismatch");
            return BadRequest(new AuthErrorDto("invalid_state", "OAuth state validation failed"));
        }

        // Clear state cookie
        Response.Cookies.Delete("oauth_state");

        var result = await _authService.ProcessCallbackAsync(code);

        if (!result.Success)
        {
            return result.ErrorCode switch
            {
                "not_guild_member" or "missing_role" => Unauthorized(new AuthErrorDto(result.ErrorCode, result.ErrorMessage!)),
                _ => BadRequest(new AuthErrorDto(result.ErrorCode!, result.ErrorMessage!))
            };
        }

        var loginResponse = new LoginResponseDto(
            AccessToken: result.Data!.AccessToken,
            RefreshToken: result.Data.RefreshToken,
            ExpiresAt: result.Data.ExpiresAt,
            User: result.Data.User
        );

        // Get return URL if present
        var returnUrl = Request.Cookies["return_url"];
        Response.Cookies.Delete("return_url");

        // For frontend integration, redirect with tokens in URL fragment
        if (!string.IsNullOrEmpty(returnUrl))
        {
            var redirectUrl = $"{returnUrl}#access_token={result.Data.AccessToken}&refresh_token={result.Data.RefreshToken}";
            return Redirect(redirectUrl);
        }

        return Ok(loginResponse);
    }

    /// <summary>
    /// Refresh access token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        
        if (!result.Success)
        {
            return Unauthorized(new AuthErrorDto(result.ErrorCode!, result.ErrorMessage!));
        }

        return Ok(new LoginResponseDto(
            AccessToken: result.Data!.AccessToken,
            RefreshToken: result.Data.RefreshToken,
            ExpiresAt: result.Data.ExpiresAt,
            User: result.Data.User
        ));
    }

    /// <summary>
    /// Logout - revoke refresh token
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto request)
    {
        await _authService.RevokeTokenAsync(request.RefreshToken);
        return NoContent();
    }
}
