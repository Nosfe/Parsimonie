using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Models.DTOs.Roster;

public record RosterResponse(
    List<CharacterResponse> Characters,
    int TotalCount,
    int ActiveCount
);

public record CharacterResponse(
    Guid Id,
    string Name,
    string Realm,
    WowClass Class,
    string ClassName,
    WowSpec PrimarySpec,
    string PrimarySpecName,
    WowSpec? SecondarySpec,
    string? SecondarySpecName,
    bool IsMain,
    bool IsActive,
    string? Notes,
    CharacterOwnerResponse? Owner
);

public record CharacterOwnerResponse(
    Guid Id,
    string Username,
    string? Avatar
);

public record CreateCharacterRequest(
    string Name,
    string Realm,
    WowClass Class,
    WowSpec PrimarySpec,
    WowSpec? SecondarySpec,
    Guid? UserId,
    bool IsMain,
    string? Notes
);

public record UpdateCharacterRequest(
    string? Name,
    string Realm,
    WowSpec PrimarySpec,
    WowSpec? SecondarySpec,
    bool IsMain,
    bool IsActive,
    string? Notes
);

public record AssignCharacterRequest(Guid? UserId);

public record UpdateSpecRequest(WowSpec PrimarySpec, WowSpec? SecondarySpec);
