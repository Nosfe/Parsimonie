namespace Parsimonie.Api.Infrastructure.Extensions;

public class JwtOptions
{
    public const string SectionName = "Jwt";
    
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "Parsimonie";
    public string Audience { get; set; } = "Parsimonie";
    public int AccessTokenExpirationMinutes { get; set; } = 1440; // 24 hours
    public int RefreshTokenExpirationDays { get; set; } = 7;
}
