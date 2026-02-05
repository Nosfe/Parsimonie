---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
currentStep: complete
status: approved
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-parsimonie-2026-01-22.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/research/technical-parsimonie-apis-research-2026-01-22.md'
workflowType: 'architecture'
project_name: 'Parsimonie'
user_name: 'Yaji'
date: '2026-02-05'
---

# Architecture Decision Document - Parsimonie

**Author:** Yaji  
**Date:** 2026-02-05  
**Status:** In Progress

---

## Executive Summary

Parsimonie is a WoW TBC Anniversary guild management platform that aggregates data from WarcraftLogs, Battle.net, and Wowhead into a unified raider experience. This architecture document captures all technical decisions needed for consistent AI-agent implementation.

### Key Technical Decisions (Preview)

| Aspect | Decision |
|--------|----------|
| **Frontend** | Angular 21 SPA (standalone components) |
| **Backend** | .NET 10 Web API (Controllers) |
| **Database** | PostgreSQL (Azure) |
| **Auth** | Discord OAuth → JWT |
| **Real-Time** | SignalR (role assignments only) |
| **Hosting** | Azure (App Service + Azure SQL) |
| **Design System** | Tailwind CSS + Custom Components |

---

## Project Context (From Input Documents)

### From PRD

- **MVP Scope:** 7 features (Discord OAuth, Roster, Gear, Wishlist, Parses, Tonight's Raid, Tips)
- **Users:** Raiders (~40), Officers (4), GM (1), Public visitors
- **Real-Time:** Role assignments only (SignalR)
- **Performance:** < 2s page load, < 500ms API response
- **Availability:** 99.9% during raid hours (Wed-Thu 19:00-24:00 CET)

### From UX Specification

- **Core Experience:** 5-second glance — raid role + readiness status
- **Design System:** Tailwind CSS + Custom Angular Components
- **Color Palette:** TBC-inspired (fel green, gold, dark)
- **Desktop-First:** Mobile deprioritized
- **Accessibility:** WCAG AA compliance

### From Technical Research

- **Battle.net API:** Character Equipment, Guild Roster (fully supported)
- **WarcraftLogs API v2:** GraphQL, parse rankings, attendance (fully supported)
- **Discord API:** OAuth, guild membership, role verification (fully supported)
- **Rate Limits:** Battle.net 36k/hour, WarcraftLogs varies by plan

---

## System Architecture

### Decision: Modular Monolith with Docker

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Container                       │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │  Angular 21 SPA │    │      .NET 10 API            │ │
│  │  (Static Files) │───▶│  ┌─────────────────────┐    │ │
│  └─────────────────┘    │  │  Auth Module        │    │ │
│                         │  │  Roster Module      │    │ │
│                         │  │  Gear Module        │    │ │
│                         │  │  Raid Module        │    │ │
│                         │  │  Sync Module        │    │ │
│                         │  └─────────────────────┘    │ │
│                         └────────────┬────────────────┘ │
└──────────────────────────────────────┼──────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │   PostgreSQL Container  │
                          └─────────────────────────┘
```

**Why Modular Monolith:** 40 users, solo dev, no microservices complexity needed.

---

## API Design

### REST with Resource-Based Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/me` | Current user + characters |
| `GET /api/me/gear` | My gear + upgrade simulations |
| `GET /api/me/parses` | My parse history |
| `GET /api/raids/tonight` | Tonight's raid + my assignments |
| `GET /api/raids/{id}/bosses` | Boss list with role assignments |
| `POST /api/admin/roster` | Officer: manage roster |
| `PUT /api/admin/assignments/{bossId}` | Officer: update role assignments |

**Real-Time:** SignalR hub at `/hubs/raid` for role assignment push only.

---

## Data Model (Core Entities)

```
User (Discord ID, roles)
  └─▶ Character[] (name, realm, class, spec, isMain)
        └─▶ GearSnapshot[] (slot, itemId, enchant, gems)
        └─▶ ParseRecord[] (bossId, percentile, date)

Raid
  └─▶ Boss[]
        └─▶ RoleAssignment[] (characterId, role, notes)

LootItem (itemId, bossId, slot, stats)
  └─▶ UpgradeValue[] (characterId, dpsGain)
```

---

## External API Integration

| API | Sync Strategy | Cache Duration |
|-----|---------------|----------------|
| **Battle.net** | Hourly background job | 1 hour |
| **WarcraftLogs** | Hourly + on-demand | 1 hour |
| **Discord** | Real-time at login | Session |
| **Wowhead** | Manual import (boss strats) | Indefinite |

**Rate Limit Protection:** Exponential backoff, request queuing.

---

## Authentication Flow

```
User clicks "Login with Discord"
        │
        ▼
Discord OAuth (authorize)
        │
        ▼
Callback: Verify guild membership + role
        │
        ▼
Issue JWT (24h expiry, 7d refresh)
        │
        ▼
Frontend stores in httpOnly cookie
```

---

## Folder Structure

```
/parsimonie
├── /src
│   ├── /Parsimonie.Web          # Angular 21 SPA
│   │   ├── /app
│   │   │   ├── /core            # Services, guards, interceptors
│   │   │   ├── /features
│   │   │   │   ├── /dashboard   # Tonight's raid, readiness
│   │   │   │   ├── /character   # Gear, parses, wishlist
│   │   │   │   ├── /raid        # Boss strats, assignments
│   │   │   │   └── /admin       # Officer tools
│   │   │   └── /shared          # Components, pipes, directives
│   │   └── tailwind.config.js
│   │
│   └── /Parsimonie.Api          # .NET 10 Web API (Controllers)
│       ├── /Controllers
│       │   ├── AuthController.cs
│       │   ├── MeController.cs
│       │   ├── RaidsController.cs
│       │   ├── RosterController.cs
│       │   └── AdminController.cs
│       ├── /Services
│       │   ├── /Auth
│       │   ├── /Roster
│       │   ├── /Gear
│       │   ├── /Raids
│       │   └── /Sync
│       ├── /Models
│       │   ├── /Entities        # EF Core entities
│       │   ├── /DTOs            # Request/Response DTOs
│       │   └── /Mapping         # AutoMapper profiles
│       ├── /Infrastructure
│       │   ├── /Data            # DbContext, migrations
│       │   └── /ExternalApis    # Battle.net, WarcraftLogs clients
│       ├── /Hubs
│       │   └── RaidHub.cs       # SignalR hub
│       └── Program.cs
│
├── /tests
├── /docs
├── Dockerfile
└── docker-compose.yml
```

---

## Docker Containerization

### Multi-Stage Dockerfile

```dockerfile
# Build stage - Angular
FROM node:22-alpine AS angular-build
WORKDIR /app/web
COPY src/Parsimonie.Web/package*.json ./
RUN npm ci
COPY src/Parsimonie.Web/ ./
RUN npm run build -- --configuration production

# Build stage - .NET
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /app/api
COPY src/Parsimonie.Api/*.csproj ./
RUN dotnet restore
COPY src/Parsimonie.Api/ ./
RUN dotnet publish -c Release -o /publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=api-build /publish ./
COPY --from=angular-build /app/web/dist/parsimonie/browser ./wwwroot
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Parsimonie.Api.dll"]
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  parsimonie:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ConnectionStrings__Default=Host=db;Database=parsimonie;Username=parsimonie;Password=${DB_PASSWORD}
      - Discord__ClientId=${DISCORD_CLIENT_ID}
      - Discord__ClientSecret=${DISCORD_CLIENT_SECRET}
      - BattleNet__ClientId=${BATTLENET_CLIENT_ID}
      - BattleNet__ClientSecret=${BATTLENET_CLIENT_SECRET}
      - WarcraftLogs__ClientId=${WARCRAFTLOGS_CLIENT_ID}
      - WarcraftLogs__ClientSecret=${WARCRAFTLOGS_CLIENT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=parsimonie
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=parsimonie
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deployment Options (All Work with Docker)

| Platform | Command | Notes |
|----------|---------|-------|
| **Any VPS** | `docker compose up -d` | Any Linux server with Docker |
| **Azure Container Apps** | Push to ACR, deploy | Managed, scales to zero |
| **DigitalOcean** | Connect repo, auto-deploy | Simple PaaS |
| **Fly.io** | `fly deploy` | Edge deployment, cheap |
| **Self-Hosted** | `docker compose up -d` | Your own hardware |

---

## Architecture Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Modular Monolith | Solo dev, 40 users, no microservices overhead |
| **Frontend** | Angular 21 Standalone | Signals for state, standalone components |
| **Backend** | .NET 10 Web API (Controllers) | Traditional structure, services + controllers |
| **Database** | PostgreSQL | Relational fits the data model |
| **ORM** | EF Core | Standard, migrations, LINQ |
| **Auth** | Discord OAuth → JWT | Guild membership gating |
| **Real-Time** | SignalR | Role assignments only |
| **Deployment** | Docker + Docker Compose | Deploy anywhere, zero server concerns |
| **Caching** | In-memory | No Redis needed at this scale |
