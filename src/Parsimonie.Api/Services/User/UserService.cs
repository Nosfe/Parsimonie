using Microsoft.EntityFrameworkCore;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Models.DTOs.User;
using Parsimonie.Api.Models.Enums;
using Parsimonie.Api.Services.User.Interfaces;

namespace Parsimonie.Api.Services.User;

/// <summary>
/// Service implementation for user profile operations
/// </summary>
public class UserService : IUserService
{
    private readonly ParsimonieDbContext _dbContext;

    public UserService(ParsimonieDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MeResponseDto?> GetUserProfileAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.Characters)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return null;
        }

        return new MeResponseDto(
            Id: user.Id,
            DiscordId: user.DiscordId,
            Username: user.DiscordUsername,
            Avatar: user.DiscordAvatar,
            Roles: GetRoleStrings(user.Roles),
            CreatedAt: user.CreatedAt,
            LastLoginAt: user.LastLoginAt,
            Characters: user.Characters.Where(c => c.IsActive).Select(c => new CharacterDto(
                Id: c.Id,
                Name: c.Name,
                Realm: c.Realm,
                Class: c.Class,
                PrimarySpec: c.PrimarySpec,
                SecondarySpec: c.SecondarySpec,
                IsMain: c.IsMain,
                IsActive: c.IsActive,
                CreatedAt: c.CreatedAt
            )).ToList()
        );
    }

    public async Task<List<CharacterDto>> GetUserCharactersAsync(Guid userId)
    {
        return await _dbContext.Characters
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.IsMain)
            .ThenBy(c => c.Name)
            .Select(c => new CharacterDto(
                c.Id,
                c.Name,
                c.Realm,
                c.Class,
                c.PrimarySpec,
                c.SecondarySpec,
                c.IsMain,
                c.IsActive,
                c.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<UserBasicInfo?> GetUserBasicInfoAsync(Guid userId)
    {
        return await _dbContext.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserBasicInfo(u.Id, u.DiscordUsername, u.DiscordAvatar))
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UserExistsAsync(Guid userId)
    {
        return await _dbContext.Users.AnyAsync(u => u.Id == userId);
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
