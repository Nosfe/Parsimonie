import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RosterService, CharacterResponse, WOW_CLASS_COLORS, WOW_CLASS_NAMES, WOW_SPECS_BY_CLASS } from '../../core/services/roster.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { WowSpec } from '../../core/models/user.model';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-portal-black p-6">
      <div class="max-w-2xl mx-auto">
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (error()) {
          <div class="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
            <p class="text-red-400 mb-4">{{ error() }}</p>
            <a routerLink="/roster" class="btn-secondary">Back to Roster</a>
          </div>
        } @else if (character()) {
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <a routerLink="/roster" class="text-text-secondary hover:text-fel-green mb-2 inline-block">
                ← Back to Roster
              </a>
              <h1 
                class="text-3xl font-bold"
                [style.color]="getClassColor()"
              >
                {{ character()!.name }}
              </h1>
              <p class="text-text-secondary">{{ character()!.realm }}</p>
            </div>

            <div class="flex gap-2">
              @if (isOfficer()) {
                <button 
                  [routerLink]="['/roster', character()!.id, 'edit']"
                  class="btn-secondary"
                >
                  Edit
                </button>
                <button 
                  (click)="deleteCharacter()"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  [disabled]="deleting()"
                >
                  {{ deleting() ? 'Deleting...' : 'Delete' }}
                </button>
              }
            </div>
          </div>

          <!-- Badges -->
          <div class="flex gap-2 mb-6">
            @if (character()!.isMain) {
              <span class="px-3 py-1 rounded-full text-sm bg-tbc-gold/20 text-tbc-gold border border-tbc-gold">
                Main Character
              </span>
            }
            @if (!character()!.isActive) {
              <span class="px-3 py-1 rounded-full text-sm bg-gray-500/20 text-gray-400 border border-gray-500">
                Inactive
              </span>
            }
          </div>

          <!-- Character Details Card -->
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-6 mb-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="text-text-secondary text-sm">Class</label>
                <p 
                  class="text-lg font-semibold"
                  [style.color]="getClassColor()"
                >
                  {{ character()!.className }}
                </p>
              </div>

              <div>
                <label class="text-text-secondary text-sm">Primary Spec</label>
                <p class="text-lg text-white">{{ character()!.primarySpecName }}</p>
              </div>

              @if (character()!.secondarySpecName) {
                <div>
                  <label class="text-text-secondary text-sm">Secondary Spec</label>
                  <p class="text-lg text-white">{{ character()!.secondarySpecName }}</p>
                </div>
              }
            </div>
          </div>

          <!-- Owner Card -->
          <div class="bg-outland-gray border border-netherstorm rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-tbc-gold mb-4">Owner</h3>
            @if (character()!.owner) {
              <div class="flex items-center gap-4">
                @if (character()!.owner!.avatar) {
                  <img 
                    [src]="getOwnerAvatarUrl()"
                    class="w-12 h-12 rounded-full border-2 border-fel-green"
                  />
                } @else {
                  <div class="w-12 h-12 rounded-full bg-netherstorm border-2 border-fel-green flex items-center justify-center">
                    <span class="text-fel-green text-lg font-bold">
                      {{ character()!.owner!.username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                }
                <span class="text-white text-lg">{{ character()!.owner!.username }}</span>
              </div>
            } @else {
              <p class="text-gray-500 italic">This character is not assigned to any user.</p>
              @if (isOfficer()) {
                <button class="btn-primary mt-4" [routerLink]="['/roster', character()!.id, 'edit']">
                  Assign to User
                </button>
              }
            }
          </div>

          <!-- Self-service actions for character owner -->
          @if (isOwner()) {
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-tbc-gold mb-4">Your Actions</h3>
              
              <!-- Update Spec -->
              <div class="mb-6">
                <h4 class="text-sm text-text-secondary mb-2">Update Spec</h4>
                <div class="flex gap-4">
                  <select 
                    [(ngModel)]="newPrimarySpec"
                    class="input flex-1"
                  >
                    @for (spec of availableSpecs(); track spec.value) {
                      <option [ngValue]="spec.value">{{ spec.name }}</option>
                    }
                  </select>
                  <select 
                    [(ngModel)]="newSecondarySpec"
                    class="input flex-1"
                  >
                    <option [ngValue]="null">No Secondary</option>
                    @for (spec of availableSpecs(); track spec.value) {
                      <option [ngValue]="spec.value">{{ spec.name }}</option>
                    }
                  </select>
                  <button 
                    (click)="updateSpec()"
                    class="btn-primary"
                    [disabled]="updatingSpec()"
                  >
                    {{ updatingSpec() ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>

              <!-- Set as Main -->
              @if (!character()!.isMain) {
                <div>
                  <h4 class="text-sm text-text-secondary mb-2">Main Character</h4>
                  <button 
                    (click)="setAsMain()"
                    class="btn-secondary"
                    [disabled]="settingMain()"
                  >
                    {{ settingMain() ? 'Setting...' : 'Set as Main Character' }}
                  </button>
                </div>
              }
            </div>
          }

          <!-- Officer Notes -->
          @if (isOfficer() && character()!.notes) {
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h3 class="text-lg font-semibold text-tbc-gold mb-4">Officer Notes</h3>
              <p class="text-text-secondary whitespace-pre-wrap">{{ character()!.notes }}</p>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CharacterDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rosterService = inject(RosterService);
  private authService = inject(AuthService);

  loading = signal(true);
  error = signal<string | null>(null);
  character = signal<CharacterResponse | null>(null);
  
  deleting = signal(false);
  updatingSpec = signal(false);
  settingMain = signal(false);

  newPrimarySpec: WowSpec | null = null;
  newSecondarySpec: WowSpec | null = null;

  isOfficer = this.authService.isOfficer;

  isOwner(): boolean {
    const user = this.authService.user();
    const char = this.character();
    return !!(user && char?.owner && user.id === char.owner.id);
  }

  availableSpecs() {
    const char = this.character();
    if (!char) return [];
    return WOW_SPECS_BY_CLASS[char.class] || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharacter(id);
    } else {
      this.error.set('Invalid character ID');
      this.loading.set(false);
    }
  }

  loadCharacter(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.rosterService.getCharacter(id).subscribe({
      next: (char) => {
        this.character.set(char);
        this.newPrimarySpec = char.primarySpec;
        this.newSecondarySpec = char.secondarySpec;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load character', err);
        this.error.set('Character not found');
        this.loading.set(false);
      }
    });
  }

  deleteCharacter(): void {
    if (!confirm('Are you sure you want to delete this character? This will mark it as inactive.')) {
      return;
    }

    this.deleting.set(true);
    this.rosterService.deleteCharacter(this.character()!.id).subscribe({
      next: () => {
        this.router.navigate(['/roster']);
      },
      error: (err) => {
        console.error('Failed to delete character', err);
        alert('Failed to delete character');
        this.deleting.set(false);
      }
    });
  }

  updateSpec(): void {
    if (!this.newPrimarySpec) return;

    this.updatingSpec.set(true);
    this.rosterService.updateSpec(this.character()!.id, {
      primarySpec: this.newPrimarySpec,
      secondarySpec: this.newSecondarySpec ?? undefined
    }).subscribe({
      next: (updated) => {
        this.character.set(updated);
        this.updatingSpec.set(false);
      },
      error: (err) => {
        console.error('Failed to update spec', err);
        alert('Failed to update spec');
        this.updatingSpec.set(false);
      }
    });
  }

  setAsMain(): void {
    this.settingMain.set(true);
    this.rosterService.setAsMain(this.character()!.id).subscribe({
      next: (updated) => {
        this.character.set(updated);
        this.settingMain.set(false);
      },
      error: (err) => {
        console.error('Failed to set as main', err);
        alert('Failed to set as main');
        this.settingMain.set(false);
      }
    });
  }

  getClassColor(): string {
    const char = this.character();
    return char ? WOW_CLASS_COLORS[char.class] || '#FFFFFF' : '#FFFFFF';
  }

  getOwnerAvatarUrl(): string {
    const owner = this.character()?.owner;
    if (owner?.avatar) {
      return `https://cdn.discordapp.com/avatars/${owner.id}/${owner.avatar}.png`;
    }
    return '';
  }
}
