using Parsimonie.Api.Models.Enums;

namespace Parsimonie.Api.Models.DTOs.User;

public record MeResponseDto(
    Guid Id,
    string DiscordId,
    string Username,
    string? Avatar,
    string[] Roles,
    DateTime CreatedAt,
    DateTime LastLoginAt,
    List<CharacterDto> Characters
);

public record CharacterDto(
    Guid Id,
    string Name,
    string Realm,
    WowClass Class,
    WowSpec Spec,
    bool IsMain,
    DateTime CreatedAt
);
