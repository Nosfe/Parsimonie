---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
currentStep: 'complete'
status: 'approved'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-parsimonie-2026-01-22.md'
  - '_bmad-output/planning-artifacts/research/technical-parsimonie-apis-research-2026-01-22.md'
  - '_bmad-output/analysis/brainstorming-session-2026-01-22.md'
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: 'web_app'
  domain: 'gaming-entertainment'
  complexity: 'low-medium'
  projectContext: 'greenfield'
projectType: 'greenfield'
workflowType: 'prd'
date: '2026-02-04'
completedDate: '2026-02-04'
author: 'Yaji'
---

# Product Requirements Document - Parsimonie

**Author:** Yaji  
**Date:** 2026-02-04  
**Status:** Approved

---

## Executive Summary

**Parsimonie** is a TBC Anniversary-focused guild management platform that aggregates data from WarcraftLogs, Battle.net, and Wowhead into a clean, personalized experience for raiders. Unlike generic gaming tools that create pressure and anxiety, Parsimonie is designed for **psychological safety** — data empowers, mistakes are learning opportunities, and growth is celebrated.

### Key Facts

| Aspect | Detail |
|--------|--------|
| **Target Users** | Parsimonie guild raiders (~25-40 people) |
| **Core Value** | 80% of raiding needs in one place, zero noise |
| **Differentiator** | Anti-anxiety optimization — supportive, not judgmental |
| **Tech Stack** | Angular 21 + .NET 10 + PostgreSQL + Azure |
| **Team** | Solo developer |
| **Timeline** | No fixed date — quality over speed |

### MVP Capabilities (Phase 1)

1. Discord OAuth (gated by guild server + role)
2. Roster Management (officer-assigned characters)
3. My Gear + upgrade simulation
4. Auto-generated Loot Wishlist
5. My Parses + trends
6. Tonight's Raid (strats + role assignments, real-time)
7. Automated Improvement Tips

---

## Success Criteria

### User Success

| Criteria | Metric | Target |
|----------|--------|--------|
| **Single destination** | % of raiding needs met on Parsimonie | 80%+ |
| **Upgrade clarity** | Raiders can simulate any raid loot item as upgrade (not just BiS) | Per-slot simulation for full raid loot table |
| **Personalized strats** | Boss strats tailored to player's role | Role-specific view |
| **Learn from mistakes** | Failed mechanics (from logs) highlighted with emphasis | Auto-detected, surfaced in improvement tips |
| **Zero pre-raid stress** | Raider knows strats, tasks, and what RL will recap | "I feel prepared" state |
| **Self-sufficient** | Raiders don't need to ask officers basic questions | Measurable: Discord question volume decreases |

### Emotional Success Moment

> "I'm not feeling any stress related to uncertainty — I know the strats, what I have to do, and I know what the RL will talk about since he'll always recap before pulling."

**The Parsimonie Promise:** Prepared, confident, stress-free raider.

### Business Success

| Criteria | Metric | Target |
|----------|--------|--------|
| **Adoption** | % of raid team with active accounts | 80%+ of raiders |
| **Frequency** | Active usage pattern | At least once per raid week |
| **Stickiness** | Return rate | Raiders come back each tier |

### Technical Success

| Criteria | Metric | Target |
|----------|--------|--------|
| **Uptime** | Availability during raid nights | 99.9% (critical hours) |
| **Automation** | Manual intervention required | Near-zero — data syncs automatically |
| **Data freshness** | WarcraftLogs/gear data staleness | Updated within 1 hour of log upload |
| **Performance** | Page load time | < 2 seconds |

## Product Scope

### MVP - Minimum Viable Product

1. **Discord OAuth** — Login and character linking (officer-assigned)
2. **Roster Management** — Mains, alts, specs
3. **Guild Progress** — Public raid progress page
4. **My Gear** — Current gear + upgrade simulation for raid loot table
5. **Loot Wishlist** — Personal upgrade targets
6. **My Parses** — Parse history with trends
7. **Tonight's Raid** — Role-tailored strats + role attributions
8. **Improvement Tips** — Spec-aware + failed mechanics emphasis (from logs)

### Growth Features (Post-MVP)

- Raid-wide loot optimizer (officer view)
- Calendar/schedule integration
- Class guides (TBC-specific)
- Historical tier comparisons
- **Theorycrafting Tools (Phase 1):**
  - DPS rotation optimization
  - Healing output optimization
  - Threat generation optimization

### Vision (Future)

- **Full Theorycrafting Suite:**
  - Complete gear optimization engine
  - Rotation optimization per boss mechanics
  - Role-specific optimization (tank threat vs survival, healer throughput vs mana efficiency)
  - "What-if" scenarios for gear/rotation changes
  - Sim-like functionality built into Parsimonie
- Predictive upgrade impact on raid DPS
- Auto-generated raid comp suggestions
- Cross-tier progression tracking
- Mobile-friendly views

## User Journeys

### Journey 1: The Raider — "Raid Night Prep"

**Persona:** Kira, Affliction Warlock, 2 years in Parsimonie guild

**Opening Scene:**
It's Tuesday, 30 minutes before raid. Kira just got home from work. Last week she died twice to the same mechanic on Brutallus and got called out (gently) by the RL. She's anxious about tonight.

**Rising Action:**
Kira opens Parsimonie. Her dashboard immediately shows:
- Tonight's bosses: Brutallus, Felmyst
- Her role assignments: "Curse of Elements on pull, Shadow Ward at 30%"
- ⚠️ **Highlighted:** "Last week: 2 deaths to Stomp — review positioning guide"
- Her parse trend: 78 → 82 → 85 (improving!)
- Loot to watch: Leggings of Calamity drops from Felmyst — +4.2% DPS upgrade

She feels **safe** reviewing this data. The tone isn't punishing — it's helpful. She knows the officers understand that mistakes are part of the game. This is a tool to help her grow, not a report card to shame her.

**Climax:**
Kira clicks on the Stomp mechanic. A 15-second clip shows exactly where to stand. She mentally rehearses. She feels ready.

**Resolution:**
Raid starts. RL recaps exactly what Parsimonie showed. Kira nails the mechanic, parses 89, wins the leggings. She feels **proud** of herself — she put in the prep, and it paid off.

**Epilogue (Next Week):**
The following Tuesday, Kira opens Parsimonie. Her dashboard shows:
> 🎉 "Mechanic you were previously troubled with cleared with success — congrats!"

She smiles. The system noticed. She's getting better.

---

### Journey 2: The Officer — "Loot Council Prep"

**Persona:** Marcus, Prot Paladin, Officer handling loot council

**Opening Scene:**
It's Monday night. Marcus needs to prep loot priorities for tomorrow's raid. The guild has 3 people who want the same trinket.

**Rising Action:**
Marcus opens Parsimonie's Officer view. He sees:
- **Trinket X** drops from Boss Y
- **Who wants it:** Player A (main, +3.1% DPS), Player B (main, +2.4% DPS), Player C (alt, +5.2% DPS)
- **Raid DPS impact:** Giving to Player A = +847 raid DPS, Player B = +612 raid DPS
- Player A hasn't won loot in 3 weeks; Player B won 2 items last week

**Climax:**
Marcus sees the data clearly. Player A gets priority — biggest raid impact + longest drought. He notes it in the attribution sheet.

**Resolution:**
During raid, loot drops. Marcus announces priority confidently. No drama — the data backs the decision.

---

### Journey 3: The Guild Master — "New Tier Setup"

**Persona:** Yaji, GM, setting up for Sunwell launch

**Opening Scene:**
Sunwell Plateau just released. Yaji needs to set up strats, role assignments, and loot priorities for 6 new bosses before Thursday's raid.

**Rising Action:**
Yaji opens Parsimonie admin. He:
1. Imports boss overviews from Wowhead (auto-pulled)
2. Adds officer notes for guild-specific adjustments
3. Sets up role attributions (kick rotations, heal assignments) using drag-drop roster
4. Reviews the auto-generated loot priority suggestions based on current gear

**Climax:**
Everything is set up in 45 minutes instead of 3 hours of spreadsheets. The raid team can see their assignments immediately.

**Resolution:**
Thursday raid. Everyone shows up prepared. "I just checked Parsimonie" is the common phrase. Yaji smiles.

---

### Journey 4: The Public Visitor — "Checking Out the Guild"

**Persona:** Tomás, warrior looking for a guild

**Opening Scene:**
Tomás heard about Parsimonie guild on Discord. He wants to know if they're progressing and what their vibe is.

**Rising Action:**
Tomás visits parsimonie.gg (no login). He sees:
- **Guild Progress:** 5/6 Sunwell (Kil'jaeden attempts started)
- **About:** "French TBC Anniversary guild, raiding since 2021"
- **Raid times:** Wed/Thu 20:30 CET

**Climax:**
Tomás thinks: "These guys are serious but not hardcore. Good progress."

**Resolution:**
He joins their Discord to ask about recruitment. (Even though Parsimonie doesn't have recruitment features, the public page did its job.)

---

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| **Raider Prep** | Personal dashboard, parse trends, loot simulation, role assignments, failed mechanics highlighting (supportive tone), boss strat viewer, mechanic success celebration |
| **Officer Loot** | Raid-wide loot optimizer, player loot history, raid DPS impact calculator, attribution editor |
| **GM Setup** | Boss import, officer notes editor, role attribution drag-drop, roster management, bulk setup tools |
| **Public Visitor** | Public progress page, guild info, no-login access |

### Design Principle: Psychological Safety

Parsimonie surfaces improvement opportunities with a **supportive, growth-oriented tone**:
- Mistakes are learning opportunities, not failures
- Celebrations when players overcome previous challenges
- Data empowers, never shames

## Innovation & Differentiators

### Core Innovation: Anti-Anxiety Optimization

**The Paradox:** Most optimization tools create pressure and anxiety. "Your DPS is below the 75th percentile!" feels like judgment. Players feel stressed, not helped.

**Parsimonie's Approach:** An optimization tool that **reduces stress instead of creating it**.

- Mistakes are framed as learning opportunities, not failures
- The system celebrates when players overcome previous challenges ("Congrats! Mechanic cleared!")
- Data is presented to empower, never to shame
- Improvement tips are coaching, not criticism

**Why This Matters:** WoW is a game. Parsimonie makes it more fun, not more stressful. Raiders feel supported, not judged.

**Innovation Claim:** Parsimonie is an **optimization tool designed for psychological safety** — rare in gaming tools that typically assume players want to min-max at any emotional cost.

---

### Supporting Innovation: Intelligent Curation

Most aggregators just pull data together. Parsimonie **contextualizes** it at every layer:

| Layer | Generic Aggregation | Parsimonie Curation |
|-------|---------------------|---------------------|
| Logs | "Here's your DPS" | "Here's your DoT uptime (what matters for Affliction)" |
| Loot | "This item has +30 spell power" | "This item is +4.2% DPS for YOUR current gear" |
| Strats | "Here's the boss guide" | "Here's YOUR role assignment for this boss" |
| Tips | "Improve your rotation" | "Last week you died to Stomp — here's how to fix it" |

**Innovation Claim:** Parsimonie doesn't just aggregate — it **personalizes context at every layer**.

---

### Supporting Innovation: Collective Optimization (Visible to All)

Most tools answer: "What's best for ME?"

Parsimonie answers: "What's best for the RAID?"

**Key Decision:** Raid DPS impact numbers are visible to **ALL raiders**, not just officers.

| Visibility | What They See |
|------------|---------------|
| **Raider** | "If you get Trinket X, raid gains +847 DPS. If Player B gets it, raid gains +612 DPS." |
| **Officer** | Same data + loot priority decision tools |

**Why Visible to All:**
- Transparency builds trust — raiders understand loot decisions
- Everyone sees how their upgrades contribute to the raid
- Reduces "why did they get it?" drama

**Innovation Claim:** Parsimonie optimizes for **raid success as a unit**, and makes that optimization visible to everyone.

---

### Supporting Innovation: Player Growth Memory

The system **remembers** past struggles and celebrates growth:

- Week 1: "You died to Stomp twice — review positioning guide"
- Week 2: "🎉 Mechanic you were previously troubled with cleared with success — congrats!"

Most tools are stateless. Parsimonie tracks the **player's journey over time**.

**Innovation Claim:** Parsimonie has a **player growth memory** that creates emotional connection and celebrates improvement.

---

### Vision Innovation: Boss-Specific Theorycrafting

Current sims are generic: "Here's your DPS in a Patchwerk fight."

Parsimonie's vision is **encounter-aware** theorycrafting:
- Rotation optimization for THIS boss's mechanics
- "On Brutallus, Shadow Ward at 30% — sim confirms +2.1% survival"
- Healing output optimization for specific damage patterns
- Threat generation optimization for tank swap timing

**Innovation Claim:** Theorycrafting that understands **encounter context**, not just generic sims.

*(This is Vision/Future scope, not MVP)*

---

### Innovation Priority

If only one innovation defines Parsimonie, it's this:

> **Parsimonie is an optimization tool designed for psychological safety.**
> 
> Data empowers. Mistakes are learning. Growth is celebrated.

## Web Application Requirements

### Application Architecture

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Structure** | MPA-style with distinct pages (SPA with route-based sections + tabs) | Avoid clutter; dedicated pages for Character, Logs, TC, Raid |
| **Navigation** | Tab-based within pages to organize related content | E.g., "My Character" page has tabs for Gear, Parses, Wishlist |
| **Framework** | Angular 21 SPA with Angular Router | Already decided |

### Page Structure

| Page | Content | Tabs/Sections |
|------|---------|---------------|
| **Home/Dashboard** | Tonight's raid overview, quick stats | - |
| **My Character** | Personal raider data | Gear, Parses, Wishlist, Improvement Tips |
| **Raid** | Boss strats, role assignments | Per-boss tabs or accordion |
| **Roster** | Guild roster, mains/alts | Officer: management tools |
| **Progress** | Public guild progress | Public (no login) |
| **TC Tools** | Theorycrafting (Vision) | DPS, Healing, Threat (future) |

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome (latest 2 versions) | ✅ Required |
| Firefox (latest 2 versions) | ✅ Required |
| Edge (latest 2 versions) | ✅ Required |
| Safari (latest 2 versions) | ✅ Required |
| IE11 / Legacy browsers | ❌ Not supported |

### SEO & Rendering

| Aspect | Decision |
|--------|----------|
| **SEO** | Not required |
| **Rendering** | Client-side only (CSR) |
| **SSR/SSG** | Not needed — simpler build |

### Real-Time Features

| Feature | Real-Time? | Method |
|---------|------------|--------|
| **Role Assignments** | ✅ Yes | SignalR / WebSocket |
| **Parse Data** | ❌ No | Refresh to see |
| **Gear Updates** | ❌ No | Refresh to see |
| **Loot Wishlist** | ❌ No | Refresh to see |
| **Guild Progress** | ❌ No | Refresh to see |

### Accessibility

| Level | Decision |
|-------|----------|
| **Target** | Basic usability (not WCAG AA) |
| **Keyboard navigation** | Nice-to-have, not required for MVP |
| **Screen reader support** | Not a priority |
| **Focus** | Functionality first |

### Technical Architecture Considerations

| Consideration | Approach |
|---------------|----------|
| **State Management** | Angular signals / NgRx (TBD during architecture) |
| **API Communication** | HttpClient to .NET 10 backend |
| **Real-time** | SignalR for role assignments |
| **Authentication** | Discord OAuth → JWT tokens |
| **Error Handling** | Global error handler, user-friendly messages |

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — Deliver immediate value for raid prep
**Team Size:** Solo developer
**Philosophy:** Lean, functional, iterate fast

### MVP Feature Set (Phase 1)

| # | Feature | Scope |
|---|---------|-------|
| 1 | **Discord OAuth** | Login + JWT, **gated by guild server membership + specific role** |
| 2 | **Roster Management** | Officer assigns characters to Discord users (mains, alts, specs) |
| 3 | **My Gear** | Current gear + upgrade simulation for raid loot table |
| 4 | **Loot Wishlist (Auto)** | Auto-generated upgrade targets from loot table (not customizable yet) |
| 5 | **My Parses** | Parse history with trends |
| 6 | **Tonight's Raid** | Role-tailored strats + role attributions (real-time) |
| 7 | **Improvement Tips (Auto)** | Automated suggestions from logs (basic, not spec-aware yet) |

### Authentication Requirements

| Requirement | Description |
|-------------|-------------|
| **Discord OAuth** | User authenticates via Discord |
| **Guild Server Check** | User must be a member of the Parsimonie Discord server |
| **Role Check** | User must have a specific Discord role (e.g., "Raider") to access the app |
| **Access Denied** | Users not meeting criteria see friendly error: "You must be a guild member with Raider role" |

### Post-MVP Features (Phase 2)

| Feature | Description |
|---------|-------------|
| **Guild Progress** | Public raid progress page |
| **Customizable Wishlist** | Raiders can manually adjust their loot priorities |
| **Spec-Aware Tips** | Spec-specific metrics (DoT uptime for Affliction, etc.) |
| **Failed Mechanics Detection** | Auto-detect from logs, surface with supportive messaging |
| **Raid-Wide Loot Optimizer** | Officer view for raid DPS impact |
| **Calendar Integration** | Raid schedule |

### Vision Features (Phase 3)

| Feature | Description |
|---------|-------------|
| **Full TC Suite** | DPS/Healing/Threat rotation optimization |
| **Boss-Specific TC** | Encounter-aware theorycrafting |
| **Class Guides** | TBC-specific guides |
| **Historical Comparisons** | Cross-tier progression tracking |
| **Mobile Views** | Responsive/mobile-friendly |
| **Raid Comp Suggestions** | Auto-generated |

### Risk Mitigation Strategy

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | WarcraftLogs API rate limits | Aggressive caching, batch updates hourly |
| **Technical** | Upgrade simulation accuracy | Start with curated BiS lists as baseline |
| **Technical** | Solo dev bandwidth | Lean MVP, automate testing, iterate |
| **Market** | Raiders don't adopt | "Tonight's Raid" delivers immediate value — lead with that |
| **Resource** | Feature creep | Strict Phase 1 boundaries, resist adding |

### MVP Definition of Done

MVP is "done" when a raider can:
1. ✅ Log in with Discord (must be on guild server + have Raider role)
2. ✅ See their character linked by an officer
3. ✅ View their current gear and simulate loot upgrades
4. ✅ See their parse history and improvement trend
5. ✅ Check Tonight's Raid for strats and their role assignments
6. ✅ Get basic automated improvement tips from their logs

## Functional Requirements

### Authentication & Access

| FR# | Requirement |
|-----|-------------|
| FR1 | Users can authenticate via Discord OAuth |
| FR2 | System verifies user is a member of the guild Discord server |
| FR3 | System verifies user has the required Discord role (e.g., "Raider") |
| FR4 | Users denied access see a friendly error explaining requirements |
| FR5 | Officers can configure which Discord role grants access |
| FR6 | System issues JWT tokens for authenticated sessions |

### Roster Management

| FR# | Requirement |
|-----|-------------|
| FR7 | Officers can view all Discord users with the required role |
| FR8 | Officers can assign WoW characters to Discord users |
| FR9 | Officers can mark a character as "main" or "alt" |
| FR10 | Officers can assign primary and secondary specs to characters |
| FR11 | Raiders can view their linked characters and specs |
| FR12 | Officers can remove or reassign character links |

### Gear & Loot

| FR# | Requirement |
|-----|-------------|
| FR13 | System syncs character gear from Battle.net API |
| FR14 | Raiders can view their current equipped gear |
| FR15 | Raiders can view upgrade simulations for any item in the raid loot table |
| FR16 | System calculates DPS/HPS/TPS impact of potential upgrades |
| FR17 | System auto-generates a loot wishlist based on upgrade value |
| FR18 | Raiders can view raid-wide loot impact (who benefits most from each drop) |

### Parse & Performance

| FR# | Requirement |
|-----|-------------|
| FR19 | System syncs parse data from WarcraftLogs API |
| FR20 | Raiders can view their parse history per boss |
| FR21 | Raiders can view their parse trend over time (improving/declining) |
| FR22 | System generates automated improvement tips based on log analysis |

### Tonight's Raid

| FR# | Requirement |
|-----|-------------|
| FR23 | Raiders can view tonight's scheduled bosses |
| FR24 | Raiders can view boss strategy overview (from Wowhead + officer notes) |
| FR25 | Raiders can view their specific role assignments per boss |
| FR26 | Officers can create and edit role attribution sheets per boss |
| FR27 | Officers can assign raiders to roles (tanks, healers, kick rotation, dispels, etc.) |
| FR28 | Role assignments update in real-time when officers make changes |
| FR29 | Officers can add custom notes to boss strategies |

### Officer Administration

| FR# | Requirement |
|-----|-------------|
| FR30 | Officers can import boss overviews from Wowhead |
| FR31 | Officers can configure raid schedule (which bosses for which night) |
| FR32 | Officers can manage roster (add/remove/reassign characters) |
| FR33 | GM can configure application settings (Discord server ID, required role) |

### Data & Sync

| FR# | Requirement |
|-----|-------------|
| FR34 | System periodically syncs data from WarcraftLogs (configurable interval) |
| FR35 | System periodically syncs data from Battle.net API |
| FR36 | System caches external API data to minimize rate limit issues |

## Non-Functional Requirements

### Performance

| NFR# | Requirement |
|------|-------------|
| NFR1 | Page load time < 2 seconds on modern browsers |
| NFR2 | API response time < 500ms for cached data |
| NFR3 | Real-time role assignment updates delivered within 1 second |
| NFR4 | Upgrade simulation calculations complete within 3 seconds |

### Security

| NFR# | Requirement |
|------|-------------|
| NFR5 | All API communication uses HTTPS (TLS 1.2+) |
| NFR6 | Discord OAuth tokens stored securely (not in localStorage) |
| NFR7 | JWT tokens expire after 24 hours, refresh tokens after 7 days |
| NFR8 | API endpoints validate user authorization before returning data |
| NFR9 | Officer-only endpoints enforce role-based access control |
| NFR10 | External API keys (WarcraftLogs, Battle.net) stored in Azure Key Vault |

### Reliability

| NFR# | Requirement |
|------|-------------|
| NFR11 | System availability 99.9% during raid hours (Wed-Thu 19:00-24:00 CET) |
| NFR12 | Graceful degradation if external APIs are unavailable (show cached data) |
| NFR13 | System recovers automatically from transient failures |
| NFR14 | Database backups daily, retained for 7 days |

### Integration

| NFR# | Requirement |
|------|-------------|
| NFR15 | WarcraftLogs API data syncs within 1 hour of log upload |
| NFR16 | Battle.net API data syncs within 1 hour of character update |
| NFR17 | Discord API validates guild membership in real-time at login |
| NFR18 | External API rate limits respected via caching and request throttling |
| NFR19 | Failed API syncs retry with exponential backoff (max 3 retries) |

### Scalability

| NFR# | Requirement |
|------|-------------|
| NFR20 | System supports up to 50 concurrent users without performance degradation |
| NFR21 | Database schema supports future multi-guild expansion (not MVP scope) |














