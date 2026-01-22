# Brainstorming Session - Parsimonie

---
stepsCompleted: [1]
inputDocuments: []
session_topic: "WoW Guild Management Platform - Complete Vision"
session_goals: "100+ ideas across features, UX, integrations, community, gamification, differentiation"
selected_approach: "AI-Recommended Techniques (Solo)"
techniques_used: []
ideas_generated: []
---

## Session Overview

**Project:** Parsimonie - WoW Guild Management Platform
**Date:** 2026-01-22
**Facilitator Approach:** AI-Recommended Techniques (optimized for solo brainstorming)

### Goals
- Generate 100+ ideas across all platform dimensions
- Explore features beyond basic aggregation
- Find unique value propositions vs existing tools
- Discover unexpected connections between features
- Push past obvious ideas into breakthrough territory

### Known Integrations
| Category | Features | Integrations |
|----------|----------|--------------|
| Loot & Gear | Raid/dungeon loot views, gear targeting | Wowhead, Battle.net Armory |
| Theorycrafting | Gear optimization, simulations, BiS | Ask Mr. Robot |
| Performance | Raid logs, wipe analysis, feedback | WarcraftLogs, WipeFest |
| Guild Ops | Roster management, raid attendance | Battle.net |
| Community | Forum, Discord integration | Discord API |

### Planned Techniques
1. 🎭 Role Playing - Stakeholder perspectives ✅
2. 🔄 Cross-Pollination - Outside industry inspiration ✅
3. 🛠️ SCAMPER - Systematic innovation ✅
4. 💭 What If Scenarios - Constraint breaking ✅
5. 🌿 Ecosystem Thinking - Guild as organism ✅

### Guild Context
- **Size:** ~30 raiders, 25 raid spots
- **Schedule:** 2 mandatory nights + 1 optional (reroll/PUG night)
- **Game:** TBC Classic Anniversary
- **Loot System:** Attendance-based priority with transparency (RCLootCouncil + custom)
- **Culture:** Team-first, fair rotation, no performance-based benching

---

## Technique 1: Role Playing

### 👑 GM Perspective (Ideas 1-12)

| # | Idea | Category |
|---|------|----------|
| 1 | **Bench Rotation Tracker** - Visual calendar showing who's benched when, auto-rotates DPS by type | Roster |
| 2 | **Bench = Present** toggle in loot system - benched raiders still accumulate attendance credit | Loot |
| 3 | **Pre-Raid Dashboard** - One screen: who's confirmed, their gear gaps, what they're targeting tonight | UX |
| 4 | **Loot Targeting Engine** - Cross-reference raider gear (Armory) + boss drops (Wowhead) + BiS lists | Theorycrafting |
| 5 | **Smart Loot Suggestions** - "Based on your current gear and tonight's bosses, prioritize: [items]" | Theorycrafting |
| 6 | **Absence Tracker with Justification** - Log absences as justified/unjustified, auto-flag patterns | Attendance |
| 7 | **Transparency Loot Ledger** - Public audit log: who got what, when, score before/after | Loot |
| 8 | **Presence/Loot Score Calculator** - Your exact formula: attendance ÷ loot received = priority | Loot |
| 9 | **Coveted Item Rules Engine** - Special rules for specific items (weapons, trinkets, tier) | Loot |
| 10 | **Loot Master Justification Log** - Record WHY exceptions were made, visible to all | Loot |
| 11 | **Optional Raid Mode Toggle** - Switches to SR/PUG rules, separate from main tracking | Roster |
| 12 | **Reroll Night Roster Fill** - Track PUG spots needed, maybe LFG integration | Community |

### ⚔️ Loot Officer Perspective (Ideas 13-23)

| # | Idea | Category |
|---|------|----------|
| 13 | **Class Benefit Ranking** - Pre-calculated "who benefits most" per item based on class guides | Theorycrafting |
| 14 | **"First Drops" Tracker** - Track how many times each item has dropped, who got it, prevent class stacking | Loot |
| 15 | **Behavior Score** (soft tracking) - Notes on attitude, helpfulness, preparedness - visible to officers only | Roster |
| 16 | **Tier Set Priority Matrix** - Which classes benefit most from 2pc/4pc, auto-updated per phase | Theorycrafting |
| 17 | **Set Completion Detection** - "This token completes 4pc for Yaji" alert during loot | Loot |
| 18 | **Trial Phase Tracker** - Auto-exclude trials from loot priority, countdown to "welcome present" | Roster |
| 19 | **Welcome Present Log** - Track who got their welcome loot, what they chose | Loot |
| 20 | **RCLootCouncil Data Sync** - Import/export data between Parsimonie and RCLC addon | Integration |
| 21 | **Loot Decision Audit Trail** - "Awarded to X because: class prio + behavior + score" - auto-generated | Transparency |
| 22 | **"Who Needs This?" Quick Lookup** - Item drops → instant list of who needs it + their scores + set status | UX |
| 23 | **Pre-Raid Class Benefit Report** - Before raid: "Tonight's high-value items favor: Shaman, Hunter, Warlock" | Theorycrafting |

### 🎮 Parse Chaser Perspective (Ideas 24-42)

| # | Idea | Category |
|---|------|----------|
| 24 | **Post-Raid Performance Summary** - Instant: your parse, class rank, role rank, raid rank | Performance |
| 25 | **"What Did They Do Different?"** - Side-by-side comparison with higher parsers: cooldown timing, spell priority | Analysis |
| 26 | **Mistake Tracker** - Auto-detect: cancelled casts, avoidable damage taken, missed mechanics | Performance |
| 27 | **DPS Cycle Analysis** - Compare your rotation to top performers, highlight gaps | Theorycrafting |
| 28 | **Cooldown Timeline Diff** - Visual: your CDs vs top parser's CDs over fight duration | Analysis |
| 29 | **Impact Loot History** - "You've received X impact items this tier" - visible to self | Transparency |
| 30 | **Personal Raid Stats Page** - Attendance %, best parses, average parse, loot history per tier | Profile |
| 31 | **Loot Score Display** - Your current score, how it compares, projection after next loot | Loot |
| 32 | **Top Guild Comparison** - Compare your guild's clears to server/region | Theorycrafting |
| 33 | **Fight Length Impact Analysis** - "Your kill was 30s longer - here's how that affected your parse" | Analysis |
| 34 | **Consumable Tracker** - What top parsers used vs what you used | Theorycrafting |
| 35 | **Group Comp Comparison** - "Top parse had PI + Windfury, you had neither" context | Analysis |
| 36 | **Macro vs Micro Improvement Tips** - "Big gains: fix cooldown timing. Small gains: pre-pot earlier" | Coaching |
| 37 | **Progress Over Time Charts** - Your parse trend across weeks/bosses/tiers | Profile |
| 38 | **Guildmate Leaderboard** - Friendly competition: class ranks within guild | Gamification |
| 39 | **BiS Targeting Dashboard** - "Your biggest upgrades this tier: [items] from [bosses]" | Theorycrafting |
| 40 | **Auto-Theorycraft Integration** - Pull community BiS lists, show stat priorities | Theorycrafting |
| 41 | **Discord Webhook - Personal Stats** - Push your weekly summary to a private channel | Integration |
| 42 | **"Did I Improve?" Tracker** - Compare this week vs last week, same boss, same conditions | Progress |

### 🌴 Casual Raider Perspective (Ideas 43-54)

| # | Idea | Category |
|---|------|----------|
| 43 | **Consumables Checklist** - "Tonight you need: Flask X, Food Y, Potions Z" per class/spec | Pre-Raid |
| 44 | **Quick Strat Cards** - TL;DR boss summaries: 3-5 bullet points per boss, your role highlighted | Pre-Raid |
| 45 | **"What Should I Target?"** - Simple view: "Your top 3 upgrades tonight: [items]" no theorycraft needed | Loot |
| 46 | **Loot System Explainer** - One-page "how loot works here" always accessible | Onboarding |
| 47 | **Rotation Calendar** - "You're raiding Tue/Thu, benched next Wed" - clear advance notice | Roster |
| 48 | **Help Request System** - "I need help with [Heroics/Crafting/Gold/Strats]" → guildies can respond | Community |
| 49 | **Recognition Beyond Parses** - "Most reliable attendance", "Always prepared", "Helpful to others" badges | Gamification |
| 50 | **"You Belong" Indicators** - Visual confirmation: in rotation, valued member, contributions tracked | UX |
| 51 | **No Performance-Based Exclusion Policy** - Visible guild rule: benching is rotation, not punishment | Transparency |
| 52 | **Minimal Prep Mode** - One-click "I'm ready for raid" view vs deep-dive mode | UX |
| 53 | **Strat Videos/Links per Boss** - Curated by officers, not just raw guides | Pre-Raid |
| 54 | **"Low Stress" UI Mode** - Hide parse comparisons, leaderboards - just show YOUR stuff | UX |

### 🔙 Returning Player Perspective (Ideas 55-66)

| # | Idea | Category |
|---|------|----------|
| 55 | **Roster Status Dashboard** - Who's active, who's on break, current raid team composition | Roster |
| 56 | **Gear Gap Analyzer** - "You're X ilvl behind average. Priority catches: [heroics], [content]" | Catch-up |
| 57 | **Catch-Up Checklist** - "To raid-ready: ☐ Attunements ☐ Heroics ☐ Resist gear" | Onboarding |
| 58 | **Guild Progress Summary** - "We're 6/6 SSC, 3/4 TK, averaging 2hr clears" | Dashboard |
| 59 | **Loot Distribution Overview** - "Guild loot status: tanks geared, need ranged DPS gear" | Transparency |
| 60 | **"What Changed?" Digest** - Patch notes summary relevant to YOUR class/role | Onboarding |
| 61 | **Top Player Talent/Gear Scanner** - Auto-pull from WarcraftLogs: what top specs are running | Theorycrafting |
| 62 | **Current Meta Snapshot** - "Your spec now: Talent X, priority Y, stat weights Z" | Theorycrafting |
| 63 | **Spell Priority Breakdown** - Compare top logs: what spells they cast most, in what order | Analysis |
| 64 | **"Welcome Back" System** - Guild notification: "Yaji is back!" - prompts social reconnection | Community |
| 65 | **Returnee Buddy System** - Assign someone to help catch them up, run heroics together | Community |
| 66 | **Historical Contribution Display** - "Before break: 95% attendance, X kills" - you're not new here | Profile |

### 🛡️ Raid Leader Perspective (Ideas 67-78)

| # | Idea | Category |
|---|------|----------|
| 67 | **Wipe Cause Analyzer** - Auto-categorize: "Personal error / Raid call mistake / Tuning issue / CD timing" | WipeFest |
| 68 | **"What Killed Us?" Instant Summary** - Death recap for the RAID, not just individuals | Analysis |
| 69 | **Cooldown Gap Detection** - "Raid died at 2:45 - no externals were available, consider adjusting CD rotation" | Analysis |
| 70 | **Common Mistakes Heatmap** - "Your guild's top 5 failure points this boss across all pulls" | WipeFest |
| 71 | **Consumable Audit** - "3 people didn't have flask up, 2 missing food buff on pull 7" | Performance |
| 72 | **Guild vs Other Guilds Comparison** - "On mechanic X, avg guilds have 2 fails, you have 5" | Benchmarking |
| 73 | **Mechanic Improvement Tracking** - "Mechanic X failures: Pull 1: 6, Pull 5: 3, Pull 10: 1" - progress! | Progress |
| 74 | **Boss Mechanic Quick Reference** - One-page: Mechanic → What it does → How to handle → When it happens | Pre-Raid |
| 75 | **Glanceable Strat Sheet** - Designed for RL: scannable during pull, not a wall of text | UX |
| 76 | **Timeline-Based Mechanic Guide** - "0:30 - Add spawn, 1:00 - Spread, 1:30 - Stack" visual | Pre-Raid |
| 77 | **Team Accountability View** - Frame fails as "we need to practice X" not "player Y sucks" | Culture |
| 78 | **Post-Raid Improvement Summary** - "Tonight we improved on X, still struggling with Y, try Z next time" | Coaching |

---

## Technique 2: Cross-Pollination

### 🏈 Fantasy Sports (Ideas 79-88)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 79 | Weekly lineup lock | "Confirm raid attendance" deadline with notifications |
| 80 | Power rankings | Guild leaderboard: performance, attendance, helpfulness |
| 81 | Trade analyzer | "Upgrade calculator" - if I get X item, my output changes by Y% |
| 82 | Matchup projections | "Tonight's expected parse range based on gear + boss" |
| 83 | Injury report | "Availability status" - who's out, questionable, confirmed |
| 84 | Commissioner tools | GM dashboard: all settings, rules, overrides in one place |
| 85 | Draft recap | "Tier loot distribution recap" - who got what, animated reveal? |
| 86 | Season standings | Tier-long performance tracking, not just weekly |
| 87 | Smack talk chat | Fun trash talk channel for friendly competition |
| 88 | "Start/Sit" advice | "Should I bring my alt tonight?" optimizer |

### 🏃 Strava (Ideas 89-98)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 89 | Kudos | Quick "nice parse!" reactions from guildies |
| 90 | Activity feed | "Yaji just killed Lady Vashj!" social updates |
| 91 | Segments / PRs | Personal records: "Your best parse on Boss X ever!" |
| 92 | Weekly stats email | "Your week: 2 raids, 87 avg parse, 2 upgrades" digest |
| 93 | Year in review | "Your TBC raiding wrapped" - total bosses, loot, highlights |
| 94 | Training log | Progression history: when you first killed each boss |
| 95 | Relative effort | "This was your hardest boss this tier" based on wipes/time |
| 96 | Clubs / Challenges | Inter-guild challenges? "Server-first race" tracking? |
| 97 | Flyby | "Who else killed this boss this week at your parse level" |
| 98 | Heatmaps | "Your most played content this month" visual |

### 💼 LinkedIn (Ideas 99-108)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 99 | Skill endorsements | Guildies endorse: "Great at mechanics" "Always prepared" |
| 100 | Recommendations | Written testimonials from officers/GM for recruits |
| 101 | Profile completeness | "Your profile is 80% complete - add your main spec!" |
| 102 | Experience history | "Raiding history: Guild X (2023-2024), Guild Y (2024-now)" |
| 103 | Certifications | Milestones displayed: "Killed Vashj", "Full T5", "Warglaive holder" |
| 104 | "Open to work" | "Looking for guild" status for recruitment |
| 105 | Connections | Cross-guild friend network, see mutual connections |
| 106 | Recruiter tools | GM search: "Find healers, SSC attuned, T5 experience" |
| 107 | Activity visibility | Control what's public vs guild-only vs private |
| 108 | Post updates | "Just got my T6 helm!" shareable moments |

### 🦉 Duolingo (Ideas 109-118)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 109 | Daily streaks | "Raid attendance streak: 12 weeks!" |
| 110 | XP system | Earn XP: raids, helping others, improving parses |
| 111 | Leagues | Weekly competitive tiers within guild by XP earned |
| 112 | Streak freezes | "Life happens" - 1 excused absence doesn't break streak |
| 113 | Daily reminder | "Raid tonight at 8pm - are you ready?" push notification |
| 114 | Achievement badges | Collection of unlockable badges for milestones |
| 115 | Lesson completion | "Complete your pre-raid checklist" gamified |
| 116 | Friend quests | "Do a heroic with a guildie this week" bonus XP |
| 117 | Leaderboard anxiety (good kind) | "You're about to drop a league!" motivation |
| 118 | Mascot/personality | Fun guild mascot or personality in notifications? |

### 🏦 Banking Apps (Ideas 119-128)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 119 | Transaction history | Complete loot audit log: date, item, recipient, score at time |
| 120 | Balance display | "Your loot score: 4.2" prominently shown |
| 121 | Spending categories | Loot by slot: "You've gotten 3 weapons, 0 trinkets this tier" |
| 122 | Alerts | "Your score just became highest for mail wearers!" |
| 123 | Statements | Monthly/tier summary: attendance, loot, performance trends |
| 124 | Dispute process | "I think this is wrong" button → officer review workflow |
| 125 | Projected balance | "At current pace, you'll top priority in 2 raids" |
| 126 | Shared accounts | Guild bank visibility: what's available, who deposited |
| 127 | Read-only access | Anyone can VIEW all data, only officers can EDIT |
| 128 | Export data | Download your history as CSV/PDF |

### 🤖 Discord Bots (Ideas 129-135)

| # | Stolen Concept | Parsimonie Adaptation |
|---|----------------|----------------------|
| 129 | /commands | Slash commands: /loot-score, /tonight, /my-upgrades |
| 130 | Reaction roles | React to confirm attendance, select role for raid |
| 131 | Scheduled posts | Auto-post raid reminder 2hrs before |
| 132 | Embeds | Rich loot announcements with item icons, scores |
| 133 | Threads per raid | Auto-create discussion thread for each raid night |
| 134 | Bot DMs | Private "your weekly summary" DM from bot |
| 135 | Voice channel integration | "Raid starting!" notification when RL joins voice |

---

## Technique 3: SCAMPER

### 🎯 Raider.IO Alternatives (Ideas 136-149)

| # | SCAMPER | Parsimonie Idea |
|---|---------|-----------------|
| 136 | Substitute | **Guild Contribution Score** - combines attendance, helpfulness, improvement |
| 137 | Substitute | **Guild Journey Timeline** - visual history of your guild's progression |
| 138 | Combine | **Performance + Loot Correlation** - "You got 3 items and parse went up 8%" |
| 139 | Combine | **"Ready to Raid" composite** - gear + attendance + attunements + consumables |
| 140 | Adapt | **Reliability Score** - attendance + prepared + no drama = high score |
| 141 | Adapt | **Mechanic Mastery Score** - per boss, how clean are you on mechanics |
| 142 | Modify | **Guild Performance Aggregate** - aggregate guild performance, not just individuals |
| 143 | Modify | **Progress Delta** - "+15% improvement this month" more prominent than raw score |
| 144 | Put to other uses | **Mentor Score** - track who helps others, answers questions |
| 145 | Put to other uses | **Recruit Fit Calculator** - does this applicant match our guild profile |
| 146 | Eliminate | **Guild-Only Visibility** - detailed stats visible only to your guild |
| 147 | Eliminate | **Context Scores** - "Score (pugs only)" vs "Score (guild groups)" |
| 148 | Reverse | **Improvement Spotlight** - celebrate biggest improvers, not just top scores |
| 149 | Reverse | **PUG Review System** - rate your pug experience (for optional raids) |

### 🎯 WarcraftLogs Enhancements (Ideas 150-162)

| # | SCAMPER | Parsimonie Idea |
|---|---------|-----------------|
| 150 | Substitute | **Improvement %** - "You're 15% better than last week" vs raw parse |
| 151 | Substitute | **Team Synergy Score** - how well does the raid work TOGETHER |
| 152 | Combine | **"Why Your Parse"** - auto-explain: gear diff, comp diff, kill time diff |
| 153 | Combine | **Parse-Aware Loot Suggestions** - "This item = biggest parse gain for you" |
| 154 | Adapt | **Healer/Tank Value Metrics** - deaths prevented, damage mitigated, uptime |
| 155 | Adapt | **"Where I Died" Replay** - personal death recap with suggestions |
| 156 | Modify | **Simplified Report Card** - A/B/C/D/F instead of percentiles |
| 157 | Modify | **Parse Trend Line** - graph your improvement over the tier |
| 158 | Put to other uses | **Roster Optimizer** - "Your best comp for boss X based on logs" |
| 159 | Eliminate | **Private Mode** - see your own logs, guild sees only what you share |
| 160 | Eliminate | **TL;DR Mode** - "3 things to fix, 2 things you did great" |
| 161 | Reverse | **Personal Best Tracker** - celebrate YOUR improvement journey |
| 162 | Reverse | **Win Replay** - auto-clip your best moments, not just fails |

### 🎯 Wowhead/Database Improvements (Ideas 163-169)

| # | SCAMPER | Parsimonie Idea |
|---|---------|-----------------|
| 163 | Substitute | **My BiS List** - pre-filtered for YOUR character, YOUR guild's progress |
| 164 | Combine | **"Has It Dropped?"** - track if item has dropped for your guild yet |
| 165 | Combine | **"Will I Be There?"** - filter loot by bosses you'll actually fight |
| 166 | Adapt | **Guild Loot Wishlist** - aggregate: "5 people need this trinket" |
| 167 | Modify | **Loot Action Plan** - "This week target: Boss 3, 5, 7 for your upgrades" |
| 168 | Eliminate | **Top 3 Upgrades Only** - curated, not comprehensive |
| 169 | Reverse | **Push Notifications** - "X item dropped tonight and you weren't there!" |

### 🎯 Theorycrafting Simplification (Ideas 170-176)

| # | SCAMPER | Parsimonie Idea |
|---|---------|-----------------|
| 170 | Substitute | **Pre-Calculated Recommendations** - no sim needed, use TBC community BiS |
| 171 | Combine | **Realistic BiS** - best items from bosses you'll actually kill |
| 172 | Combine | **"When Will I Get It?"** - estimate based on drop rate + your score |
| 173 | Adapt | **Raid Comp Optimizer** - "If we bring X comp, raid DPS = Y" |
| 174 | Modify | **Plain English Recommendations** - "Equip X, it's 2% better" |
| 175 | Eliminate | **Instant Comparison** - pre-calculated popular item combos |
| 176 | Reverse | **"Skip This" Alerts** - "This item is only 0.5% upgrade, don't stress" |

---

## TBC-Specific Ideas (177-200)

| # | TBC-Specific Idea | Category |
|---|-------------------|----------|
| 177 | **Attunement Progress Board** - Visual guild-wide: who's attuned to what | Roster |
| 178 | **Attunement Chain Helper** - "To get SSC attuned, you need: [quest chain with status]" | Onboarding |
| 179 | **Heroic Key Tracker** - Who has which heroic keys, coordinate key carriers | Roster |
| 180 | **Resistance Gear Checklist** - "For Hydross: you need X SR, you have Y" per raider | Gear |
| 181 | **Badge Count Tracker** - How many Badges of Justice each raider has | Gear |
| 182 | **Heroic Lockout Tracker** - Daily lockouts: who's saved where, plan heroic groups | Roster |
| 183 | **Consumable Requirements per Boss** - "Mother Shahraz: Shadow Resist pots, SR food" | Pre-Raid |
| 184 | **Flask/Elixir Tracker** - TBC consumables are EXPENSIVE - track who has what | Consumables |
| 185 | **Profession Synergy Map** - Who has what crafting profession, who can make what | Guild Ops |
| 186 | **BoE Crafted Gear Tracker** - Track who needs expensive crafted pieces (Spellstrike, etc.) | Gear |
| 187 | **Primal/Nether Farming Tracker** - Guild resource pool, who contributed what | Economy |
| 188 | **Raid Lockout Calendar** - Weekly lockouts: who's saved to what, plan split runs | Roster |
| 189 | **10-Man vs 25-Man Tracker** - Track Kara/ZA separate from 25-mans | Roster |
| 190 | **Server First Race Tracker** - Track your guild vs others on server for progression | Competition |
| 191 | **Group Composition Planner** - Assign raiders to groups for optimal buff distribution | Roster |
| 192 | **Totem/Aura Optimizer** - "Group 1 needs Windfury, Group 3 needs Mana Spring" | Raid Comp |
| 193 | **Melee vs Ranged Stack Tracker** - TBC favors ranged, track your comp balance | Roster |
| 194 | **Spec Viability Guide** - "For T5: Ret is okay, for T6: Ret is great" phase guidance | Theorycrafting |
| 195 | **Arena Team Tracker** - If PvP matters: track arena teams, ratings, point caps | PvP |
| 196 | **Honor/Arena Point Gear** - Some PvP gear is pre-raid BiS, track who needs what | Gear |
| 197 | **World Boss Timer** - Doom Lord Kazzak, Doomwalker tracking and notifications | World Events |
| 198 | **Guild Bank Request System** - Request mats for resist gear, enchants, gems | Economy |
| 199 | **Enchant/Gem Audit** - "Raider X is missing enchant on legs" pre-raid check | Gear |
| 200 | **Sunwell Offensive Progression** - Track server-wide phase unlocks | Community |

---

## Technique 4: What If Scenarios

### 🌟 API Access Dreams (Ideas 201-205)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 201 | Live raid feed | **Post-raid replay links** - Auto-link to WarcraftLogs replay |
| 202 | In-game overlay | **Mobile-friendly quick lookup** - Check scores on phone during raid |
| 203 | Auto-sync gear | **Manual "refresh my gear" button** - Pull latest from Armory |
| 204 | Push loot directly | **Loot announcement bot** - Discord shows who won before trade |
| 205 | Auto-attendance | **Screenshot parser** - Upload /who screenshot → auto-attendance |

### 🌟 Content Creation (Ideas 206-210)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 206 | Everyone streams | **POV clips collection** - Encourage raiders to clip clutch moments |
| 207 | User-generated guides | **Guild Knowledge Base** - Wiki: "How WE play frost mage in our comp" |
| 208 | Crowd-sourced strats | **Strat Discussion Threads** - Structured "how should we handle X" |
| 209 | Meme hall of fame | **Highlight Reel Generator** - Best moments from each tier |
| 210 | Tutorial marketplace | **Mentor Matching System** - Pair experienced raiders with learners |

### 🌟 Automated Loot (Ideas 211-215)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 211 | AI loot master | **Loot Recommendation Engine** - "System suggests: give to X because..." |
| 212 | Auto-distribute | **Pre-calculated priority lists** - Before raid, know who's first for each item |
| 213 | Loot futures | **Wishlist Priority** - Raiders declare top wants, factor into decisions |
| 214 | Auto appeals | **Structured Appeal Form** - Clear process: submit → officer review |
| 215 | Predictive loot | **Loot Projection** - "Based on scores and drop rates, expect upgrade in X raids" |

### 🌟 Self-Running Guild (Ideas 216-220)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 216 | Auto-roster | **Smart Roster Suggestions** - "Tonight's optimal 25: [list]" for approval |
| 217 | Bench swaps | **Bench Swap Board** - "I can't make Tuesday, anyone want my spot?" |
| 218 | Auto trial eval | **Trial Scorecard** - Objective metrics: attendance, improvement, mechanics |
| 219 | Bot recruitment | **Application Scoring** - Auto-flag: attunement status, gear level |
| 220 | Officer elections | **Officer Feedback System** - Anonymous feedback on officer performance |

### 🌟 Prediction Features (Ideas 221-225)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 221 | Predict quits | **Engagement Warning Signs** - Track declining attendance, parse drops |
| 222 | Predict wipes | **Guild Learning Curve Tracker** - "We average 15 wipes to first kill" |
| 223 | Predict loot | **Tier Loot Projection** - Based on roster + drop rates, who gets geared when |
| 224 | Predict roster holes | **Roster Health Forecast** - "3 DPS at risk of burnout, start recruiting" |
| 225 | Predict improvement | **Personal Growth Projection** - "At this rate, 90% parse by week 6" |

### 🌟 Guild Fame (Ideas 226-230)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 226 | Guild reality show | **Raid Night Recaps** - Public "this week in Parsimonie" posts |
| 227 | Server presence | **Public Progress Page** - Shareable guild boss kills |
| 228 | Recruitment brand | **Recruitment Landing Page** - Professional "why join us" presentation |
| 229 | Inter-guild rivalry | **Server Race Tracker** - Compare progress with other guilds |
| 230 | Guild merch | **Guild Merch Generator** - Custom guild logo on shirts (fun!) |

### 🌟 Eternal Legacy (Ideas 231-235)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 231 | Eternal records | **Guild History Archive** - Complete record of every raid, loot, roster |
| 232 | Legacy profiles | **Alumni Wall** - Honor past raiders, their contributions |
| 233 | Generational guild | **Guild Charter & Values Doc** - Written culture for future leaders |
| 234 | Speedrun optimization | **Clear Time Tracker** - Track speed improvements over time |
| 235 | Perfect tier | **"Perfect Week" Celebration** - Recognize when everything goes right |

### 🌟 Total Transparency (Ideas 236-240)

| # | Wild Idea | Practical Extraction |
|---|-----------|---------------------|
| 236 | Public officer talks | **Officer Decision Log** - Public "why we decided X" explanations |
| 237 | Open loot council | **Loot Decision Reasoning** - Auto-generated "awarded because..." |
| 238 | Visible bench algo | **Bench Rotation Display** - Clear schedule, clear logic |
| 239 | Public performance | **Opt-in Public Profiles** - Choose what stats are visible |
| 240 | Contribution tracking | **Contribution Recognition** - Visible: who does invisible work |

---

## Technique 5: Ecosystem Thinking

### 🔄 Health Indicators (Ideas 241-248)

| # | Ecosystem Idea | Parsimonie Feature |
|---|----------------|-------------------|
| 241 | Population health | **Roster Stability Dashboard** - Track roster changes over time |
| 242 | Role diversity | **Role Diversity Meter** - "You have 1 resto druid - RISK" warnings |
| 243 | Officer load | **Officer Load Balancer** - Track who's doing what work |
| 244 | Engagement metrics | **Engagement Tracker** - Who speaks in Discord, joins optional content |
| 245 | Trial pipeline | **Trial → Core Pipeline** - Visualize recruitment funnel |
| 246 | Mentorship | **Mentor → Mentee Connections** - Track who's helping who grow |
| 247 | Drama detection | **Drama Early Warning** - Detect patterns: declining participation |
| 248 | Single points of failure | **SPOF Alerts** - "Only 1 warlock has Shadowfury spec" |

### 🌊 Resource Flows (Ideas 249-254)

| # | Resource Flow Idea | Parsimonie Feature |
|---|-------------------|-------------------|
| 249 | Time tracking | **Time Investment Tracker** - "Guild asks ~8hrs/week from raiders" |
| 250 | Loot visualization | **Loot Flow Visualization** - Items moving from bosses → players |
| 251 | Knowledge sharing | **Knowledge Sharing Tracker** - Who answers questions, writes guides |
| 252 | Morale check | **Morale Pulse Check** - Quick "how are you feeling" surveys |
| 253 | Reputation | **Reputation Dashboard** - Track guild server standing |
| 254 | Social connections | **Social Connection Map** - Who plays with who outside raid |

### 🦠 Threat Detection (Ideas 255-262)

| # | Threat Detection Idea | Parsimonie Feature |
|---|----------------------|-------------------|
| 255 | Burnout detection | **Burnout Risk Score** - attendance + performance + activity drops |
| 256 | Drama patterns | **Drama Pattern Detection** - Unusual activity, attendance changes |
| 257 | Fairness audit | **Loot Fairness Audit** - "Is distribution statistically fair?" |
| 258 | Content staleness | **Content Staleness Tracker** - "Cleared this 8 times. Try challenges?" |
| 259 | Departure risk | **Departure Risk Matrix** - Track who might leave based on patterns |
| 260 | Key dependencies | **Key Player Dependencies** - "If X leaves, these roles at risk" |
| 261 | Recruitment health | **Recruitment Pipeline Health** - Apps received, conversion rate |
| 262 | Life calendar | **Real Life Calendar** - Track known upcoming absences |

### 🌻 Growth & Succession (Ideas 263-268)

| # | Growth Idea | Parsimonie Feature |
|---|-------------|-------------------|
| 263 | Player journey | **Player Journey Tracker** - Trial → Core → Veteran → Officer |
| 264 | Leadership pipeline | **Leadership Pipeline** - Who's being groomed for officer? |
| 265 | Knowledge contributions | **Knowledge Base Contributions** - Track who adds to guild wisdom |
| 266 | Culture docs | **Culture Documentation** - Written "how we do things" guide |
| 267 | Succession planning | **Succession Planning Tool** - "If GM quits, here's the plan" |
| 268 | Mentor effectiveness | **Mentor Effectiveness** - Do mentored players improve faster? |

### ⚖️ Balance Features (Ideas 269-273)

| # | Balance Idea | Parsimonie Feature |
|---|-------------|-------------------|
| 269 | Competition dial | **Competition Settings** - How visible are rankings? |
| 270 | Rules clarity | **Rules Clarity Score** - Are policies documented? Findable? |
| 271 | Social health | **Social Health Indicators** - Beyond raid: who plays together? |
| 272 | Progression satisfaction | **Progression Survey** - "Are we pushing too hard/not enough?" |
| 273 | Transparency settings | **Transparency Config** - What's public vs officer-only? |

### 🔮 Lifecycle Awareness (Ideas 274-278)

| # | Lifecycle Idea | Parsimonie Feature |
|---|---------------|-------------------|
| 274 | Tier phase awareness | **Tier Phase Indicator** - "Week 8 of tier: watch for fatigue" |
| 275 | Seasonal goals | **Seasonal Goal Suggestions** - "Farm phase: try speed clears" |
| 276 | Off-tier activities | **Off-Tier Activity Tracker** - Keep guild engaged between content |
| 277 | Pre-tier prep | **Pre-Tier Prep Checklist** - "New tier in 3 weeks: ready?" |
| 278 | Energy conservation | **Energy Conservation Mode** - Suggest reduced schedule during burnout |

### 🌍 Symbiosis Features (Ideas 279-283)

| # | Symbiosis Idea | Parsimonie Feature |
|---|---------------|-------------------|
| 279 | Role interdependency | **Role Interdependency Map** - Visualize who enables who |
| 280 | Bench recognition | **Bench Value Recognition** - "Bench raiders made 15 appearances" |
| 281 | Veteran impact | **Veteran Impact Tracking** - How much do vets accelerate trials? |
| 282 | Crafting network | **Crafting Network** - Who can make what for who |
| 283 | Officer workload | **Officer Workload Distribution** - Visualize who handles what |

---

## Session Summary

**Total Ideas Generated:** 283
**Techniques Used:** Role Playing, Cross-Pollination, SCAMPER, What If Scenarios, Ecosystem Thinking

**Key Themes Emerged:**
1. **Transparency & Trust** - Your guild values openness, Parsimonie should reinforce that
2. **Loot Fairness** - Complex system needs clear visualization and explanation
3. **TBC-Specific Needs** - Attunements, resist gear, consumables, group comp optimization
4. **Casual-Friendly** - Support all player types, not just parse chasers
5. **Guild Health** - Beyond performance: track engagement, burnout, retention
6. **Automation** - Reduce officer burden, let systems handle routine decisions

---

## Feature Prioritization

### 🔴 MVP (Must Have for Launch)

**A. Loot System** - Core differentiator

| # | Feature | Description |
|---|---------|-------------|
| 7 | Transparency Loot Ledger | Public audit log: who got what, when, score before/after |
| 8 | Presence/Loot Score Calculator | Your exact formula: attendance ÷ loot received = priority |
| 9 | Coveted Item Rules Engine | Special rules for tier sets, weapons, trinkets |
| 10 | Loot Master Justification Log | Record WHY exceptions were made, visible to all |
| 21 | Loot Decision Audit Trail | Auto-generated "awarded because: class prio + behavior + score" |
| 119 | Transaction History | Complete loot log: date, item, recipient, score at time |
| 120 | Loot Score Display | "Your loot score: 4.2" prominently shown |
| 127 | Read-only Access | Anyone can VIEW all data, only officers can EDIT |

**C. Pre-Raid Essentials** - Reduce prep time for everyone

| # | Feature | Description |
|---|---------|-------------|
| 3 | Pre-Raid Dashboard | One screen: who's confirmed, gear gaps, what they're targeting |
| 43 | Consumables Checklist | "Tonight you need: Flask X, Food Y, Potions Z" per class/spec |
| 44 | Quick Strat Cards | TL;DR boss summaries: 3-5 bullet points, your role highlighted |
| 45 | "What Should I Target?" | Simple view: "Your top 3 upgrades tonight" |
| 74 | Boss Mechanic Quick Reference | Mechanic → What it does → How to handle → When it happens |

**D. TBC-Specific Core** - Unique to TBC Classic

| # | Feature | Description |
|---|---------|-------------|
| 177 | Attunement Progress Board | Visual guild-wide: who's attuned to SSC, TK, Hyjal, BT |
| 178 | Attunement Chain Helper | "To get SSC attuned, you need: [quest chain with status]" |
| 179 | Heroic Key Tracker | Who has which heroic keys, coordinate key carriers |
| 180 | Resistance Gear Checklist | "For Hydross: you need X SR, you have Y" per raider |
| 183 | Consumable Requirements per Boss | "Mother Shahraz: Shadow Resist pots, SR food" |
| 199 | Enchant/Gem Audit | "Raider X is missing enchant on legs" pre-raid check |

---

### 🟡 Nice-to-Have (Post-Launch Priority)

**B. Roster & Attendance**

| # | Feature | Description |
|---|---------|-------------|
| 1 | Bench Rotation Tracker | Visual calendar: who's benched when, auto-rotates DPS |
| 2 | Bench = Present Toggle | Benched raiders still accumulate attendance credit |
| 6 | Absence Tracker | Log absences as justified/unjustified, auto-flag patterns |
| 47 | Rotation Calendar | "You're raiding Tue/Thu, benched next Wed" |
| 79 | Attendance Confirmation | Deadline with notifications for raid signups |

**E. Integration**

| # | Feature | Description |
|---|---------|-------------|
| 20 | RCLootCouncil Data Sync | Import/export between Parsimonie and RCLC addon |
| 129 | Discord Slash Commands | /loot-score, /tonight, /my-upgrades |
| 131 | Scheduled Raid Reminders | Auto-post reminder 2hrs before raid |
| 132 | Rich Loot Announcements | Discord embeds with item icons, scores |
| 134 | Weekly Summary DMs | Private "your weekly summary" from bot |

**F. Performance & Analysis**

| # | Feature | Description |
|---|---------|-------------|
| 24 | Post-Raid Performance Summary | Your parse, class rank, role rank, raid rank |
| 30 | Personal Raid Stats Page | Attendance %, best parses, loot history per tier |
| 37 | Progress Over Time Charts | Parse trend across weeks/bosses/tiers |
| 67 | Wipe Cause Analyzer | Categorize: personal error / raid call / tuning |

**G. Theorycrafting**

| # | Feature | Description |
|---|---------|-------------|
| 39 | BiS Targeting Dashboard | "Your biggest upgrades this tier from [bosses]" |
| 163 | My BiS List | Pre-filtered for YOUR character, YOUR guild's progress |
| 170 | Pre-Calculated Recommendations | No sim needed, use TBC community BiS lists |

---

### 🟢 Future (Long-term Vision)

**H. Community & Gamification**

| # | Feature | Description |
|---|---------|-------------|
| 49 | Recognition Beyond Parses | "Most reliable", "Always prepared", "Helpful" badges |
| 89 | Kudos Reactions | Quick "nice parse!" reactions from guildies |
| 109 | Attendance Streaks | "Raid attendance streak: 12 weeks!" |
| 114 | Achievement Badges | Collection of unlockable milestones |

**I. Guild Health & Prediction**

| # | Feature | Description |
|---|---------|-------------|
| 221 | Engagement Warning Signs | Track declining attendance, parse drops |
| 241 | Roster Stability Dashboard | Track roster changes over time |
| 255 | Burnout Risk Score | Attendance + performance + activity drops |
| 259 | Departure Risk Matrix | Track who might leave based on patterns |

**J. Recruitment & Onboarding**

| # | Feature | Description |
|---|---------|-------------|
| 57 | Catch-Up Checklist | "To raid-ready: ☐ Attunements ☐ Heroics ☐ Resist gear" |
| 106 | Recruiter Tools | Search: "Find healers, SSC attuned, T5 experience" |
| 228 | Recruitment Landing Page | Professional "why join us" presentation |

**K. Advanced Features**

| # | Feature | Description |
|---|---------|-------------|
| 158 | Roster Optimizer | "Your best comp for boss X based on logs" |
| 191 | Group Composition Planner | Assign raiders to groups for optimal buffs |
| 192 | Totem/Aura Optimizer | "Group 1 needs Windfury, Group 3 needs Mana Spring" |
| 231 | Guild History Archive | Complete record of every raid, loot, roster |

---

## Next Steps

1. ✅ Brainstorming complete - 283 ideas generated
2. ✅ Prioritization complete - MVP, Nice-to-Have, Future defined
3. ⏭️ **Next:** Research workflow - Analyze WoW APIs, similar tools, technical feasibility
4. ⏭️ **Then:** Product Brief - Define vision, goals, success metrics
5. ⏭️ **Then:** PRD - Full requirements document

