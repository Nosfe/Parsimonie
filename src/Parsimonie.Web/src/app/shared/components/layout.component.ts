import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-portal-black flex flex-col">
      <!-- Header -->
      <header class="bg-outland-gray border-b border-netherstorm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a routerLink="/dashboard" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-fel-green to-tbc-gold flex items-center justify-center">
                <span class="text-portal-black font-bold text-xl">P</span>
              </div>
              <h1 class="text-2xl font-bold text-tbc-gold tracking-wider hidden sm:block">PARSIMONIE</h1>
            </a>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/dashboard" 
                 routerLinkActive="bg-netherstorm text-fel-green"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors">
                Dashboard
              </a>
              <a routerLink="/roster" 
                 routerLinkActive="bg-netherstorm text-fel-green"
                 class="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors">
                Roster
              </a>
              <a routerLink="/raids" 
                 routerLinkActive="bg-netherstorm text-fel-green"
                 class="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors relative">
                Raids
                <span class="absolute -top-1 -right-1 w-2 h-2 bg-fel-green rounded-full animate-pulse"></span>
              </a>
              <a routerLink="/gear" 
                 routerLinkActive="bg-netherstorm text-fel-green"
                 class="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors">
                Gear
              </a>
              @if (isOfficer()) {
                <a routerLink="/admin" 
                   routerLinkActive="bg-netherstorm text-tbc-gold"
                   class="px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors">
                  Admin
                </a>
              }
            </nav>

            <!-- User menu -->
            <div class="flex items-center gap-4">
              <!-- Guild stats mini -->
              <div class="hidden lg:flex items-center gap-4 text-sm">
                <div class="flex items-center gap-1 text-fel-green">
                  <span class="w-2 h-2 bg-fel-green rounded-full animate-pulse"></span>
                  <span>{{ guildStats.onlineNow }} online</span>
                </div>
              </div>

              @if (user()) {
                <div class="flex items-center gap-3">
                  @if (user()!.avatar) {
                    <img 
                      [src]="getAvatarUrl()" 
                      [alt]="user()!.username"
                      class="w-9 h-9 rounded-full border-2 border-fel-green"
                    />
                  } @else {
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-fel-green to-tbc-gold flex items-center justify-center">
                      <span class="text-portal-black text-sm font-bold">
                        {{ user()!.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  }
                  <div class="hidden sm:block">
                    <div class="text-white text-sm font-medium">{{ user()!.username }}</div>
                    <div class="text-text-secondary text-xs">{{ getUserRole() }}</div>
                  </div>
                </div>
              }
              
              <button 
                (click)="logout()"
                class="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-netherstorm transition-colors"
                title="Logout"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile navigation -->
        <nav class="md:hidden border-t border-netherstorm px-4 py-2 flex gap-1 overflow-x-auto">
          <a routerLink="/dashboard" 
             routerLinkActive="bg-netherstorm text-fel-green"
             [routerLinkActiveOptions]="{exact: true}"
             class="px-3 py-1.5 rounded-lg text-text-secondary hover:text-white text-sm whitespace-nowrap">
            Dashboard
          </a>
          <a routerLink="/roster" 
             routerLinkActive="bg-netherstorm text-fel-green"
             class="px-3 py-1.5 rounded-lg text-text-secondary hover:text-white text-sm whitespace-nowrap">
            Roster
          </a>
          <a routerLink="/raids" 
             routerLinkActive="bg-netherstorm text-fel-green"
             class="px-3 py-1.5 rounded-lg text-text-secondary hover:text-white text-sm whitespace-nowrap">
            Raids
          </a>
          <a routerLink="/gear" 
             routerLinkActive="bg-netherstorm text-fel-green"
             class="px-3 py-1.5 rounded-lg text-text-secondary hover:text-white text-sm whitespace-nowrap">
            Gear
          </a>
        </nav>
      </header>

      <!-- Main content -->
      <main class="flex-1">
        <ng-content></ng-content>
      </main>

      <!-- Footer -->
      <footer class="bg-outland-gray border-t border-netherstorm py-4">
        <div class="max-w-7xl mx-auto px-4 text-center text-text-secondary text-sm">
          <p>Parsimonie Guild Manager • The Burning Crusade Classic</p>
          <p class="text-xs mt-1 opacity-60">Through the Dark Portal we go...</p>
        </div>
      </footer>
    </div>
  `
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);

  user = this.authService.user;
  isOfficer = this.authService.isOfficer;
  guildStats = this.mockDataService.getMockGuildStats();

  getAvatarUrl(): string {
    const u = this.user();
    if (!u?.avatar) return '';
    return `https://cdn.discordapp.com/avatars/${u.discordId}/${u.avatar}.png`;
  }

  getUserRole(): string {
    const u = this.user();
    if (!u) return '';
    if (u.roles.includes('GM')) return 'Guild Master';
    if (u.roles.includes('Officer')) return 'Officer';
    return 'Raider';
  }

  logout(): void {
    this.authService.logout();
  }
}
