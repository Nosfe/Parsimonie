---
title: 'Parsimonie Foundation'
slug: 'foundation'
created: '2026-02-05'
status: 'complete'
stepsCompleted: [1, 2, 3, 4, 5, 6]
nextStep: null
tech_stack:
  - '.NET 10'
  - 'Angular 21'
  - 'PostgreSQL 16'
  - 'Docker'
  - 'Tailwind CSS 4'
  - 'EF Core 10'
files_to_create:
  - 'docker-compose.yml'
  - 'Dockerfile'
  - 'src/Parsimonie.Api/**'
  - 'src/Parsimonie.Web/**'
---

# Tech Spec: Parsimonie Foundation

## Overview

### Problem Statement
Parsimonie needs a solid foundation before building features. This includes project scaffolding, database setup, Discord authentication with guild/role gating, and the Angular frontend shell.

### Solution
Create a Docker-based development environment with .NET 10 API (controller-based), PostgreSQL database, and Angular 21 SPA. Implement Discord OAuth with guild membership and "Raider" role verification.

### In Scope
- Project structure and Docker configuration
- PostgreSQL database with EF Core and core entities
- Discord OAuth → JWT authentication flow
- Guild server + "Raider" role verification
- Angular 21 shell with routing and auth guards
- Tailwind CSS setup with TBC color palette

### Out of Scope
- Feature endpoints (gear, raids, parses)
- External API integrations (Battle.net, WarcraftLogs)
- SignalR real-time functionality
- UI beyond login/landing

---

## Context for Development

### Environment
- **Dev URL:** `https://localhost:5001` (API), `http://localhost:4200` (Angular)
- **Discord Role:** "Raider" grants access
- **Database:** PostgreSQL via Docker

### Configuration (Environment Variables)
```
DISCORD_CLIENT_ID=<your-discord-app-client-id>
DISCORD_CLIENT_SECRET=<your-discord-app-client-secret>
DISCORD_GUILD_ID=<your-parsimonie-server-id>
DISCORD_ROLE_NAME=Raider
JWT_SECRET=<generate-256-bit-secret>
DATABASE_URL=Host=localhost;Database=parsimonie;Username=parsimonie;Password=parsimonie_dev
```

### Discord OAuth Callback
Configure in Discord Developer Portal:
- Redirect URI: `https://localhost:5001/api/auth/callback`

---

## Data Model

### Core Entities

```
User
├── Id: Guid (PK)
├── DiscordId: string (unique)
├── DiscordUsername: string
├── DiscordAvatar: string?
├── Roles: UserRole[] (flags: Raider, Officer, GM)
├── CreatedAt: DateTime
└── LastLoginAt: DateTime

Character
├── Id: Guid (PK)
├── UserId: Guid (FK → User)
├── Name: string
├── Realm: string
├── Class: WowClass (enum)
├── Spec: WowSpec (enum)
├── IsMain: bool
├── CreatedAt: DateTime
└── UpdatedAt: DateTime

RefreshToken
├── Id: Guid (PK)
├── UserId: Guid (FK → User)
├── Token: string (hashed)
├── ExpiresAt: DateTime
├── CreatedAt: DateTime
└── RevokedAt: DateTime?
```

### Enums

```csharp
[Flags]
public enum UserRole
{
    None = 0,
    Raider = 1,
    Officer = 2,
    GM = 4
}

public enum WowClass
{
    Warrior, Paladin, Hunter, Rogue, Priest,
    Shaman, Mage, Warlock, Druid
}

public enum WowSpec
{
    // Warriors
    Arms, Fury, Protection_Warrior,
    // Paladins
    Holy_Paladin, Protection_Paladin, Retribution,
    // Hunters
    BeastMastery, Marksmanship, Survival,
    // Rogues
    Assassination, Combat, Subtlety,
    // Priests
    Discipline, Holy_Priest, Shadow,
    // Shamans
    Elemental, Enhancement, Restoration_Shaman,
    // Mages
    Arcane, Fire, Frost_Mage,
    // Warlocks
    Affliction, Demonology, Destruction,
    // Druids
    Balance, FeralCombat, Restoration_Druid
}
```

---

## Implementation Stories

### Story 1: Project Scaffolding & Docker Setup

**As a** developer  
**I want** a complete project structure with Docker  
**So that** I can run the full stack locally with one command

#### Acceptance Criteria

```gherkin
Given I have Docker installed
When I run `docker compose up -d`
Then PostgreSQL starts on port 5432
And the database "parsimonie" is created
And I can connect with the configured credentials

Given the solution exists
When I open it in VS Code / Rider
Then the API project builds without errors
And the Web project builds without errors
```

#### Tasks

**1.1 Create Solution Structure**
```
/parsimonie
├── src/
│   ├── Parsimonie.Api/
│   │   ├── Parsimonie.Api.csproj
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   │   ├── Entities/
│   │   │   ├── DTOs/
│   │   │   └── Enums/
│   │   └── Infrastructure/
│   │       ├── Data/
│   │       └── Extensions/
│   └── Parsimonie.Web/
│       └── (Angular 21 app)
├── tests/
│   └── Parsimonie.Api.Tests/
├── docker-compose.yml
├── docker-compose.override.yml
├── Dockerfile
├── .env.example
├── .gitignore
└── Parsimonie.sln
```

**1.2 Create docker-compose.yml**
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: parsimonie
      POSTGRES_PASSWORD: parsimonie_dev
      POSTGRES_DB: parsimonie
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U parsimonie"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**1.3 Create .NET 10 API Project**
- Create `Parsimonie.Api.csproj` with packages:
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `Microsoft.EntityFrameworkCore.Design`
  - `Npgsql.EntityFrameworkCore.PostgreSQL`
  - `Swashbuckle.AspNetCore`
- Create `Program.cs` with:
  - Controller routing
  - Swagger (dev only)
  - CORS for localhost:4200
  - Exception handling middleware

**1.4 Create .env.example**
```
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
DISCORD_ROLE_NAME=Raider
JWT_SECRET=
DATABASE_URL=Host=localhost;Database=parsimonie;Username=parsimonie;Password=parsimonie_dev
```

---

### Story 2: Database & EF Core Setup

**As a** developer  
**I want** the database schema created via EF Core migrations  
**So that** I have a type-safe data layer

#### Acceptance Criteria

```gherkin
Given the database is running
When I run `dotnet ef database update`
Then the Users table is created
And the Characters table is created
And the RefreshTokens table is created
And all indexes and foreign keys are applied

Given I query the database
When I use the DbContext
Then I can CRUD User entities
And I can CRUD Character entities with User relationships
```

#### Tasks

**2.1 Create Entity Classes**
- `src/Parsimonie.Api/Models/Entities/User.cs`
- `src/Parsimonie.Api/Models/Entities/Character.cs`
- `src/Parsimonie.Api/Models/Entities/RefreshToken.cs`

**2.2 Create Enums**
- `src/Parsimonie.Api/Models/Enums/UserRole.cs`
- `src/Parsimonie.Api/Models/Enums/WowClass.cs`
- `src/Parsimonie.Api/Models/Enums/WowSpec.cs`

**2.3 Create DbContext**
- `src/Parsimonie.Api/Infrastructure/Data/ParsimonieDbContext.cs`
- Configure entity relationships and indexes
- Add `OnModelCreating` for:
  - User.DiscordId unique index
  - Character composite index on (Name, Realm)
  - RefreshToken.Token index

**2.4 Register DbContext in Program.cs**
```csharp
builder.Services.AddDbContext<ParsimonieDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
```

**2.5 Create Initial Migration**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

### Story 3: Discord OAuth Authentication

**As a** user  
**I want** to log in with my Discord account  
**So that** I can access Parsimonie if I'm a guild member with the Raider role

#### Acceptance Criteria

```gherkin
Given I am not logged in
When I click "Login with Discord"
Then I am redirected to Discord's OAuth page
And I see the Parsimonie app requesting identify and guilds.members.read scopes

Given I authorize the app
When Discord redirects back to Parsimonie
Then the API verifies I am in the guild server
And the API verifies I have the "Raider" role
And I receive a JWT access token (24h expiry)
And I receive a refresh token (7d expiry)

Given I am NOT in the guild server
When Discord redirects back
Then I see "You must be a member of the Parsimonie Discord server"

Given I am in the guild but don't have the Raider role
When Discord redirects back
Then I see "You must have the Raider role to access Parsimonie"
```

#### Tasks

**3.1 Create Auth DTOs**
- `src/Parsimonie.Api/Models/DTOs/Auth/LoginResponseDto.cs`
- `src/Parsimonie.Api/Models/DTOs/Auth/RefreshTokenRequestDto.cs`
- `src/Parsimonie.Api/Models/DTOs/Auth/UserDto.cs`

**3.2 Create Discord Service**
- `src/Parsimonie.Api/Services/Auth/IDiscordService.cs`
- `src/Parsimonie.Api/Services/Auth/DiscordService.cs`
- Methods:
  - `GetAuthorizationUrl()` → Discord OAuth URL
  - `ExchangeCodeAsync(code)` → Discord access token
  - `GetUserAsync(accessToken)` → Discord user info
  - `GetGuildMemberAsync(accessToken, guildId)` → Member info with roles
  - `HasRequiredRole(member, roleName)` → bool

**3.3 Create JWT Service**
- `src/Parsimonie.Api/Services/Auth/IJwtService.cs`
- `src/Parsimonie.Api/Services/Auth/JwtService.cs`
- Methods:
  - `GenerateAccessToken(user)` → JWT (24h)
  - `GenerateRefreshToken()` → secure random string
  - `ValidateRefreshToken(token)` → User or null

**3.4 Create Auth Controller**
- `src/Parsimonie.Api/Controllers/AuthController.cs`
- Endpoints:
  - `GET /api/auth/login` → Redirect to Discord
  - `GET /api/auth/callback?code=` → Handle OAuth callback, return tokens
  - `POST /api/auth/refresh` → Refresh access token
  - `POST /api/auth/logout` → Revoke refresh token

**3.5 Configure JWT Authentication in Program.cs**
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "Parsimonie",
            ValidAudience = "Parsimonie",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Secret"]))
        };
    });
```

**3.6 Create Discord Configuration**
- `src/Parsimonie.Api/Infrastructure/Extensions/DiscordOptions.cs`
- Bind from `appsettings.json` Discord section

---

### Story 4: Protected API Endpoints

**As a** developer  
**I want** a base controller structure with auth  
**So that** feature controllers have consistent patterns

#### Acceptance Criteria

```gherkin
Given I have a valid JWT
When I call GET /api/me
Then I receive my user profile with linked characters

Given I have no JWT or an expired JWT
When I call any protected endpoint
Then I receive 401 Unauthorized

Given I am a Raider (not Officer)
When I call an Officer-only endpoint
Then I receive 403 Forbidden
```

#### Tasks

**4.1 Create Base Controller**
- `src/Parsimonie.Api/Controllers/BaseController.cs`
- Properties: `CurrentUserId`, `CurrentUserRoles`
- Helper: `IsOfficer()`, `IsGM()`

**4.2 Create Me Controller**
- `src/Parsimonie.Api/Controllers/MeController.cs`
- `GET /api/me` → Current user profile
- `GET /api/me/characters` → User's linked characters

**4.3 Create User DTOs**
- `src/Parsimonie.Api/Models/DTOs/User/MeResponseDto.cs`
- `src/Parsimonie.Api/Models/DTOs/User/CharacterDto.cs`

**4.4 Create Authorization Policies**
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Raider", policy => 
        policy.RequireClaim("role", "Raider", "Officer", "GM"));
    options.AddPolicy("Officer", policy => 
        policy.RequireClaim("role", "Officer", "GM"));
    options.AddPolicy("GM", policy => 
        policy.RequireClaim("role", "GM"));
});
```

---

### Story 5: Angular 21 Shell & Auth Integration

**As a** user  
**I want** to see a login page and access protected routes  
**So that** I can authenticate and navigate the app

#### Acceptance Criteria

```gherkin
Given I am not logged in
When I navigate to any protected route
Then I am redirected to /login

Given I am on /login
When I click "Login with Discord"
Then I am redirected to the API's Discord OAuth flow

Given I complete Discord OAuth successfully
When I am redirected back to the app
Then my JWT is stored securely
And I am redirected to /dashboard
And I see "Welcome, [username]!"

Given I am logged in
When I click "Logout"
Then my tokens are cleared
And I am redirected to /login
```

#### Tasks

**5.1 Create Angular 21 Project**
```bash
ng new Parsimonie.Web --style=scss --routing --ssr=false --standalone
```

**5.2 Install & Configure Tailwind CSS 4**
- Install Tailwind + PostCSS
- Create `tailwind.config.js` with TBC color palette:
```javascript
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'portal-black': '#0d0f0e',
        'outland-gray': '#1a1d1c',
        'netherstorm': '#252a28',
        'fel-green': '#70c04a',
        'fel-glow': '#9dd977',
        'tbc-gold': '#d4a843',
        'bronze': '#c49a3d',
      }
    }
  }
}
```

**5.3 Create Core Services**
- `src/app/core/services/auth.service.ts`
  - `login()` → redirect to API OAuth
  - `handleCallback(tokens)` → store tokens
  - `logout()` → clear tokens, redirect
  - `isAuthenticated$` → BehaviorSubject<boolean>
  - `currentUser$` → BehaviorSubject<User | null>
- `src/app/core/services/api.service.ts`
  - Base HTTP client with auth interceptor

**5.4 Create Auth Interceptor**
- `src/app/core/interceptors/auth.interceptor.ts`
- Attach JWT to all API requests
- Handle 401 → trigger token refresh or logout

**5.5 Create Auth Guard**
- `src/app/core/guards/auth.guard.ts`
- Redirect to /login if not authenticated

**5.6 Create Routes**
```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
```

**5.7 Create Login Component**
- `src/app/features/auth/login.component.ts`
- TBC-styled login page with Discord button
- "Login with Discord" → calls `authService.login()`

**5.8 Create Auth Callback Component**
- `src/app/features/auth/auth-callback.component.ts`
- Receives tokens from URL params
- Stores tokens, redirects to dashboard

**5.9 Create Dashboard Shell Component**
- `src/app/features/dashboard/dashboard.component.ts`
- Placeholder: "Welcome, [username]!" + Logout button
- Header with Parsimonie logo (text for now)

**5.10 Create Environment Config**
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

---

### Story 6: Development Dockerfile

**As a** developer  
**I want** a multi-stage Dockerfile  
**So that** I can build and deploy the full stack

#### Acceptance Criteria

```gherkin
Given the Dockerfile exists
When I run `docker build -t parsimonie .`
Then the Angular app builds
And the .NET API builds
And the final image is < 200MB

Given I run the container
When I navigate to http://localhost:8080
Then the Angular app loads
And API calls work correctly
```

#### Tasks

**6.1 Create Multi-Stage Dockerfile**
```dockerfile
# Stage 1: Build Angular
FROM node:22-alpine AS web-build
WORKDIR /app
COPY src/Parsimonie.Web/package*.json ./
RUN npm ci
COPY src/Parsimonie.Web/ ./
RUN npm run build -- --configuration production

# Stage 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /app
COPY src/Parsimonie.Api/*.csproj ./
RUN dotnet restore
COPY src/Parsimonie.Api/ ./
RUN dotnet publish -c Release -o /publish --no-restore

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app
COPY --from=api-build /publish ./
COPY --from=web-build /app/dist/parsimonie-web/browser ./wwwroot

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Parsimonie.Api.dll"]
```

**6.2 Update docker-compose.yml for Full Stack**
```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ConnectionStrings__Default=Host=db;Database=parsimonie;Username=parsimonie;Password=parsimonie_dev
      - Discord__ClientId=${DISCORD_CLIENT_ID}
      - Discord__ClientSecret=${DISCORD_CLIENT_SECRET}
      - Discord__GuildId=${DISCORD_GUILD_ID}
      - Discord__RoleName=${DISCORD_ROLE_NAME}
      - Jwt__Secret=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: parsimonie
      POSTGRES_PASSWORD: parsimonie_dev
      POSTGRES_DB: parsimonie
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U parsimonie"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**6.3 Create .dockerignore**
```
**/node_modules
**/bin
**/obj
**/dist
**/.git
**/.env
```

---

## Implementation Order

```
Story 1: Project Scaffolding ─────┐
                                  │
Story 2: Database & EF Core ──────┼──► Foundation Ready
                                  │
Story 3: Discord OAuth ───────────┘
                                  │
Story 4: Protected Endpoints ─────┤
                                  │
Story 5: Angular Shell ───────────┤
                                  │
Story 6: Dockerfile ──────────────┴──► MVP Foundation Complete
```

**Estimated Implementation:** These are framework-level tasks, actual time depends on your pace.

---

## Definition of Done

The foundation is complete when:

- [ ] `docker compose up -d` starts PostgreSQL
- [ ] `dotnet run` starts the API on localhost:5001
- [ ] `ng serve` starts Angular on localhost:4200
- [ ] Discord OAuth flow works end-to-end
- [ ] Non-guild members see access denied
- [ ] Non-Raider role members see access denied
- [ ] Valid users see the dashboard with their username
- [ ] Logout clears tokens and redirects to login
- [ ] `docker build` creates a working container
