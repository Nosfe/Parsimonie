---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
currentStep: complete
stepProgress: "complete"
status: "approved"
inputDocuments: 
  - "_bmad-output/analysis/brainstorming-session-2026-01-22.md"
  - "_bmad-output/planning-artifacts/research/technical-parsimonie-apis-research-2026-01-22.md"
date: '2026-01-22'
lastUpdated: '2026-02-04'
completedDate: '2026-02-04'
author: 'Yaji'
---

# Product Brief: Parsimonie

<!-- Content will be appended sequentially through collaborative workflow steps -->

---

## Vision Discovery Notes (In Progress)

### User Vision Statement (Raw Input)

> "I have not encountered any of those issues or pain points I just want to build a good/nice to use/useful website for my guild, I can handle the guild without it but I want to aggregate everything in one place in order for it to be more practical and more customizable"

> "Success would be if everyone on the guild would stop to go on several website and go on the parsimonie website for like 80% of their needs in wow, I would want them to say that this website saves them the trouble of looking into humongous database be it from wowhead or warcraft logs BUT without missing ANY data at all, plus a nice UX UI"

> "The automated theorycrafted loot suggestion/target list for each tier available depending on everyone current gear"

### Key Insights Captured

**Motivation:** Convenience & Delight (not problem-solving)

**Core Vision:** Aggregation + Curation + UX
- One destination for 80% of guild WoW needs
- All the data from multiple sources, none of the noise
- Beautiful, personalized UX
- Customizable to guild preferences

**Signature Feature:** Automated BiS/Loot Targeting
- Per-tier loot suggestions
- Based on each player's current gear
- Theorycrafted recommendations

**Success Metric:** "This website saves me the trouble of looking into humongous databases"

### Vision Discovery Q&A

**Q1: Wowhead Frustrations**
- Ads and clutter everywhere
- Too much irrelevant content (retail, other expansions)
- **TBC Anniversary focus required** - not a general WoW database
- Too many clicks/searches to get the info needed
- Information not organized the way a raider thinks

**Q2: WarcraftLogs Accessibility**
All approaches approved:
- ✅ Simplified summaries ("Your best parse this week")
- ✅ Automatic links to relevant logs per boss
- ✅ Quick comparisons vs guild benchmarks

**Q3: Loot Targeting Approach**
- **Hybrid calculation**: Curated BiS lists + personal gear comparison
- **Guild-wide optimization**: Consider entire roster to maximize raid DPS
- **Officer-only view**: Raid-wide loot priority recommendations visible only to officers
- Regular members see their personal upgrade path only

**Q4: Explicit Out-of-Scope**
- ❌ In-game addons — not developing WoW addons
- ❌ Voice chat — Discord handles this
- ❌ Recruiting/applications — not needed
- ❌ **NO real money features whatsoever** (no GDKP, no boosting, no transactions)
- ❌ Cross-guild coordination — single guild focus

---

## Vision Discovery Summary (Step 2 Complete ✅)

### Core Vision
**Parsimonie** is a TBC Anniversary-focused guild hub that aggregates data from Wowhead, WarcraftLogs, and Battle.net into a clean, personalized experience — eliminating the noise and reducing clicks to get the information raiders need.

### Design Principles
1. **TBC Anniversary Only** — No retail, no other expansions, no clutter
2. **Aggregation Without Noise** — All the data, none of the ads/irrelevant content
3. **Fewer Clicks** — Information organized the way raiders think
4. **Guild-First** — Personal + guild context always visible
5. **No Real Money** — Zero monetization features, ever

### Signature Features
1. **Smart Loot System**
   - Hybrid BiS: Curated lists + personal gear comparison
   - Guild-wide raid DPS optimization (officer-only view)
   - Personal upgrade path for regular members

2. **WarcraftLogs Integration**
   - Simplified parse summaries ("Your best this week")
   - Auto-linked logs per boss
   - Guild benchmark comparisons

3. **Curated TBC Database**
   - Wowhead data, filtered and organized for TBC Anniversary
   - Quick access to what matters for your class/spec

### Out of Scope
- In-game addons
- Voice chat (Discord)
- Recruiting/applications
- Real money transactions
- Cross-guild features

---

<!-- Step 2 Complete - Ready for Step 3: User/Stakeholder Discovery -->

## User & Stakeholder Discovery (Step 3)

### User Types

**1. Raiders (Regular Members)**
- Guild members who participate in raids
- Need: Personal gear info, logs, boss strats, upgrade paths
- Access: Personal data + guild-wide public info

**2. Officers (4 people)**
- Full guild management involvement (no role separation)
- All officers participate in every aspect: loot council, raid leading, class advice
- Need: Everything raiders see + guild-wide loot optimization + raid planning tools
- Access: Officer-only views for raid DPS optimization and loot priority

**3. Guild Master (Yaji)**
- Full admin access
- Configuration, roster management, all officer capabilities

### Scope Clarification
- **Raiding focus only** — Non-raiders use Discord for social/casual content
- Site is exclusively for the raiding part of guild life

### Access Model

| Content | Public | Raider | Officer | GM |
|---------|--------|--------|---------|-----|
| Guild info & about | ✅ | ✅ | ✅ | ✅ |
| Raid progress | ✅ | ✅ | ✅ | ✅ |
| Personal gear/logs | ❌ | ✅ | ✅ | ✅ |
| Personal upgrade path | ❌ | ✅ | ✅ | ✅ |
| Guild benchmarks | ❌ | ✅ | ✅ | ✅ |
| Boss strats/guides | ❌ | ✅ | ✅ | ✅ |
| Raid-wide loot optimization | ❌ | ❌ | ✅ | ✅ |
| Raid planning tools | ❌ | ❌ | ✅ | ✅ |
| Admin/config | ❌ | ❌ | ❌ | ✅ |

---

## User & Stakeholder Summary (Step 3 Complete ✅)

### Users
1. **Public visitors** — Can view raid progress and guild info (no login)
2. **Raiders** — Personal dashboard, gear, logs, upgrades, strats
3. **Officers (4)** — Raid-wide optimization views, loot priority, planning
4. **Guild Master** — Full admin, configuration, roster management

### Key Insight
Simple permission model: Public → Raider → Officer → GM (no complex role matrix needed)

<!-- Step 3 Complete - Ready for Step 4: Problem Space Deep Dive -->

---

## Problem Space Deep Dive (Step 4)

### Philosophy: Tool, Not Obligation

> "WoW is a game — this is to make it even more of one, not become a job"

- Parsimonie is **optional but valuable**
- No mandatory usage, no guilt for not checking
- Natural usage pattern: new tier launch + before raids (if they want)
- Success = raiders *want* to use it, not *have* to

### The Prepared Raider (Success Profile)

A raider using Parsimonie effectively:
1. ✅ **Knows their strats** for tonight's bosses
2. ✅ **Knows what to loot** — has a clear upgrade wishlist
3. ✅ **Parsing high blue / low purple** — tracking improvement

### Questions Raiders Currently Ask Officers

These are the questions Parsimonie should answer automatically:

| Question | Parsimonie Answer |
|----------|-------------------|
| "What are the strats for tonight?" | Tonight's Raid view with boss-by-boss strats |
| "Is this loot piece an upgrade for me?" | Personal loot advisor (yes/no + why) |
| "Which drops tonight are high-impact?" | Highlighted "impact loot" for the raid |
| "Am I improving this tier?" | Parse trend visualization over time |
| "How can I improve?" | Actionable suggestions (gear gaps, rotation tips, etc.) |

### Officer Burden Reduction

Officers currently answer these questions repeatedly in Discord. Parsimonie automates:
- Strat reminders
- Loot priority explanations
- Personal improvement guidance

---

## Problem Space Summary (Step 4 Complete ✅)

### Core Friction Eliminated
Not pain points — **convenience gains**:
1. No more alt-tabbing to 4 different sites
2. No more asking officers basic questions
3. No more manual gear comparison
4. No more hunting for TBC-specific info in cluttered databases

### Design Constraint
**Zero obligation** — The site should feel like a helpful companion, not homework

<!-- Step 4 Complete - Ready for Step 5: Solution Space -->

---

## Solution Space (Step 5)

### Authentication
- **Discord OAuth** — Everyone has Discord, simple login flow
- Link Discord account to Battle.net character (manual or via Battle.net API for verification)

### MVP Features

| Feature | Description |
|---------|-------------|
| **Tonight's Raid** | Boss strats with overview, officer notes, and role assignments |
| **My Gear** | Current equipped gear with upgrade recommendations |
| **My Parses** | Parse history with trend visualization (improving?) |
| **Loot Wishlist** | Personal upgrade targets for current tier |
| **Improvement Tips** | Spec-aware actionable suggestions based on logs |
| **Guild Progress** | Public-facing kill progress (which bosses down) |

### Boss Strat System (Detailed)

Each boss page includes:

1. **Overview** — Curated summary from Wowhead guide (condensed, TBC-focused)
2. **Officer Notes** — Custom notes written by officers for guild-specific adjustments
3. **Role Attribution Sheet** — Assignments per encounter:
   - 🛡️ Tank assignments (MT1, MT2, OT)
   - 💚 Healer assignments (tank healers, raid healers, groups)
   - 🔇 Dispel rotations
   - 🦵 Kick/interrupt rotations
   - 🏃 Kiting assignments
   - ⚡ Special role mechanics (soakers, baiters, etc.)

### Spec-Aware Improvement System (Detailed)

Intelligent tips that understand **what matters for each spec**:

| Spec | Primary Metrics | Example Tips |
|------|-----------------|--------------|
| Affliction Warlock | DoT uptime, Corruption/UA coverage | "Your Corruption uptime was 87% — aim for 95%+" |
| Destruction Warlock | Raw DPS, burst timing | "You're 12% behind other Destro locks — check Immolate uptime" |
| Shadow Priest | Mana battery uptime, VT coverage | "VT dropped 3 times on Brutallus — raid lost mana" |
| DS/Balance Druid | Innervate usage, Faerie Fire uptime | "Innervate used 1/2 times possible this fight" |
| Prot Paladin | TPS, Holy Shield uptime | "Holy Shield dropped during add phase" |
| Resto Shaman | Chain Heal efficiency, totem uptime | "Mana Tide used 0 times — save healers mana" |

**Configuration:**
- 🤖 **Auto-configured**: Default spec profiles with known TBC meta priorities
- ✏️ **Officer-editable**: Override or customize metrics per spec
- 🎯 **Thresholds**: Set guild benchmarks (e.g., "DoT uptime < 90% = warning")

### Nice-to-Have (Post-MVP)

| Feature | Description |
|---------|-------------|
| **Raid-Wide Loot Optimizer** | Officer view: who should get what for max raid DPS |
| **Calendar/Schedule** | Raid times integration |
| **Class Guides** | TBC-specific rotation/gearing guides |

### Role Attribution System

- **Built into website** — Officers edit directly in Parsimonie
- **Visible to all raiders** — Everyone sees their assignments before raid
- Per-boss assignment sheets accessible from Tonight's Raid view

### Roster Management System

Officers manage the guild roster directly in Parsimonie:

| Feature | Description |
|---------|-------------|
| **Character → Discord Link** | Officers assign WoW characters to Discord users |
| **Primary Raider** | Mark each player's main character |
| **Rerolls/Alts** | Track alt characters per player |
| **Roster View** | Full raid roster with mains + alts |
| **Spec Tracking** | Primary spec and offspec per character |

This doubles as:
- 📋 **Roster definition** — Who's in the raid team
- 🔄 **Alt tracking** — Who has viable rerolls
- 🎯 **Loot context** — System knows if gear is for main vs alt

---

## Solution Space Summary (Step 5 Complete ✅)

### MVP Feature Set (Final)

1. **Tonight's Raid** — Boss strats + role assignments + officer notes
2. **My Gear** — Current gear + upgrade recommendations
3. **My Parses** — Parse history + trend visualization
4. **Loot Wishlist** — Personal upgrade targets
5. **Improvement Tips** — Spec-aware suggestions (auto + officer-customizable)
6. **Guild Progress** — Public raid progress
7. **Roster Management** — Character linking, mains/alts, spec tracking
8. **Role Attribution Editor** — In-app assignment management

### Auth & Linking
- **Discord OAuth** for login
- **Officer-assigned** character linking (no Battle.net OAuth needed for MVP)

### Post-MVP
- Raid-wide loot optimizer
- Calendar/schedule integration
- Class guides

<!-- Step 5 Complete - Ready for Step 6: MVP Scope & Prioritization -->

---

## MVP Scope & Prioritization (Step 6)

### Launch Timeline
- No fixed date — "when it's ready"
- Quality over speed

### MVP Phases (Confirmed)

**Phase 1: Foundation**
1. Discord OAuth login
2. Roster Management (character linking, mains/alts)
3. Guild Progress (public page)

**Phase 2: Raider Core**
4. My Gear (with upgrade recommendations)
5. Loot Wishlist
6. My Parses (with trends)

**Phase 3: Raid Prep**
7. Tonight's Raid (strats + role attributions)
8. Improvement Tips (spec-aware)

### Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 21 |
| **Backend** | .NET 10 |
| **Database** | PostgreSQL |
| **API Client** | Refit (minimum) |
| **Hosting** | Azure |
| **CI/CD** | GitHub Actions |
| **Architecture** | Clean Architecture |
| **Principles** | SOLID |

### Testing Requirements

| Type | Tool/Approach |
|------|---------------|
| **Unit Tests** | Required for all layers |
| **Test Automation** | Selenium |
| **Coverage** | TBD (recommend 80%+ for business logic) |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Angular 21 SPA                       │
│                  (Azure Static Web Apps)                │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   .NET 10 Web API                       │
│                 (Azure App Service)                     │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer (Controllers/Endpoints)            │
├─────────────────────────────────────────────────────────┤
│  Application Layer (Use Cases, DTOs, Interfaces)       │
├─────────────────────────────────────────────────────────┤
│  Domain Layer (Entities, Business Logic)               │
├─────────────────────────────────────────────────────────┤
│  Infrastructure Layer (Refit clients, DB, External)    │
│  - WarcraftLogs API (Refit)                            │
│  - Battle.net API (Refit)                              │
│  - Discord OAuth                                        │
│  - PostgreSQL (Azure Database for PostgreSQL)          │
└─────────────────────────────────────────────────────────┘
```

### Azure Services (Planned)

| Service | Purpose |
|---------|---------|
| Azure Static Web Apps | Angular frontend hosting |
| Azure App Service | .NET API hosting |
| Azure Database for PostgreSQL | Database |
| Azure Key Vault | Secrets management (API keys, OAuth secrets) |
| Azure Application Insights | Monitoring & logging |

### CI/CD Pipeline (GitHub Actions)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push to   │ ──▶ │   Build &   │ ──▶ │  Deploy to  │
│    main     │     │    Test     │     │    Azure    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │           │
              Unit Tests   Selenium
```

---

## MVP Scope Summary (Step 6 Complete ✅)

### Confirmed Decisions
- **Phases**: Foundation → Raider Core → Raid Prep
- **Timeline**: No fixed date, quality-first
- **Stack**: Angular 21 + .NET 10 + PostgreSQL
- **Hosting**: Azure (Static Web Apps + App Service + PostgreSQL)
- **CI/CD**: GitHub Actions
- **Architecture**: Clean Architecture, SOLID
- **Testing**: Unit tests + Selenium automation

<!-- Step 6 Complete - Product Brief Ready for Review -->

