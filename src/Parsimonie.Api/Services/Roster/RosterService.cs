using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Parsimonie.Api.Infrastructure.Data;
using Parsimonie.Api.Models.DTOs.Roster;
using Parsimonie.Api.Models.Entities;
using Parsimonie.Api.Models.Enums;
using Parsimonie.Api.Services.Roster.Interfaces;

namespace Parsimonie.Api.Services.Roster;

/// <summary>
/// Service implementation for roster/character management operations
/// </summary>
public class RosterService : IRosterService
{
    private readonly ParsimonieDbContext _dbContext;
    private readonly ILogger<RosterService> _logger;

    public RosterService(ParsimonieDbContext dbContext, ILogger<RosterService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<RosterResponse> GetRosterAsync(bool includeInactive, bool isOfficer)
    {
        var query = _dbContext.Characters
            .Include(c => c.User)
            .AsQueryable();
        
        // Non-officers only see active characters
        if (!isOfficer || !includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }

        var characters = await query
            .OrderBy(c => c.Class)
            .ThenByDescending(c => c.IsMain)
            .ThenBy(c => c.Name)
            .Select(c => MapToResponse(c, isOfficer))
            .ToListAsync();

        var totalCount = await _dbContext.Characters.CountAsync();
        var activeCount = await _dbContext.Characters.Where(c => c.IsActive).CountAsync();

        return new RosterResponse(characters, totalCount, activeCount);
    }

    public async Task<ServiceResult<CharacterResponse>> GetCharacterAsync(Guid id, bool isOfficer)
    {
        var character = await _dbContext.Characters
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        // Non-officers can't see inactive characters
        if (!character.IsActive && !isOfficer)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, isOfficer));
    }

    public async Task<ServiceResult<CharacterResponse>> CreateCharacterAsync(CreateCharacterRequest request, Guid createdByUserId)
    {
        // Validate name
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length < 2 || request.Name.Length > 12)
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_name", "Character name must be 2-12 characters");
        }

        // Check for duplicate - using ToUpperInvariant for EF Core SQL translation (case-insensitive)
        var nameLower = request.Name.ToUpperInvariant();
        var realmLower = request.Realm.ToUpperInvariant();
#pragma warning disable CA1862 // EF Core database query - StringComparison cannot be translated to SQL
        var exists = await _dbContext.Characters
            .AnyAsync(c => c.Name.ToUpperInvariant() == nameLower && c.Realm.ToUpperInvariant() == realmLower);
#pragma warning restore CA1862
        
        if (exists)
        {
            return ServiceResult<CharacterResponse>.Fail("character_exists", "Character already exists on this realm");
        }

        // Validate spec matches class
        if (!IsValidSpecForClass(request.Class, request.PrimarySpec))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Primary spec is not valid for this class");
        }

        if (request.SecondarySpec.HasValue && !IsValidSpecForClass(request.Class, request.SecondarySpec.Value))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Secondary spec is not valid for this class");
        }

        // If setting as main and user is specified, unset other mains
        if (request.IsMain && request.UserId.HasValue)
        {
            await ClearMainForUserAsync(request.UserId.Value);
        }

        var character = new Character
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Name = request.Name,
            Realm = request.Realm,
            Class = request.Class,
            PrimarySpec = request.PrimarySpec,
            SecondarySpec = request.SecondarySpec,
            IsMain = request.IsMain,
            IsActive = true,
            Notes = request.Notes,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Characters.Add(character);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Character {CharName}-{Realm} created by {OfficerId}", 
            character.Name, character.Realm, createdByUserId);

        // Reload with user for response
        await _dbContext.Entry(character).Reference(c => c.User).LoadAsync();

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, true));
    }

    public async Task<ServiceResult<CharacterResponse>> UpdateCharacterAsync(Guid id, UpdateCharacterRequest request)
    {
        var character = await _dbContext.Characters
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        // Check for duplicate name/realm if changing
        if (!string.IsNullOrEmpty(request.Name) && 
            (!string.Equals(request.Name, character.Name, StringComparison.OrdinalIgnoreCase) || 
             !string.Equals(request.Realm, character.Realm, StringComparison.OrdinalIgnoreCase)))
        {
            var nameLower = request.Name.ToUpperInvariant();
            var realmLower = request.Realm.ToUpperInvariant();
#pragma warning disable CA1862 // EF Core database query - StringComparison cannot be translated to SQL
            var exists = await _dbContext.Characters
                .AnyAsync(c => c.Id != id && c.Name.ToUpperInvariant() == nameLower && c.Realm.ToUpperInvariant() == realmLower);
#pragma warning restore CA1862
            
            if (exists)
            {
                return ServiceResult<CharacterResponse>.Fail("character_exists", "Character already exists on this realm");
            }
            
            character.Name = request.Name;
            character.Realm = request.Realm;
        }

        // Validate specs
        if (!IsValidSpecForClass(character.Class, request.PrimarySpec))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Primary spec is not valid for this class");
        }

        if (request.SecondarySpec.HasValue && !IsValidSpecForClass(character.Class, request.SecondarySpec.Value))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Secondary spec is not valid for this class");
        }

        // If setting as main, unset other mains
        if (request.IsMain && !character.IsMain && character.UserId.HasValue)
        {
            await ClearMainForUserAsync(character.UserId.Value, character.Id);
        }

        character.PrimarySpec = request.PrimarySpec;
        character.SecondarySpec = request.SecondarySpec;
        character.IsMain = request.IsMain;
        character.IsActive = request.IsActive;
        character.Notes = request.Notes;
        character.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, true));
    }

    public async Task<ServiceResult> DeleteCharacterAsync(Guid id, Guid deletedByUserId)
    {
        var character = await _dbContext.Characters.FindAsync(id);
        
        if (character == null)
        {
            return ServiceResult.Fail("character_not_found", "Character not found");
        }

        character.IsActive = false;
        character.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Character {CharId} soft-deleted by {OfficerId}", id, deletedByUserId);

        return ServiceResult.Ok();
    }

    public async Task<ServiceResult<CharacterResponse>> AssignCharacterAsync(Guid id, Guid? userId, Guid assignedByUserId)
    {
        var character = await _dbContext.Characters
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (character == null)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        // Validate user exists if assigning
        if (userId.HasValue)
        {
            var userExists = await _dbContext.Users.AnyAsync(u => u.Id == userId.Value);
            if (!userExists)
            {
                return ServiceResult<CharacterResponse>.Fail("user_not_found", "User not found");
            }

            // If character is main, clear other mains for this user
            if (character.IsMain)
            {
                await ClearMainForUserAsync(userId.Value, character.Id);
            }
        }

        character.UserId = userId;
        character.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        // Reload user for response
        await _dbContext.Entry(character).Reference(c => c.User).LoadAsync();

        _logger.LogInformation("Character {CharId} assigned to user {UserId} by {OfficerId}", 
            id, userId, assignedByUserId);

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, true));
    }

    public async Task<ServiceResult<CharacterResponse>> UpdateSpecAsync(Guid characterId, WowSpec primarySpec, WowSpec? secondarySpec, Guid userId)
    {
        var character = await _dbContext.Characters
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == characterId);

        if (character == null || !character.IsActive)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        // Check ownership
        if (character.UserId != userId)
        {
            return ServiceResult<CharacterResponse>.Forbidden("You can only update your own characters");
        }

        // Validate specs
        if (!IsValidSpecForClass(character.Class, primarySpec))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Primary spec is not valid for this class");
        }

        if (secondarySpec.HasValue && !IsValidSpecForClass(character.Class, secondarySpec.Value))
        {
            return ServiceResult<CharacterResponse>.Fail("invalid_spec", "Secondary spec is not valid for this class");
        }

        character.PrimarySpec = primarySpec;
        character.SecondarySpec = secondarySpec;
        character.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, false));
    }

    public async Task<ServiceResult<CharacterResponse>> SetAsMainAsync(Guid characterId, Guid userId)
    {
        var character = await _dbContext.Characters
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == characterId);

        if (character == null || !character.IsActive)
        {
            return ServiceResult<CharacterResponse>.NotFound("Character not found");
        }

        // Check ownership
        if (character.UserId != userId)
        {
            return ServiceResult<CharacterResponse>.Forbidden("You can only modify your own characters");
        }

        // Clear other mains
        await ClearMainForUserAsync(userId, character.Id);

        character.IsMain = true;
        character.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return ServiceResult<CharacterResponse>.Ok(MapToResponse(character, false));
    }

    #region Private Helpers

    private async Task ClearMainForUserAsync(Guid userId, Guid? excludeCharacterId = null)
    {
        var mains = await _dbContext.Characters
            .Where(c => c.UserId == userId && c.IsMain && c.Id != excludeCharacterId)
            .ToListAsync();

        foreach (var main in mains)
        {
            main.IsMain = false;
            main.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static CharacterResponse MapToResponse(Character c, bool includeNotes)
    {
        return new CharacterResponse(
            c.Id,
            c.Name,
            c.Realm,
            c.Class,
            GetClassName(c.Class),
            c.PrimarySpec,
            GetSpecName(c.PrimarySpec),
            c.SecondarySpec,
            c.SecondarySpec.HasValue ? GetSpecName(c.SecondarySpec.Value) : null,
            c.IsMain,
            c.IsActive,
            includeNotes ? c.Notes : null,
            c.User != null ? new CharacterOwnerResponse(c.User.Id, c.User.DiscordUsername, c.User.DiscordAvatar) : null
        );
    }

    private static bool IsValidSpecForClass(WowClass wowClass, WowSpec spec)
    {
        var specValue = (int)spec;
        var classValue = (int)wowClass;
        
        // Specs are numbered as ClassId * 100 + SpecIndex
        return specValue / 100 == classValue;
    }

    private static string GetClassName(WowClass wowClass) => wowClass switch
    {
        WowClass.Warrior => "Warrior",
        WowClass.Paladin => "Paladin",
        WowClass.Hunter => "Hunter",
        WowClass.Rogue => "Rogue",
        WowClass.Priest => "Priest",
        WowClass.Shaman => "Shaman",
        WowClass.Mage => "Mage",
        WowClass.Warlock => "Warlock",
        WowClass.Druid => "Druid",
        _ => "Unknown"
    };

    private static string GetSpecName(WowSpec spec) => spec switch
    {
        // Warriors
        WowSpec.Arms => "Arms",
        WowSpec.Fury => "Fury",
        WowSpec.ProtectionWarrior => "Protection",
        // Paladins
        WowSpec.HolyPaladin => "Holy",
        WowSpec.ProtectionPaladin => "Protection",
        WowSpec.Retribution => "Retribution",
        // Hunters
        WowSpec.BeastMastery => "Beast Mastery",
        WowSpec.Marksmanship => "Marksmanship",
        WowSpec.Survival => "Survival",
        // Rogues
        WowSpec.Assassination => "Assassination",
        WowSpec.Combat => "Combat",
        WowSpec.Subtlety => "Subtlety",
        // Priests
        WowSpec.Discipline => "Discipline",
        WowSpec.HolyPriest => "Holy",
        WowSpec.Shadow => "Shadow",
        // Shamans
        WowSpec.Elemental => "Elemental",
        WowSpec.Enhancement => "Enhancement",
        WowSpec.RestorationShaman => "Restoration",
        // Mages
        WowSpec.Arcane => "Arcane",
        WowSpec.Fire => "Fire",
        WowSpec.FrostMage => "Frost",
        // Warlocks
        WowSpec.Affliction => "Affliction",
        WowSpec.Demonology => "Demonology",
        WowSpec.Destruction => "Destruction",
        // Druids
        WowSpec.Balance => "Balance",
        WowSpec.FeralCombat => "Feral",
        WowSpec.RestorationDruid => "Restoration",
        _ => "Unknown"
    };

    #endregion
}
