import { Component, signal } from '@angular/core';
import { LayoutComponent } from '../../shared/components/layout.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header with Officer Warning -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-lg bg-tbc-gold/20">
              <svg class="w-6 h-6 text-tbc-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-tbc-gold">Guild Administration</h1>
              <p class="text-text-secondary">Officers & GM only area</p>
            </div>
          </div>
          
          <!-- Access Notice -->
          <div class="bg-tbc-gold/10 border border-tbc-gold/50 rounded-lg p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-tbc-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span class="text-tbc-gold font-medium">Restricted Area</span>
              <span class="text-text-secondary"> - Only guild officers and GM can access these settings.</span>
            </div>
          </div>
        </div>

        <!-- Admin Sections Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Member Management -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-fel-green/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-fel-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Member Management</h3>
            <p class="text-text-secondary text-sm mb-4">
              Manage guild members, assign roles, and handle promotions/demotions.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-tbc-gold text-sm">47 Members</span>
              <button class="px-3 py-1.5 bg-fel-green text-portal-black rounded text-sm font-medium hover:bg-fel-green/80 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <!-- Raid Management -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-tbc-gold/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-tbc-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Raid Management</h3>
            <p class="text-text-secondary text-sm mb-4">
              Create raids, manage signups, set compositions, and handle loot.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-tbc-gold text-sm">4 Upcoming</span>
              <button class="px-3 py-1.5 bg-fel-green text-portal-black rounded text-sm font-medium hover:bg-fel-green/80 transition-colors">
                Manage
              </button>
            </div>
          </div>

          <!-- Loot Council -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Loot Council</h3>
            <p class="text-text-secondary text-sm mb-4">
              Configure loot rules, track distributions, and manage wishlists.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-tbc-gold text-sm">Coming Soon</span>
              <button disabled class="px-3 py-1.5 bg-netherstorm text-text-secondary rounded text-sm cursor-not-allowed">
                Setup
              </button>
            </div>
          </div>

          <!-- Discord Integration -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Discord Integration</h3>
            <p class="text-text-secondary text-sm mb-4">
              Configure bot notifications, raid reminders, and role syncing.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-fel-green text-sm">Connected</span>
              <button class="px-3 py-1.5 bg-fel-green text-portal-black rounded text-sm font-medium hover:bg-fel-green/80 transition-colors">
                Configure
              </button>
            </div>
          </div>

          <!-- Attendance Tracking -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Attendance Tracking</h3>
            <p class="text-text-secondary text-sm mb-4">
              View attendance reports, identify patterns, and manage benchmarks.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-tbc-gold text-sm">87% Average</span>
              <button class="px-3 py-1.5 bg-fel-green text-portal-black rounded text-sm font-medium hover:bg-fel-green/80 transition-colors">
                View Reports
              </button>
            </div>
          </div>

          <!-- Guild Settings -->
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 hover:border-fel-green/50 transition-colors">
            <div class="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Guild Settings</h3>
            <p class="text-text-secondary text-sm mb-4">
              Configure guild rules, raid times, loot systems, and display options.
            </p>
            <div class="flex items-center justify-between">
              <span class="text-text-secondary text-sm">GM Only</span>
              <button class="px-3 py-1.5 bg-fel-green text-portal-black rounded text-sm font-medium hover:bg-fel-green/80 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-outland-gray border border-netherstorm rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-tbc-gold mb-4">Guild Overview</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-white">47</div>
              <div class="text-text-secondary text-sm">Total Members</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-fel-green">12</div>
              <div class="text-text-secondary text-sm">Online Now</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-tbc-gold">8/8</div>
              <div class="text-text-secondary text-sm">T4 Progress</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-400">6/6</div>
              <div class="text-text-secondary text-sm">T5 Progress</div>
            </div>
          </div>
        </div>

        <!-- Recent Officer Actions -->
        <div class="bg-outland-gray border border-netherstorm rounded-xl overflow-hidden">
          <div class="p-4 border-b border-netherstorm">
            <h3 class="text-lg font-semibold text-tbc-gold">Recent Officer Actions</h3>
          </div>
          <div class="divide-y divide-netherstorm">
            @for (action of recentActions; track action.time) {
              <div class="p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-netherstorm flex items-center justify-center text-xs font-medium text-text-secondary">
                    {{ action.officer.charAt(0) }}
                  </div>
                  <div>
                    <span class="text-white font-medium">{{ action.officer }}</span>
                    <span class="text-text-secondary"> {{ action.action }}</span>
                  </div>
                </div>
                <div class="text-text-secondary text-sm">{{ action.time }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </app-layout>
  `
})
export class AdminComponent {
  recentActions = [
    { officer: 'Vaelkyr', action: 'promoted Moonfire to Raider', time: '2 hours ago' },
    { officer: 'Thunderax', action: 'created raid Serpentshrine Cavern', time: '5 hours ago' },
    { officer: 'Vaelkyr', action: 'modified loot council rules', time: '1 day ago' },
    { officer: 'Shadowstep', action: 'updated Discord bot settings', time: '2 days ago' },
    { officer: 'Vaelkyr', action: 'added new member Frostweaver', time: '3 days ago' }
  ];
}
