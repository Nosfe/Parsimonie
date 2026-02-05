import { Component, inject, signal, computed } from '@angular/core';
import { LayoutComponent } from '../../shared/components/layout.component';
import { MockDataService, MockRaidEvent } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-raids',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-tbc-gold mb-2">Raid Schedule</h1>
          <p class="text-text-secondary">Sign up for upcoming raids and track your attendance</p>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-fel-green">{{ raids.length }}</div>
            <div class="text-text-secondary text-sm">Scheduled Raids</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-tbc-gold">{{ mySignUps() }}</div>
            <div class="text-text-secondary text-sm">Your Signups</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">87%</div>
            <div class="text-text-secondary text-sm">Your Attendance</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ nextRaid().name }}</div>
            <div class="text-text-secondary text-sm">Next Raid</div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-6 border-b border-netherstorm pb-4">
          @for (filter of filters; track filter.id) {
            <button 
              (click)="activeFilter.set(filter.id)"
              class="px-4 py-2 rounded-lg transition-colors"
              [class]="activeFilter() === filter.id 
                ? 'bg-fel-green text-portal-black font-medium' 
                : 'bg-netherstorm text-text-secondary hover:text-white'">
              {{ filter.label }}
            </button>
          }
        </div>

        <!-- Raid List -->
        <div class="space-y-4">
          @for (raid of filteredRaids(); track raid.id) {
            <div class="bg-outland-gray border border-netherstorm rounded-xl overflow-hidden hover:border-fel-green/50 transition-colors">
              <div class="p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <!-- Raid Info -->
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center"
                         [class]="getRaidBgClass(raid.instance)">
                      <div class="text-xs text-text-secondary">{{ getMonth(raid.date) }}</div>
                      <div class="text-2xl font-bold text-white">{{ getDay(raid.date) }}</div>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold text-white mb-1">{{ raid.name }}</h3>
                      <div class="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ raid.instance }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ raid.time }} Server Time
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ raid.date }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Signup Progress & Actions -->
                  <div class="flex flex-col md:items-end gap-3">
                    <div class="flex items-center gap-4">
                      <!-- Signup Progress -->
                      <div class="text-right">
                        <div class="text-sm text-text-secondary mb-1">Signed Up</div>
                        <div class="flex items-center gap-2">
                          <div class="w-32 h-2 bg-netherstorm rounded-full overflow-hidden">
                            <div class="h-full bg-fel-green rounded-full transition-all"
                                 [style.width.%]="(raid.signedUp / raid.needed) * 100"></div>
                          </div>
                          <span class="text-sm font-medium"
                                [class]="raid.signedUp >= raid.needed ? 'text-fel-green' : 'text-tbc-gold'">
                            {{ raid.signedUp }}/{{ raid.needed }}
                          </span>
                        </div>
                      </div>

                      <!-- Status Badge -->
                      <div class="px-3 py-1 rounded-full text-xs font-medium"
                           [class]="getStatusBadgeClass(raid.status)">
                        {{ raid.status }}
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                      @if (raid.status === 'Open') {
                        <button class="px-4 py-2 bg-fel-green text-portal-black rounded-lg hover:bg-fel-green/80 transition-colors font-medium text-sm">
                          Sign Up
                        </button>
                      }
                      <button class="px-4 py-2 bg-netherstorm text-white rounded-lg hover:bg-portal-black transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Role Requirements -->
                <div class="mt-4 pt-4 border-t border-netherstorm">
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <span class="text-text-secondary">Tanks:</span>
                      <span class="text-white font-medium">{{ raid.tanks?.current || 2 }}/{{ raid.tanks?.needed || 3 }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      <span class="text-text-secondary">Healers:</span>
                      <span class="text-white font-medium">{{ raid.healers?.current || 5 }}/{{ raid.healers?.needed || 6 }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-text-secondary">DPS:</span>
                      <span class="text-white font-medium">{{ raid.dps?.current || 14 }}/{{ raid.dps?.needed || 16 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Coming Soon Features -->
        <div class="mt-12 bg-outland-gray border border-netherstorm rounded-xl p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-tbc-gold/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-tbc-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-tbc-gold mb-2">More Features Coming Soon</h3>
          <p class="text-text-secondary max-w-md mx-auto">
            Loot council integration, automatic class/spec balancing, Discord notifications, 
            and detailed raid analytics are on the way!
          </p>
        </div>
      </div>
    </app-layout>
  `
})
export class RaidsComponent {
  private mockDataService = inject(MockDataService);

  raids = this.mockDataService.getMockRaidEvents();
  activeFilter = signal<string>('all');
  
  filters = [
    { id: 'all', label: 'All Raids' },
    { id: 'open', label: 'Open for Signup' },
    { id: 'full', label: 'Full' },
    { id: 'locked', label: 'Locked' }
  ];

  filteredRaids = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.raids;
    return this.raids.filter(r => r.status.toLowerCase() === filter);
  });

  mySignUps = signal(3);

  nextRaid = computed(() => {
    return this.raids.find(r => r.status === 'Open') || this.raids[0];
  });

  getMonth(dateStr: string): string {
    const date = new Date(dateStr.replace(/(\w+) (\d+)/, '$1 $2, 2025'));
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getDay(dateStr: string): string {
    const match = dateStr.match(/\d+/);
    return match ? match[0] : '';
  }

  getRaidBgClass(instance: string): string {
    switch (instance) {
      case 'Karazhan': return 'bg-purple-900';
      case "Gruul's Lair": return 'bg-red-900';
      case "Serpentshrine Cavern": return 'bg-blue-900';
      case "Tempest Keep": return 'bg-yellow-900';
      default: return 'bg-netherstorm';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Open': return 'bg-fel-green/20 text-fel-green border border-fel-green';
      case 'Full': return 'bg-tbc-gold/20 text-tbc-gold border border-tbc-gold';
      case 'Locked': return 'bg-red-500/20 text-red-400 border border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  }
}
