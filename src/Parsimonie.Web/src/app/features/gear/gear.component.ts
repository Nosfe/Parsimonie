import { Component, inject, signal } from '@angular/core';
import { LayoutComponent } from '../../shared/components/layout.component';
import { MockDataService } from '../../core/services/mock-data.service';

interface WishlistItem {
  id: number;
  name: string;
  slot: string;
  source: string;
  boss: string;
  priority: 'BiS' | 'Upgrade' | 'Sidegrade';
  status: 'Needed' | 'Reserved' | 'Obtained';
  itemLevel: number;
}

@Component({
  selector: 'app-gear',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-tbc-gold mb-2">Gear Wishlist</h1>
            <p class="text-text-secondary">Track your Best-in-Slot items and loot priorities</p>
          </div>
          <div class="flex gap-3">
            <button class="px-4 py-2 bg-fel-green text-portal-black rounded-lg hover:bg-fel-green/80 transition-colors font-medium">
              + Add Item
            </button>
            <button class="px-4 py-2 bg-netherstorm text-white rounded-lg hover:bg-portal-black transition-colors">
              Import from Addon
            </button>
          </div>
        </div>

        <!-- Character Selector -->
        <div class="bg-outland-gray border border-netherstorm rounded-xl p-4 mb-8">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-text-secondary">Character:</span>
            @for (char of mockCharacters; track char.id) {
              <button 
                (click)="selectedChar.set(char.id)"
                class="px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                [class]="selectedChar() === char.id 
                  ? 'bg-fel-green/20 border border-fel-green text-fel-green' 
                  : 'bg-netherstorm text-text-secondary hover:text-white'">
                <span class="w-3 h-3 rounded-full"
                      [style.background-color]="getClassColor(char.class)"></span>
                {{ char.name }}
              </button>
            }
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ wishlistItems.length }}</div>
            <div class="text-text-secondary text-sm">Items on List</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-tbc-gold">{{ getBisCount() }}</div>
            <div class="text-text-secondary text-sm">BiS Items</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-fel-green">{{ getObtainedCount() }}</div>
            <div class="text-text-secondary text-sm">Obtained</div>
          </div>
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ getProgressPercent() }}%</div>
            <div class="text-text-secondary text-sm">Progress</div>
          </div>
        </div>

        <!-- Wishlist Table -->
        <div class="bg-outland-gray border border-netherstorm rounded-xl overflow-hidden mb-8">
          <div class="p-4 border-b border-netherstorm flex items-center justify-between">
            <h3 class="text-lg font-semibold text-tbc-gold">Your Wishlist</h3>
            <div class="flex gap-2">
              <select class="bg-netherstorm border border-netherstorm rounded px-3 py-1.5 text-sm text-white">
                <option>All Slots</option>
                <option>Head</option>
                <option>Shoulders</option>
                <option>Chest</option>
                <option>Weapons</option>
                <option>Trinkets</option>
              </select>
              <select class="bg-netherstorm border border-netherstorm rounded px-3 py-1.5 text-sm text-white">
                <option>All Sources</option>
                <option>Karazhan</option>
                <option>Gruul's Lair</option>
                <option>SSC</option>
                <option>TK</option>
              </select>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-netherstorm text-left">
                  <th class="p-4 text-text-secondary font-medium">Item</th>
                  <th class="p-4 text-text-secondary font-medium">Slot</th>
                  <th class="p-4 text-text-secondary font-medium">Source</th>
                  <th class="p-4 text-text-secondary font-medium">Priority</th>
                  <th class="p-4 text-text-secondary font-medium">Status</th>
                  <th class="p-4 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-netherstorm">
                @for (item of wishlistItems; track item.id) {
                  <tr class="hover:bg-netherstorm/50 transition-colors">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded bg-netherstorm flex items-center justify-center">
                          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <div class="font-medium" [class]="getItemColor(item.priority)">{{ item.name }}</div>
                          <div class="text-text-secondary text-xs">iLvl {{ item.itemLevel }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-text-secondary">{{ item.slot }}</td>
                    <td class="p-4">
                      <div class="text-white">{{ item.source }}</div>
                      <div class="text-text-secondary text-xs">{{ item.boss }}</div>
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-xs font-medium"
                            [class]="getPriorityClass(item.priority)">
                        {{ item.priority }}
                      </span>
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-xs font-medium"
                            [class]="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="flex gap-2">
                        <button class="p-1.5 rounded hover:bg-netherstorm transition-colors text-text-secondary hover:text-white">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button class="p-1.5 rounded hover:bg-red-500/20 transition-colors text-text-secondary hover:text-red-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loot Priority Rules -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6">
            <h3 class="text-lg font-semibold text-tbc-gold mb-4">Loot Priority System</h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-purple-400"></div>
                <div>
                  <span class="text-white font-medium">BiS (Best in Slot)</span>
                  <span class="text-text-secondary"> - Highest priority for main spec</span>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-blue-400"></div>
                <div>
                  <span class="text-white font-medium">Upgrade</span>
                  <span class="text-text-secondary"> - Significant improvement over current gear</span>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-green-400"></div>
                <div>
                  <span class="text-white font-medium">Sidegrade</span>
                  <span class="text-text-secondary"> - Minor improvement or situational use</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-outland-gray border border-netherstorm rounded-xl p-6">
            <h3 class="text-lg font-semibold text-tbc-gold mb-4">Your Stats</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text-secondary">BiS Progress</span>
                  <span class="text-white">{{ getObtainedCount() }}/{{ getBisCount() }}</span>
                </div>
                <div class="h-2 bg-netherstorm rounded-full overflow-hidden">
                  <div class="h-full bg-purple-500 rounded-full" 
                       [style.width.%]="(getObtainedCount() / getBisCount()) * 100"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text-secondary">Overall Gear Score</span>
                  <span class="text-fel-green">1847</span>
                </div>
                <div class="h-2 bg-netherstorm rounded-full overflow-hidden">
                  <div class="h-full bg-fel-green rounded-full" style="width: 78%"></div>
                </div>
              </div>
              <div class="pt-2 border-t border-netherstorm">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-text-secondary">Raids Attended:</span>
                    <span class="text-white ml-2">24</span>
                  </div>
                  <div>
                    <span class="text-text-secondary">Loot Received:</span>
                    <span class="text-white ml-2">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coming Soon -->
        <div class="bg-outland-gray border border-netherstorm rounded-xl p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-tbc-gold mb-2">Import from Game</h3>
          <p class="text-text-secondary max-w-md mx-auto">
            Coming soon: Import your current gear and wishlist directly from a WeakAura or addon.
            Automatic BiS recommendations based on your class and spec!
          </p>
        </div>
      </div>
    </app-layout>
  `
})
export class GearComponent {
  private mockDataService = inject(MockDataService);

  mockCharacters = this.mockDataService.getMockCharacters();
  selectedChar = signal('char-001');

  // Mock wishlist items
  wishlistItems: WishlistItem[] = [
    { id: 1, name: 'Helm of the Fallen Champion', slot: 'Head', source: 'Serpentshrine Cavern', boss: 'Lady Vashj', priority: 'BiS', status: 'Needed', itemLevel: 133 },
    { id: 2, name: 'Shoulderpads of the Stranger', slot: 'Shoulders', source: 'Karazhan', boss: 'Shade of Aran', priority: 'BiS', status: 'Obtained', itemLevel: 115 },
    { id: 3, name: 'Fel-Tinged Mantle', slot: 'Shoulders', source: "Gruul's Lair", boss: "High King Maulgar", priority: 'Upgrade', status: 'Needed', itemLevel: 125 },
    { id: 4, name: 'Chestguard of the Vanquished Hero', slot: 'Chest', source: 'Tempest Keep', boss: "Kael'thas", priority: 'BiS', status: 'Needed', itemLevel: 133 },
    { id: 5, name: 'Girdle of Ruination', slot: 'Waist', source: 'Crafted', boss: 'Shadowcloth Tailor', priority: 'BiS', status: 'Obtained', itemLevel: 130 },
    { id: 6, name: 'Staff of Infinite Mysteries', slot: 'Weapon', source: 'Karazhan', boss: 'Curator', priority: 'Upgrade', status: 'Reserved', itemLevel: 115 },
    { id: 7, name: 'Icon of the Silver Crescent', slot: 'Trinket', source: "Heroic Badges", boss: 'Badge Vendor', priority: 'BiS', status: 'Obtained', itemLevel: 115 },
    { id: 8, name: 'Devastation', slot: 'Weapon', source: 'Serpentshrine Cavern', boss: 'The Lurker Below', priority: 'BiS', status: 'Needed', itemLevel: 133 }
  ];

  private readonly classColors: Record<number, string> = {
    1: '#C79C6E', 2: '#F58CBA', 3: '#ABD473', 4: '#FFF569',
    5: '#FFFFFF', 7: '#0070DE', 8: '#69CCF0', 9: '#9482C9', 11: '#FF7D0A'
  };

  getClassColor(classId: number): string {
    return this.classColors[classId] || '#888888';
  }

  getBisCount(): number {
    return this.wishlistItems.filter(i => i.priority === 'BiS').length;
  }

  getObtainedCount(): number {
    return this.wishlistItems.filter(i => i.status === 'Obtained').length;
  }

  getProgressPercent(): number {
    return Math.round((this.getObtainedCount() / this.wishlistItems.length) * 100);
  }

  getItemColor(priority: string): string {
    switch (priority) {
      case 'BiS': return 'text-purple-400';
      case 'Upgrade': return 'text-blue-400';
      default: return 'text-green-400';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'BiS': return 'bg-purple-500/20 text-purple-400 border border-purple-500';
      case 'Upgrade': return 'bg-blue-500/20 text-blue-400 border border-blue-500';
      default: return 'bg-green-500/20 text-green-400 border border-green-500';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Obtained': return 'bg-fel-green/20 text-fel-green border border-fel-green';
      case 'Reserved': return 'bg-tbc-gold/20 text-tbc-gold border border-tbc-gold';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  }
}
