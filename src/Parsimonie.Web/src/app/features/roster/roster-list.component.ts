import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RosterService, CharacterResponse, WOW_CLASS_COLORS, ALL_WOW_CLASSES, WOW_CLASS_NAMES } from '../../core/services/roster.service';
import { AuthService } from '../../core/services/auth.service';
import { WowClass } from '../../core/models/user.model';

@Component({
  selector: 'app-roster-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-portal-black p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-tbc-gold">Guild Roster</h1>
          <div class="flex gap-4">
            @if (isOfficer()) {
              <button 
                routerLink="/roster/new"
                class="btn-primary flex items-center gap-2"
              >
                <span class="text-xl">+</span>
                Add Character
              </button>
            }
            <a routerLink="/dashboard" class="btn-secondary">Back to Dashboard</a>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-outland-gray border border-netherstorm rounded-lg p-4 mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-48">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                placeholder="Search by name..."
                class="input w-full"
              />
            </div>
            
            <div>
              <select [(ngModel)]="selectedClass" class="input">
                <option [ngValue]="null">All Classes</option>
                @for (wowClass of allClasses; track wowClass) {
                  <option [ngValue]="wowClass">{{ getClassName(wowClass) }}</option>
                }
              </select>
            </div>

            @if (isOfficer()) {
              <label class="flex items-center gap-2 text-text-secondary">
                <input 
                  type="checkbox" 
                  [(ngModel)]="showInactive"
                  class="w-4 h-4"
                />
                Show Inactive
              </label>
            }
          </div>
        </div>

        <!-- Loading/Error states -->
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (error()) {
          <div class="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
            <p class="text-red-400 mb-4">{{ error() }}</p>
            <button (click)="loadRoster()" class="btn-primary">Retry</button>
          </div>
        } @else {
          <!-- Stats -->
          <div class="mb-6 text-text-secondary">
            Showing {{ filteredCharacters().length }} of {{ totalCount() }} characters
            ({{ activeCount() }} active)
          </div>

          <!-- Roster grouped by class -->
          @for (group of groupedCharacters(); track group.class) {
            <div class="mb-6">
              <h2 
                class="text-xl font-semibold mb-3 pb-2 border-b"
                [style.color]="getClassColor(group.class)"
                [style.border-color]="getClassColor(group.class)"
              >
                {{ getClassName(group.class) }} ({{ group.characters.length }})
              </h2>

              <div class="grid gap-2">
                @for (char of group.characters; track char.id) {
                  <a 
                    [routerLink]="['/roster', char.id]"
                    class="bg-outland-gray hover:bg-netherstorm border border-netherstorm rounded-lg p-4 flex items-center gap-4 transition-colors"
                    [class.opacity-50]="!char.isActive"
                  >
                    <!-- Class icon placeholder -->
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                      [style.background-color]="getClassColor(char.class) + '33'"
                      [style.color]="getClassColor(char.class)"
                    >
                      {{ char.name.charAt(0) }}
                    </div>

                    <!-- Character info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span 
                          class="font-semibold"
                          [style.color]="getClassColor(char.class)"
                        >
                          {{ char.name }}
                        </span>
                        @if (char.isMain) {
                          <span class="px-2 py-0.5 rounded text-xs bg-tbc-gold/20 text-tbc-gold border border-tbc-gold">
                            MAIN
                          </span>
                        }
                        @if (!char.isActive) {
                          <span class="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500">
                            INACTIVE
                          </span>
                        }
                      </div>
                      <div class="text-sm text-text-secondary">
                        {{ char.primarySpecName }}
                        @if (char.secondarySpecName) {
                          / {{ char.secondarySpecName }}
                        }
                        • {{ char.realm }}
                      </div>
                    </div>

                    <!-- Owner -->
                    <div class="text-right">
                      @if (char.owner) {
                        <div class="flex items-center gap-2">
                          @if (char.owner.avatar) {
                            <img 
                              [src]="getAvatarUrl(char.owner)"
                              class="w-6 h-6 rounded-full"
                            />
                          }
                          <span class="text-text-secondary">{{ char.owner.username }}</span>
                        </div>
                      } @else {
                        <span class="text-gray-500 italic">Unassigned</span>
                      }
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          @if (filteredCharacters().length === 0) {
            <div class="text-center py-12 text-text-secondary">
              No characters found matching your filters.
            </div>
          }
        }
      </div>
    </div>
  `
})
export class RosterListComponent implements OnInit {
  private rosterService = inject(RosterService);
  private authService = inject(AuthService);

  allClasses = ALL_WOW_CLASSES;
  searchQuery = '';
  selectedClass: WowClass | null = null;
  showInactive = false;

  loading = signal(true);
  error = signal<string | null>(null);
  characters = signal<CharacterResponse[]>([]);
  totalCount = signal(0);
  activeCount = signal(0);

  isOfficer = this.authService.isOfficer;

  filteredCharacters = computed(() => {
    let filtered = this.characters();
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.owner?.username.toLowerCase().includes(query)
      );
    }
    
    if (this.selectedClass !== null) {
      filtered = filtered.filter(c => c.class === this.selectedClass);
    }
    
    if (!this.showInactive) {
      filtered = filtered.filter(c => c.isActive);
    }
    
    return filtered;
  });

  groupedCharacters = computed(() => {
    const filtered = this.filteredCharacters();
    const groups: { class: WowClass; characters: CharacterResponse[] }[] = [];
    
    for (const wowClass of this.allClasses) {
      const classChars = filtered.filter(c => c.class === wowClass);
      if (classChars.length > 0) {
        groups.push({ class: wowClass, characters: classChars });
      }
    }
    
    return groups;
  });

  ngOnInit(): void {
    this.loadRoster();
  }

  loadRoster(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.rosterService.getRoster(this.showInactive).subscribe({
      next: (response) => {
        this.characters.set(response.characters);
        this.totalCount.set(response.totalCount);
        this.activeCount.set(response.activeCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load roster', err);
        this.error.set('Failed to load roster. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getClassName(wowClass: WowClass): string {
    return WOW_CLASS_NAMES[wowClass] || 'Unknown';
  }

  getClassColor(wowClass: WowClass): string {
    return WOW_CLASS_COLORS[wowClass] || '#FFFFFF';
  }

  getAvatarUrl(owner: { id: string; avatar: string | null }): string {
    if (owner.avatar) {
      return `https://cdn.discordapp.com/avatars/${owner.id}/${owner.avatar}.png`;
    }
    return '';
  }
}
