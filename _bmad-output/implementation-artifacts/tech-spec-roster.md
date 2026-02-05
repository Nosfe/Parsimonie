---
title: 'Roster Management'
slug: 'roster'
created: '2026-02-05'
status: 'in-progress'
stepsCompleted: []
nextStep: 1
tech_stack:
  - '.NET 10'
  - 'Angular 21'
  - 'PostgreSQL 16'
  - 'EF Core 10'
depends_on:
  - 'foundation'
---

# Tech Spec: Roster Management

## Overview

### Problem Statement
Officers need to manage the guild roster — adding characters, assigning them to users, designating mains/alts, and tracking specs. Raiders need to view and update their own characters.

### Solution
Build a roster management system with officer-controlled character creation and user self-service for spec updates. Characters are linked to Discord users and can be designated as main or alt.

### In Scope
- Character CRUD (officer-controlled creation)
- Main/alt designation per user
- Class and spec tracking
- Character-to-user linking
- Roster viewing (all members)
- Self-service spec updates

### Out of Scope
- Battle.net character import (future feature)
- Gear tracking (separate feature)
- Historical spec changes

---

## Data Model

### Updated Character Entity

```csharp
public class Character
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }  // Nullable until assigned
    public User? User { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Realm { get; set; } = "Mograine"; // Default TBC realm
    
    public WowClass Class { get; set; }
    public WowSpec PrimarySpec { get; set; }
    public WowSpec? SecondarySpec { get; set; }
    
    public bool IsMain { get; set; }
    public bool IsActive { get; set; } = true;  // Soft delete
    
    public string? Notes { get; set; }  // Officer notes
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedByUserId { get; set; }  // Officer who added
}
```

---

## Stories

### Story 1: Character Entity Updates
**Points:** 2  
**Goal:** Update Character entity with all roster fields, add migrations

**Acceptance Criteria:**
- [ ] Character entity has all fields (class, specs, isMain, isActive, notes)
- [ ] EF Core migration created and applied
- [ ] Validation: Only one main per user

**Files:**
- `Models/Entities/Character.cs` - Update entity
- `Infrastructure/Data/ParsimonieDbContext.cs` - Update config
- `Migrations/` - New migration

---

### Story 2: Roster API Endpoints
**Points:** 3  
**Goal:** Create RosterController with full CRUD for officers, limited for raiders

**Endpoints:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/roster | Raider | Get all active characters |
| GET | /api/roster/{id} | Raider | Get character by ID |
| POST | /api/roster | Officer | Create character |
| PUT | /api/roster/{id} | Officer | Update character |
| DELETE | /api/roster/{id} | Officer | Soft delete character |
| PUT | /api/roster/{id}/assign | Officer | Assign character to user |
| PUT | /api/roster/{id}/spec | Raider | Update own character's spec |
| PUT | /api/roster/{id}/main | Raider | Set as main (clears other mains) |

**DTOs:**

```csharp
// Request
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
    string Name,
    string Realm,
    WowSpec PrimarySpec,
    WowSpec? SecondarySpec,
    bool IsMain,
    bool IsActive,
    string? Notes
);

public record AssignCharacterRequest(Guid? UserId);

public record UpdateSpecRequest(WowSpec PrimarySpec, WowSpec? SecondarySpec);

// Response
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

public record RosterResponse(
    List<CharacterResponse> Characters,
    int TotalCount,
    int ActiveCount
);
```

**Files:**
- `Models/DTOs/RosterDtos.cs` - Request/Response DTOs
- `Controllers/RosterController.cs` - Full implementation
- `Services/Roster/IRosterService.cs` - Interface
- `Services/Roster/RosterService.cs` - Business logic

---

### Story 3: Roster Angular Components  
**Points:** 4  
**Goal:** Build roster UI with list, detail, and edit views

**Components:**

1. **RosterListComponent** (`/roster`)
   - Table of all characters grouped by class
   - Search/filter by name, class, spec
   - Click to view detail
   - Officer: Add button

2. **CharacterDetailComponent** (`/roster/:id`)  
   - Full character info
   - Owner info (Discord avatar + name)
   - Officer: Edit/Delete buttons
   - Owner: Spec edit button

3. **CharacterFormComponent** (modal or inline)
   - Create/Edit form
   - Class/spec dropdowns
   - User assignment (officer only)

**Files:**
- `features/roster/roster.routes.ts`
- `features/roster/roster-list.component.ts`
- `features/roster/character-detail.component.ts`
- `features/roster/character-form.component.ts`
- `core/services/roster.service.ts`

---

## UI Specifications

### Roster List Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ROSTER                                    [+ Add] (officer)│
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Class ▾] [Spec ▾] [Active only ☑]            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ── WARRIORS (3) ──────────────────────────────────────     │
│  🗡️ Tankname    Prot/Fury     @DiscordUser     [Main]       │
│  🗡️ Offname     Arms          @OtherUser                    │
│                                                             │
│  ── PALADINS (2) ──────────────────────────────────────     │
│  ✨ Healadin    Holy/Prot     @HealerUser      [Main]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Color Coding
- Use WoW class colors for character rows
- Main characters have gold badge
- Inactive characters grayed out (officer view only)

---

## Validation Rules

1. Character name: 2-12 characters, alphanumeric only
2. Realm: Must be valid TBC realm (default: Mograine)
3. Class/Spec combo: Spec must be valid for class
4. One main per user: Setting a new main clears previous
5. Only owner or officer can modify character

---

## Testing Checklist

- [ ] Officer can create character
- [ ] Officer can assign character to user
- [ ] Officer can edit any character
- [ ] Officer can soft-delete character
- [ ] Raider can view full roster
- [ ] Raider can update own character's spec
- [ ] Raider can set own character as main
- [ ] Raider cannot edit others' characters
- [ ] Setting main clears previous main for same user
- [ ] Inactive characters hidden from non-officers
