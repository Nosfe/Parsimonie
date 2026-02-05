import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout.component';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { MockDataService, MockRaidEvent, MockGuildStats } from '../../core/services/mock-data.service';
import { MeResponse } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LayoutComponent],
  template: `
    <app-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else {
          <!-- Welcome Banner -->
          <div class="bg-gradient-to-r from-outland-gray to-netherstorm border border-netherstorm rounded-xl p-6 mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 class="text-3xl font-bold text-tbc-gold mb-2">
                  Welcome back, {{ userData()?.username || 'Adventurer' }}!
                </h2>
                <p class="text-text-secondary">
                  @if (userData()?.lastLoginAt) {
                    Last seen {{ formatDate(userData()!.lastLoginAt) }}
                  } @else {
                    Ready to raid?
                  }
                </p>
                
                <!-- Role badges -->
                <div class="mt-3 flex gap-2">
                  @for (role of (userData()?.roles || mockUser.roles); track role) {
                    <span class="px-3 py-1 rounded-full text-sm font-medium"
                          [class]="getRoleBadgeClass(role)">
                      {{ role }}
                    </span>
                  }
                </div>
              </div>
              
              <!-- Main character preview -->
              @if (getMainCharacter()) {
                <div class="bg-portal-black/50 rounded-lg p-4 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                       [style.background-color]="getClassColor(getMainCharacter()!.class) + '33'"
                       [style.color]="getClassColor(getMainCharacter()!.class)">
                    {{ getMainCharacter()!.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-semibold" [style.color]="getClassColor(getMainCharacter()!.class)">
                      {{ getMainCharacter()!.name }}
                    </div>
                    <div class="text-text-secondary text-sm">Main Character</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-fel-green">{{ guildStats.totalMembers }}</div>
              <div class="text-text-secondary text-sm">Guild Members</div>
            </div>
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-tbc-gold">{{ (userData()?.characters || mockCharacters).length }}</div>
              <div class="text-text-secondary text-sm">Your Characters</div>
            </div>
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-blue-400">{{ guildStats.raidsThisWeek }}</div>
              <div class="text-text-secondary text-sm">Raids This Week</div>
            </div>
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-purple-400">{{ guildStats.averageAttendance }}%</div>
              <div class="text-text-secondary text-sm">Avg Attendance</div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Upcoming Raids -->
            <div class="lg:col-span-2">
              <div class="bg-outland-gray border border-netherstorm rounded-xl overflow-hidden">
                <div class="p-4 border-b border-netherstorm flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-tbc-gold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upcoming Raids
                  </h3>
                  <a routerLink="/raids" class="text-fel-green text-sm hover:underline">View All</a>
                </div>
                <div class="divide-y divide-netherstorm">
                  @for (raid of upcomingRaids; track raid.id) {
                    <div class="p-4 hover:bg-netherstorm/50 transition-colors">
                      <div class="flex items-center justify-between mb-2">
                        <div class="font-semibold text-white">{{ raid.name }}</div>
                        <span class="px-2 py-0.5 rounded text-xs bg-fel-green/20 text-fel-green border border-fel-green">
                          {{ raid.signedUp }}/{{ raid.needed }}
                        </span>
                      </div>
                      <div class="flex items-center gap-4 text-sm text-text-secondary">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ raid.date }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ raid.time }} Server
                        </span>
                        <span class="text-fel-green">{{ raid.instance }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right sidebar -->
            <div class="space-y-6">
              <!-- Recent Activity -->
              <div class="bg-outland-gray border border-netherstorm rounded-xl overflow-hidden">
                <div class="p-4 border-b border-netherstorm">
                  <h3 class="text-lg font-semibold text-tbc-gold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Recent Activity
                  </h3>
                </div>
                <div class="divide-y divide-netherstorm">
                  @for (activity of recentActivity; track activity.time) {
                    <div class="p-3 text-sm">
                      <div class="text-white">{{ activity.action }}</div>
                      <div class="text-text-secondary flex items-center justify-between mt-1">
                        <span class="text-fel-green">{{ activity.character }}</span>
                        <span>{{ activity.time }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Quick Links -->
              <div class="bg-outland-gray border border-netherstorm rounded-xl p-4">
                <h3 class="text-lg font-semibold text-tbc-gold mb-4">Quick Actions</h3>
                <div class="space-y-2">
                  <a routerLink="/roster" 
                     class="flex items-center gap-3 p-3 rounded-lg bg-netherstorm hover:bg-portal-black transition-colors">
                    <div class="w-10 h-10 rounded-lg bg-fel-green/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-fel-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-white font-medium">Guild Roster</div>
                      <div class="text-text-secondary text-xs">View all members</div>
                    </div>
                  </a>
                  <a routerLink="/raids" 
                     class="flex items-center gap-3 p-3 rounded-lg bg-netherstorm hover:bg-portal-black transition-colors">
                    <div class="w-10 h-10 rounded-lg bg-tbc-gold/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-tbc-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-white font-medium">Raid Signups</div>
                      <div class="text-text-secondary text-xs">Sign up for raids</div>
                    </div>
                  </a>
                  <a routerLink="/gear" 
                     class="flex items-center gap-3 p-3 rounded-lg bg-netherstorm hover:bg-portal-black transition-colors">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-white font-medium">Gear Wishlist</div>
                      <div class="text-text-secondary text-xs">Manage your BiS</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Your Characters Section -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-tbc-gold">Your Characters</h3>
              <a routerLink="/roster" class="text-fel-green text-sm hover:underline">Manage Characters</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (char of (userData()?.characters || mockCharacters); track char.id) {
                <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 hover:border-fel-green/50 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                         [style.background-color]="getClassColor(char.class) + '33'"
                         [style.color]="getClassColor(char.class)">
                      {{ char.name.charAt(0) }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold" [style.color]="getClassColor(char.class)">
                          {{ char.name }}
                        </span>
                        @if (char.isMain) {
                          <span class="px-2 py-0.5 rounded text-xs bg-tbc-gold/20 text-tbc-gold">MAIN</span>
                        }
                      </div>
                      <div class="text-text-secondary text-sm">
                        {{ getSpecName(char.primarySpec) }} • {{ char.realm }}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </app-layout>
  `
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private mockDataService = inject(MockDataService);

  user = this.authService.user;
  userData = signal<MeResponse | null>(null);
  loading = signal(true);
  
  // Mock data for demo
  mockUser = this.mockDataService.getMockUser();
  mockCharacters = this.mockDataService.getMockCharacters();
  upcomingRaids = this.mockDataService.getMockRaidEvents().slice(0, 4);
  recentActivity = this.mockDataService.getMockRecentActivity();
  guildStats = this.mockDataService.getMockGuildStats();

  // Class colors
  private readonly classColors: Record<number, string> = {
    1: '#C79C6E', // Warrior
    2: '#F58CBA', // Paladin
    3: '#ABD473', // Hunter
    4: '#FFF569', // Rogue
    5: '#FFFFFF', // Priest
    7: '#0070DE', // Shaman
    8: '#69CCF0', // Mage
    9: '#9482C9', // Warlock
    11: '#FF7D0A' // Druid
  };

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading.set(true);
    
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
        console.warn('API not available, using mock data', err);
        // Fall back to mock data
        const mockData = this.mockDataService.getMockUserResponse();
        this.userData.set(mockData);
        this.authService.setUser(this.mockUser);
        this.loading.set(false);
      }
    });
  }

  getMainCharacter() {
    const chars = this.userData()?.characters || this.mockCharacters;
    return chars.find(c => c.isMain) ?? null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getClassColor(classId: number): string {
    return this.classColors[classId] || '#888888';
  }

  getSpecName(spec: number): string {
    const specNames: Record<number, string> = {
      1: 'Arms', 2: 'Fury', 3: 'Protection',
      4: 'Holy', 5: 'Protection', 6: 'Retribution',
      7: 'Beast Mastery', 8: 'Marksmanship', 9: 'Survival',
      10: 'Assassination', 11: 'Combat', 12: 'Subtlety',
      13: 'Discipline', 14: 'Holy', 15: 'Shadow',
      16: 'Elemental', 17: 'Enhancement', 18: 'Restoration',
      19: 'Arcane', 20: 'Fire', 21: 'Frost',
      22: 'Affliction', 23: 'Demonology', 24: 'Destruction',
      25: 'Balance', 26: 'Feral', 27: 'Restoration'
    };
    return specNames[spec] || 'Unknown';
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
