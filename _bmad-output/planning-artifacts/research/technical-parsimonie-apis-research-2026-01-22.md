---
stepsCompleted: [1, 2]
inputDocuments: 
  - "_bmad-output/analysis/brainstorming-session-2026-01-22.md"
workflowType: 'research'
lastStep: 2
research_type: 'technical'
research_topic: 'Parsimonie WoW Guild Platform - API & Data Sources'
research_goals: 'Evaluate technical feasibility of MVP features by researching available APIs and data sources for TBC Classic Anniversary'
user_name: 'Yaji'
date: '2026-01-22'
web_research_enabled: true
source_verification: true
---

# Technical Research Report: Parsimonie API & Data Sources

**Date:** 2026-01-22
**Author:** Yaji
**Research Type:** Technical

---

## Executive Summary

This research evaluates the APIs and data sources available for building Parsimonie, a TBC Classic Anniversary guild management platform. **The findings are positive** - all core MVP features are technically feasible with existing APIs.

| Data Source | Availability | Confidence |
|-------------|--------------|------------|
| Battle.net API (Classic) | ✅ Full support | High |
| WarcraftLogs API v2 | ✅ Full support | High |
| Wowhead Tooltips | ✅ Embed support | High |
| Discord API | ✅ Full support | High |
| RCLootCouncil | ⚠️ Manual export | Medium |

---

## 1. Battle.net / WoW Classic API

### Overview

Blizzard provides a comprehensive API for World of Warcraft Classic through their Battle.net Developer Portal.

**Source:** [Battle.net Developer Documentation - WoW Classic](https://community.developer.battle.net/documentation/world-of-warcraft-classic) [High Confidence]

### Available Endpoints

#### Game Data APIs
| Endpoint | Path | Use Case |
|----------|------|----------|
| Connected Realms | `/data/wow/connected-realm/` | Server/realm information |
| Creatures | `/data/wow/creature/` | NPC/boss data |
| Items | `/data/wow/item/{itemId}` | Item details, stats |
| Item Media | `/data/wow/media/item/{itemId}` | Item icons |
| Guilds | `/data/wow/guild/{realmSlug}/{guildName}` | Guild roster |

**Source:** [WoW Classic Game Data APIs](https://community.developer.battle.net/documentation/world-of-warcraft-classic/game-data-apis) [High Confidence]

#### Profile APIs (Key for Parsimonie!)
| Endpoint | Path | Use Case |
|----------|------|----------|
| Character Profile | `/profile/wow/character/{realmSlug}/{characterName}` | Basic character info |
| **Character Equipment** | `/profile/wow/character/{realmSlug}/{characterName}/equipment` | **Current gear** ⭐ |
| Character Appearance | `/profile/wow/character/{realmSlug}/{characterName}/appearance` | Visual info |
| Character Media | `/profile/wow/character/{realmSlug}/{characterName}/character-media` | Character images |
| Character PvP | `/profile/wow/character/{realmSlug}/{characterName}/pvp-bracket/{pvpBracket}` | Arena data |
| Account Profile | `/profile/user/wow` | User's characters (OAuth required) |

**Source:** [WoW Classic Profile APIs](https://community.developer.battle.net/documentation/world-of-warcraft-classic/profile-apis) [High Confidence]

### Authentication

- **OAuth 2.0** required for all API access
- **Client Credentials Flow** for public data (character profiles, items)
- **Authorization Code Flow** for user-specific data (account profiles)
- Host: `{region}.api.blizzard.com` (us, eu, kr, tw)
- Namespace header required: `Battlenet-Namespace: profile-classic-{region}`

### Rate Limits

- 36,000 requests per hour per application
- 100 requests per second burst

### Feasibility for MVP Features

| Feature | API Endpoint | Feasibility |
|---------|--------------|-------------|
| Character gear lookup | Character Equipment API | ✅ **Fully supported** |
| Guild roster | Guild API | ✅ **Fully supported** |
| Item details | Item API | ✅ **Fully supported** |
| Enchant/Gem Audit | Character Equipment API (includes enchants) | ✅ **Fully supported** |

### ⚠️ Limitations

1. **No attunement data** - Attunements are quest-based, not exposed via API
2. **No heroic key data** - Key quest completion not exposed
3. **No resistance gear totals** - Must calculate from equipment stats
4. **Update frequency** - Data may be cached/delayed

### Recommendation

**Use Battle.net API for:**
- Character gear snapshots
- Item data and icons
- Guild roster

**Manual tracking needed for:**
- Attunements (user input or addon export)
- Heroic keys (user input)

---

## 2. WarcraftLogs API v2

### Overview

WarcraftLogs provides a comprehensive GraphQL API (v2) for accessing raid logs, parse data, and guild information. **Fully supports TBC Classic.**

**Source:** [WarcraftLogs API Documentation](https://www.warcraftlogs.com/api/docs) [High Confidence]

### API Architecture

- **GraphQL** schema-based API
- **Two endpoints:**
  - Public: `https://www.warcraftlogs.com/api/v2/client` (client credentials)
  - Private: `https://www.warcraftlogs.com/api/v2/user` (user authorization)
- **Multiple game versions** supported including TBC Classic (`classic.warcraftlogs.com`)

**Source:** [WarcraftLogs v2 API Schema](https://www.warcraftlogs.com/v2-api-docs/warcraft/) [High Confidence]

### Authentication

```
# Client Credentials Flow (for public data)
curl -u {client_id}:{client_secret} \
  -d grant_type=client_credentials \
  https://www.warcraftlogs.com/oauth/token

# API Request with token
curl --header "Authorization: Bearer <access_token>" \
  https://www.warcraftlogs.com/api/v2/client
```

**Source:** [WarcraftLogs OAuth Documentation](https://www.warcraftlogs.com/api/docs) [High Confidence]

### Key GraphQL Types for Parsimonie

#### Character Data
```graphql
type Character {
  canonicalID: Int!        # Persistent ID across renames/transfers
  classID: Int!            # Class identifier
  name: String!            # Character name
  level: Int!              # Character level
  faction: GameFaction!    # Alliance/Horde
  server: Server!          # Realm info
  guilds: [Guild]          # Guild memberships
  guildRank: Int!          # Rank in primary guild
  
  # Performance data
  encounterRankings(encounterID: Int!, ...): JSON  # Boss-specific parses
  zoneRankings(zoneID: Int, ...): JSON             # Zone-wide rankings
  
  # Gear data (cached from Armory)
  gameData(specID: Int, forceUpdate: Boolean): JSON
  
  # Recent activity
  recentReports(limit: Int, page: Int): ReportPagination
}
```

**Source:** [WarcraftLogs Character Schema](https://www.warcraftlogs.com/v2-api-docs/warcraft/character.doc.html) [High Confidence]

#### Guild Attendance (Perfect for loot system!)
```graphql
type GuildAttendance {
  code: String!           # Report code for the raid night
  players: [PlayerAttendance]  # Who attended
  startTime: Float        # Raid start timestamp
  zone: Zone              # Which raid instance
}
```

**Source:** [WarcraftLogs GuildAttendance Schema](https://www.warcraftlogs.com/v2-api-docs/warcraft/guildattendance.doc.html) [High Confidence]

#### Additional Useful Types
- `Guild` - Guild info and rankings
- `Report` - Individual raid logs
- `ReportFight` - Per-boss fight data
- `Zone` - Raid instances (SSC, TK, etc.)
- `Encounter` - Boss definitions
- `GameItem` - Item data with stats

### Feasibility for MVP Features

| Feature | GraphQL Query | Feasibility |
|---------|---------------|-------------|
| Raid attendance | guildData.attendance | ✅ **Fully supported** |
| Parse rankings | character.encounterRankings | ✅ **Fully supported** |
| Boss kill logs | reportData.report.fights | ✅ **Fully supported** |
| Guild progress | guildData.zoneRankings | ✅ **Fully supported** |
| Character gear (cached) | character.gameData | ✅ **Supported** (from Armory cache) |

### Rate Limits

- Rate limit data available via `RateLimitData` type
- Generally generous for typical use cases

### Recommendation

**WarcraftLogs is ideal for:**
- Attendance tracking (automatic from logs!)
- Performance/parse data
- Guild progression history
- Boss kill verification

**This can replace manual attendance tracking if your guild logs raids.**

---

## 3. Wowhead Data Access

### Overview

Wowhead provides a tooltip embedding system rather than a traditional API. Item/spell data can be displayed on your site via their JavaScript widget.

**Source:** [Wowhead Tooltips Documentation](https://www.wowhead.com/tooltips) [High Confidence]

### Integration Method

```html
<!-- Add to <head> -->
<script>
  const whTooltips = {
    colorLinks: true, 
    iconizeLinks: true, 
    renameLinks: true
  };
</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>

<!-- Usage -->
<a href="https://www.wowhead.com/item=32235">Cursed Vision of Sargeras</a>
```

### TBC Classic Support

Use the `domain` parameter for Classic:
- `domain=classic` - WoW Classic
- `domain=tbc` - TBC Classic (if available)

```html
<a href="https://www.wowhead.com/classic/item=32235" 
   data-wowhead="domain=classic">Cursed Vision of Sargeras</a>
```

### Advanced Options

| Option | Usage | Example |
|--------|-------|---------|
| Gems | `gems=23121:23121` | Show socketed gems |
| Enchant | `ench=2647` | Show enchant |
| Set Pieces | `pcs=25695:25696:25697` | Show set bonuses |
| Icon Size | `data-wh-icon-size="small"` | Adjust icon size |

### Feasibility for MVP Features

| Feature | Approach | Feasibility |
|---------|----------|-------------|
| Item tooltips in UI | Embed Wowhead widget | ✅ **Fully supported** |
| Boss loot tables | Link to Wowhead pages | ✅ **Works** |
| BiS lists display | Use Wowhead links | ✅ **Works** |

### ⚠️ Limitations

1. **No raw data API** - Can't programmatically fetch item stats
2. **Scraping forbidden** - Terms of service prohibit scraping
3. **Display only** - Tooltips are for display, not data processing

### Workarounds for Item Data

1. **wow.tools** - Community-maintained WoW database exports (caution: may have TOS implications)
2. **Manual curation** - Pre-build BiS lists and loot tables
3. **WarcraftLogs GameItem** - Has item data in their API

### Recommendation

**Use Wowhead for:**
- Rich item tooltips in your UI
- Links to detailed item pages
- Visual loot displays

**Don't rely on Wowhead for:**
- Programmatic item data (use Battle.net API or curated data)

---

## 4. Discord API

### Overview

Discord provides a comprehensive API for bot development, including slash commands, webhooks, and rich embeds.

**Source:** [Discord Developer Documentation](https://discord.com/developers/docs) [High Confidence]

### Integration Options

#### Option A: Discord Bot
Full-featured bot with slash commands, message handling, and real-time interaction.

**Capabilities:**
- Slash commands (`/loot-score`, `/tonight`, `/my-upgrades`)
- Rich embeds (formatted loot announcements)
- Reactions (attendance confirmation)
- DMs (weekly summaries)
- Voice channel events (raid starting notifications)

#### Option B: Webhooks (Simpler)
One-way notifications from Parsimonie to Discord.

**Capabilities:**
- Raid reminders
- Loot announcements
- Weekly summaries

### Bot Setup

1. Create application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add bot user
3. Generate OAuth2 URL with required permissions
4. Invite to guild server

### Slash Commands Example

```javascript
// Register command
{
  name: "loot-score",
  description: "Check your current loot score",
  options: [{
    name: "character",
    description: "Character name",
    type: 3, // STRING
    required: false
  }]
}
```

### Webhook Example

```javascript
// Send loot announcement
POST https://discord.com/api/webhooks/{webhook.id}/{webhook.token}
{
  "embeds": [{
    "title": "Loot Awarded!",
    "description": "[Warglaive of Azzinoth] → Yaji",
    "color": 0xa335ee,
    "fields": [
      {"name": "Loot Score", "value": "4.2 → 3.1", "inline": true},
      {"name": "Reason", "value": "Highest score, class priority", "inline": true}
    ]
  }]
}
```

### Rate Limits

- 50 requests per second per bot
- Webhook: 30 messages per minute per channel

### Feasibility for MVP Features

| Feature | Approach | Feasibility |
|---------|----------|-------------|
| Slash commands | Bot API | ✅ **Fully supported** |
| Loot announcements | Webhooks or Bot | ✅ **Fully supported** |
| Raid reminders | Scheduled webhook | ✅ **Fully supported** |
| Attendance reactions | Bot API | ✅ **Fully supported** |
| Weekly DMs | Bot API | ✅ **Fully supported** |

### Recommendation

**Start with webhooks** for MVP (simpler), then add full bot later.

---

## 5. RCLootCouncil Integration

### Overview

RCLootCouncil is the most popular loot distribution addon for WoW. Integration allows syncing loot history between the in-game addon and Parsimonie.

### Data Export Options

#### Option A: Manual CSV/JSON Export
RCLootCouncil supports exporting loot history to CSV or JSON format through:
1. In-game `/rclc` command
2. Export to spreadsheet/JSON
3. Import into Parsimonie

**Data Fields Available:**
- Player name
- Item link/ID
- Response (MS/OS/etc.)
- Timestamp
- Votes
- Notes

#### Option B: Saved Variables
The addon stores data in `WTF/Account/{account}/SavedVariables/RCLootCouncil.lua`

**Format:** Lua table structure
**Challenge:** Requires parsing Lua, may contain private data

### Integration Architecture

```
[RCLootCouncil Addon]
        ↓
[Manual Export: JSON/CSV]
        ↓
[Parsimonie Import Feature]
        ↓
[Loot History Database]
```

### Feasibility for MVP Features

| Feature | Approach | Feasibility |
|---------|----------|-------------|
| Import loot history | CSV/JSON upload | ✅ **Feasible** |
| Real-time sync | Not available | ❌ **Not possible** |
| Two-way sync | Not available | ❌ **Not possible** |

### ⚠️ Limitations

1. **Manual process** - User must export from addon
2. **No real-time sync** - Data syncs only when exported
3. **Format variations** - Export format may change between addon versions

### Recommendation

**For MVP:** Support CSV/JSON import as a "nice to have"
**Long-term:** Build loot tracking directly into Parsimonie (attendance from WarcraftLogs + manual loot entry)

---

## 6. Architecture Recommendations

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       PARSIMONIE                             │
├──────────────────┬──────────────────┬───────────────────────┤
│   Frontend       │   Backend API    │   Database            │
│   (React/Vue)    │   (Node/Python)  │   (PostgreSQL)        │
└────────┬─────────┴────────┬─────────┴───────────┬───────────┘
         │                  │                     │
         │                  ▼                     │
         │    ┌─────────────────────────────┐     │
         │    │      External APIs          │     │
         │    ├─────────────────────────────┤     │
         │    │ Battle.net API              │◄────┤ Character gear
         │    │ WarcraftLogs API            │◄────┤ Attendance, parses
         │    │ Discord API                 │◄────┤ Notifications
         │    │ Wowhead (embed)             │     │ Tooltips only
         │    └─────────────────────────────┘     │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                   ┌─────────────────────┐
│ Discord Server  │                   │   Manual Entry      │
│ (notifications) │                   │ - Attunements       │
└─────────────────┘                   │ - Heroic keys       │
                                      │ - Loot decisions    │
                                      └─────────────────────┘
```

### API Data Responsibilities

| Data Type | Primary Source | Fallback |
|-----------|----------------|----------|
| Character Gear | Battle.net API | WarcraftLogs cache |
| Raid Attendance | WarcraftLogs API | Manual entry |
| Parse Data | WarcraftLogs API | - |
| Item Info | Battle.net API | Wowhead embed |
| Loot History | Manual entry | RCLC import |
| Attunements | Manual entry | - |
| Heroic Keys | Manual entry | - |

### Caching Strategy

| Data | Cache Duration | Reason |
|------|----------------|--------|
| Character gear | 1 hour | Changes infrequently |
| Parse rankings | 6 hours | Updates after logs process |
| Item data | 1 week | Static per patch |
| Attendance | 1 hour | After raid ends |

---

## 7. Technical Feasibility Summary

### MVP Features Assessment

| MVP Feature | Primary Data Source | Feasibility | Notes |
|-------------|---------------------|-------------|-------|
| **A. LOOT SYSTEM** |
| Loot Score Calculator | Manual entry + attendance | ✅ Full | Formula in app |
| Transparency Ledger | Manual entry | ✅ Full | Store in DB |
| Loot Audit Trail | Manual entry | ✅ Full | Store decisions |
| **C. PRE-RAID** |
| Pre-Raid Dashboard | Battle.net + WCLogs | ✅ Full | Combine APIs |
| Consumables Checklist | Static data | ✅ Full | Per-boss config |
| Quick Strat Cards | Static data | ✅ Full | Content creation |
| BiS Targeting | Battle.net + curated | ✅ Full | Compare to BiS lists |
| **D. TBC-SPECIFIC** |
| Attunement Tracker | Manual entry | ✅ Full | User checkboxes |
| Heroic Key Tracker | Manual entry | ✅ Full | User checkboxes |
| Resistance Gear Check | Battle.net API | ✅ Full | Calculate from gear |
| Enchant/Gem Audit | Battle.net API | ✅ Full | Equipment endpoint |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits | Low | Medium | Caching, request queuing |
| API changes | Medium | High | Version monitoring, abstraction layer |
| WarcraftLogs downtime | Low | Medium | Graceful degradation, cached data |
| No TBC-specific endpoints | N/A | N/A | ✅ All endpoints support Classic namespaces |

---

## 8. Conclusions & Next Steps

### Key Findings

1. **Battle.net API fully supports TBC Classic** - Character profiles, equipment, and guild data available
2. **WarcraftLogs API is excellent** - Attendance, parses, and guild data via GraphQL
3. **Wowhead is display-only** - Use for tooltips, not data
4. **Discord integration is straightforward** - Webhooks for MVP, bot for advanced features
5. **RCLootCouncil requires manual export** - Not a blocker, but adds user friction

### Technical Stack Recommendation

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | Next.js or Nuxt | SSR, API routes, modern DX |
| Backend | Node.js or Python | Good API client support |
| Database | PostgreSQL | Relational data, JSON support |
| Auth | OAuth (Battle.net) | Players log in with WoW account |
| Hosting | Vercel/Railway | Easy deployment, good free tier |

### MVP Development Priority

1. **Phase 1: Core Loot System**
   - Database schema
   - Manual loot entry
   - Score calculation
   - Basic UI

2. **Phase 2: API Integration**
   - Battle.net OAuth
   - Character gear fetching
   - WarcraftLogs attendance sync

3. **Phase 3: Pre-Raid Features**
   - Dashboard
   - BiS comparison
   - Consumables checklist

4. **Phase 4: Discord Integration**
   - Webhooks for loot announcements
   - Raid reminders

---

## Sources

1. Battle.net Developer Documentation - WoW Classic: https://community.developer.battle.net/documentation/world-of-warcraft-classic [Accessed 2026-01-22]
2. WoW Classic Game Data APIs: https://community.developer.battle.net/documentation/world-of-warcraft-classic/game-data-apis [Accessed 2026-01-22]
3. WoW Classic Profile APIs: https://community.developer.battle.net/documentation/world-of-warcraft-classic/profile-apis [Accessed 2026-01-22]
4. WarcraftLogs API Documentation: https://www.warcraftlogs.com/api/docs [Accessed 2026-01-22]
5. WarcraftLogs v2 GraphQL Schema: https://www.warcraftlogs.com/v2-api-docs/warcraft/ [Accessed 2026-01-22]
6. WarcraftLogs Character Type: https://www.warcraftlogs.com/v2-api-docs/warcraft/character.doc.html [Accessed 2026-01-22]
7. WarcraftLogs GuildAttendance Type: https://www.warcraftlogs.com/v2-api-docs/warcraft/guildattendance.doc.html [Accessed 2026-01-22]
8. Wowhead Tooltips Documentation: https://www.wowhead.com/tooltips [Accessed 2026-01-22]
9. Discord Developer Documentation: https://discord.com/developers/docs [Accessed 2026-01-22]

