import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { MeResponse } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-portal-black">
      <!-- Header -->
      <header class="bg-outland-gray border-b border-netherstorm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-tbc-gold tracking-wider">PARSIMONIE</h1>
            </div>

            <!-- User menu -->
            <div class="flex items-center gap-4">
              @if (user()) {
                <div class="flex items-center gap-3">
                  @if (user()!.avatar) {
                    <img 
                      [src]="getAvatarUrl()" 
                      [alt]="user()!.username"
                      class="w-8 h-8 rounded-full border border-fel-green"
                    />
                  } @else {
                    <div class="w-8 h-8 rounded-full bg-netherstorm border border-fel-green flex items-center justify-center">
                      <span class="text-fel-green text-sm font-bold">
                        {{ user()!.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  }
                  <span class="text-white">{{ user()!.username }}</span>
                </div>
              }
              
              <button 
                (click)="logout()"
                class="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (error()) {
          <div class="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-lg mx-auto text-center">
            <p class="text-red-400 mb-4">{{ error() }}</p>
            <button (click)="loadUserData()" class="btn-primary">Retry</button>
          </div>
        } @else if (userData()) {
          <!-- Welcome section -->
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-6 mb-8">
            <h2 class="text-2xl text-tbc-gold mb-2">
              Welcome back, {{ userData()!.username }}!
            </h2>
            <p class="text-gray-400">
              Last login: {{ formatDate(userData()!.lastLoginAt) }}
            </p>
            
            <!-- Role badges -->
            <div class="mt-4 flex gap-2">
              @for (role of userData()!.roles; track role) {
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                      [class]="getRoleBadgeClass(role)">
                  {{ role }}
                </span>
              }
            </div>
          </div>

          <!-- Quick stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h3 class="text-gray-400 text-sm uppercase tracking-wide mb-2">Characters</h3>
              <p class="text-3xl text-fel-green font-bold">{{ userData()!.characters.length }}</p>
            </div>
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h3 class="text-gray-400 text-sm uppercase tracking-wide mb-2">Main Character</h3>
              <p class="text-xl text-white">
                @if (getMainCharacter()) {
                  {{ getMainCharacter()!.name }} - {{ getMainCharacter()!.realm }}
                } @else {
                  <span class="text-gray-500">Not set</span>
                }
              </p>
            </div>
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h3 class="text-gray-400 text-sm uppercase tracking-wide mb-2">Member Since</h3>
              <p class="text-xl text-white">{{ formatDate(userData()!.createdAt) }}</p>
            </div>
          </div>

          <!-- Quick Links -->
          <h3 class="text-lg font-semibold text-tbc-gold mb-4">Quick Links</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a routerLink="/roster" 
               class="bg-outland-gray hover:bg-netherstorm border border-netherstorm rounded-lg p-6 transition-colors">
              <h4 class="text-fel-green font-semibold text-lg mb-2">Guild Roster</h4>
              <p class="text-text-secondary text-sm">View all guild members and their characters</p>
            </a>
            <div class="bg-outland-gray border border-netherstorm border-dashed rounded-lg p-6 opacity-50">
              <h4 class="text-gray-500 font-semibold text-lg mb-2">My Gear</h4>
              <p class="text-gray-600 text-sm">Coming soon...</p>
            </div>
            <div class="bg-outland-gray border border-netherstorm border-dashed rounded-lg p-6 opacity-50">
              <h4 class="text-gray-500 font-semibold text-lg mb-2">Tonight's Raid</h4>
              <p class="text-gray-600 text-sm">Coming soon...</p>
            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  user = this.authService.user;
  userData = signal<MeResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.apiService.getMe().subscribe({
      next: (data) => {
        this.userData.set(data);
        this.authService.setUser({
          id: data.id,
          discordId: data.discordId,
          username: data.username,
          avatar: data.avatar,
          roles: data.roles
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.error.set('Failed to load user data. Please try again.');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getAvatarUrl(): string {
    const u = this.user();
    if (u?.avatar && u?.discordId) {
      return `https://cdn.discordapp.com/avatars/${u.discordId}/${u.avatar}.png`;
    }
    return '';
  }

  getMainCharacter() {
    return this.userData()?.characters.find(c => c.isMain) ?? null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'GM':
        return 'bg-tbc-gold/20 text-tbc-gold border border-tbc-gold';
      case 'Officer':
        return 'bg-fel-green/20 text-fel-green border border-fel-green';
      case 'Raider':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  }
}
