using Microsoft.EntityFrameworkCore;
using Parsimonie.Api.Models.Entities;

namespace Parsimonie.Api.Infrastructure.Data;

public class ParsimonieDbContext : DbContext
{
    public ParsimonieDbContext(DbContextOptions<ParsimonieDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Character> Characters => Set<Character>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.DiscordId).IsUnique();
            entity.Property(e => e.DiscordId).HasMaxLength(32).IsRequired();
            entity.Property(e => e.DiscordUsername).HasMaxLength(100).IsRequired();
            entity.Property(e => e.DiscordAvatar).HasMaxLength(256);
        });

        // Character configuration
        modelBuilder.Entity<Character>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Name, e.Realm });
            entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Realm).HasMaxLength(50).IsRequired();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Characters)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // RefreshToken configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token);
            entity.Property(e => e.Token).HasMaxLength(512).IsRequired();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
