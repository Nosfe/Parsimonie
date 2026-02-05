import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RosterService, CharacterResponse, WOW_CLASS_COLORS, WOW_CLASS_NAMES, WOW_SPECS_BY_CLASS, ALL_WOW_CLASSES, CreateCharacterRequest, UpdateCharacterRequest } from '../../core/services/roster.service';
import { ApiService } from '../../core/services/api.service';
import { WowClass, WowSpec } from '../../core/models/user.model';

interface UserOption {
  id: string;
  username: string;
}

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-portal-black p-6">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <a routerLink="/roster" class="text-text-secondary hover:text-fel-green mb-2 inline-block">
            ← Back to Roster
          </a>
          <h1 class="text-3xl font-bold text-tbc-gold">
            {{ isEditMode() ? 'Edit Character' : 'Add Character' }}
          </h1>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-12 h-12 border-4 border-fel-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else {
          <form (ngSubmit)="save()" class="space-y-6">
            <!-- Basic Info -->
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h2 class="text-lg font-semibold text-tbc-gold mb-4">Character Info</h2>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-text-secondary text-sm mb-1">Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="form.name"
                    name="name"
                    class="input w-full"
                    [disabled]="isEditMode()"
                    required
                    minlength="2"
                    maxlength="12"
                  />
                </div>

                <div>
                  <label class="block text-text-secondary text-sm mb-1">Realm *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="form.realm"
                    name="realm"
                    class="input w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Class & Spec -->
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h2 class="text-lg font-semibold text-tbc-gold mb-4">Class & Specialization</h2>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-text-secondary text-sm mb-1">Class *</label>
                  <select 
                    [(ngModel)]="form.wowClass"
                    name="class"
                    class="input w-full"
                    [disabled]="isEditMode()"
                    (ngModelChange)="onClassChange()"
                    required
                  >
                    <option [ngValue]="null">Select Class</option>
                    @for (wowClass of allClasses; track wowClass) {
                      <option [ngValue]="wowClass">{{ getClassName(wowClass) }}</option>
                    }
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-text-secondary text-sm mb-1">Primary Spec *</label>
                    <select 
                      [(ngModel)]="form.primarySpec"
                      name="primarySpec"
                      class="input w-full"
                      [disabled]="!form.wowClass"
                      required
                    >
                      <option [ngValue]="null">Select Spec</option>
                      @for (spec of availableSpecs(); track spec.value) {
                        <option [ngValue]="spec.value">{{ spec.name }}</option>
                      }
                    </select>
                  </div>

                  <div>
                    <label class="block text-text-secondary text-sm mb-1">Secondary Spec</label>
                    <select 
                      [(ngModel)]="form.secondarySpec"
                      name="secondarySpec"
                      class="input w-full"
                      [disabled]="!form.wowClass"
                    >
                      <option [ngValue]="null">None</option>
                      @for (spec of availableSpecs(); track spec.value) {
                        <option [ngValue]="spec.value">{{ spec.name }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment -->
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h2 class="text-lg font-semibold text-tbc-gold mb-4">Assignment</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-text-secondary text-sm mb-1">Assign to User</label>
                  <select 
                    [(ngModel)]="form.userId"
                    name="userId"
                    class="input w-full"
                  >
                    <option [ngValue]="null">Unassigned</option>
                    @for (user of users(); track user.id) {
                      <option [ngValue]="user.id">{{ user.username }}</option>
                    }
                  </select>
                </div>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="form.isMain"
                    name="isMain"
                    class="w-4 h-4"
                  />
                  <span class="text-white">Main Character</span>
                </label>

                @if (isEditMode()) {
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="form.isActive"
                      name="isActive"
                      class="w-4 h-4"
                    />
                    <span class="text-white">Active</span>
                  </label>
                }
              </div>
            </div>

            <!-- Notes -->
            <div class="bg-outland-gray border border-netherstorm rounded-lg p-6">
              <h2 class="text-lg font-semibold text-tbc-gold mb-4">Officer Notes</h2>
              <textarea 
                [(ngModel)]="form.notes"
                name="notes"
                class="input w-full h-24 resize-none"
                placeholder="Internal notes about this character..."
              ></textarea>
            </div>

            <!-- Error -->
            @if (errorMessage()) {
              <div class="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p class="text-red-400">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Actions -->
            <div class="flex justify-end gap-4">
              <a routerLink="/roster" class="btn-secondary">Cancel</a>
              <button 
                type="submit"
                class="btn-primary"
                [disabled]="saving() || !isValid()"
              >
                {{ saving() ? 'Saving...' : (isEditMode() ? 'Save Changes' : 'Create Character') }}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class CharacterFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rosterService = inject(RosterService);
  private apiService = inject(ApiService);

  allClasses = ALL_WOW_CLASSES;
  
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  users = signal<UserOption[]>([]);
  characterId = signal<string | null>(null);

  form = {
    name: '',
    realm: 'Mograine',
    wowClass: null as WowClass | null,
    primarySpec: null as WowSpec | null,
    secondarySpec: null as WowSpec | null,
    userId: null as string | null,
    isMain: false,
    isActive: true,
    notes: ''
  };

  isEditMode = computed(() => !!this.characterId());

  availableSpecs() {
    if (!this.form.wowClass) return [];
    return WOW_SPECS_BY_CLASS[this.form.wowClass] || [];
  }

  isValid(): boolean {
    return !!(
      this.form.name &&
      this.form.name.length >= 2 &&
      this.form.name.length <= 12 &&
      this.form.realm &&
      this.form.wowClass &&
      this.form.primarySpec
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.characterId.set(id);
      this.loadCharacter(id);
    } else {
      this.loading.set(false);
    }
    
    this.loadUsers();
  }

  loadCharacter(id: string): void {
    this.rosterService.getCharacter(id).subscribe({
      next: (char) => {
        this.form.name = char.name;
        this.form.realm = char.realm;
        this.form.wowClass = char.class;
        this.form.primarySpec = char.primarySpec;
        this.form.secondarySpec = char.secondarySpec;
        this.form.userId = char.owner?.id ?? null;
        this.form.isMain = char.isMain;
        this.form.isActive = char.isActive;
        this.form.notes = char.notes ?? '';
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load character', err);
        this.errorMessage.set('Failed to load character');
        this.loading.set(false);
      }
    });
  }

  loadUsers(): void {
    // Load users from roster endpoint (we'll use the /api/roster to get users)
    // For now, we'll make a simple endpoint to get users
    // This could be improved with a dedicated users endpoint
    this.rosterService.getRoster(true).subscribe({
      next: (response) => {
        const userMap = new Map<string, UserOption>();
        response.characters.forEach(c => {
          if (c.owner && !userMap.has(c.owner.id)) {
            userMap.set(c.owner.id, { id: c.owner.id, username: c.owner.username });
          }
        });
        this.users.set(Array.from(userMap.values()).sort((a, b) => a.username.localeCompare(b.username)));
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  onClassChange(): void {
    // Reset specs when class changes
    this.form.primarySpec = null;
    this.form.secondarySpec = null;
  }

  save(): void {
    if (!this.isValid()) return;

    this.saving.set(true);
    this.errorMessage.set(null);

    if (this.isEditMode()) {
      const request: UpdateCharacterRequest = {
        name: this.form.name,
        realm: this.form.realm,
        primarySpec: this.form.primarySpec!,
        secondarySpec: this.form.secondarySpec ?? undefined,
        isMain: this.form.isMain,
        isActive: this.form.isActive,
        notes: this.form.notes || undefined
      };

      this.rosterService.updateCharacter(this.characterId()!, request).subscribe({
        next: (char) => {
          // Also update assignment if changed
          this.updateAssignmentIfNeeded(char);
        },
        error: (err) => {
          console.error('Failed to update character', err);
          this.errorMessage.set(err.error?.message || 'Failed to update character');
          this.saving.set(false);
        }
      });
    } else {
      const request: CreateCharacterRequest = {
        name: this.form.name,
        realm: this.form.realm,
        class: this.form.wowClass!,
        primarySpec: this.form.primarySpec!,
        secondarySpec: this.form.secondarySpec ?? undefined,
        userId: this.form.userId ?? undefined,
        isMain: this.form.isMain,
        notes: this.form.notes || undefined
      };

      this.rosterService.createCharacter(request).subscribe({
        next: (char) => {
          this.router.navigate(['/roster', char.id]);
        },
        error: (err) => {
          console.error('Failed to create character', err);
          this.errorMessage.set(err.error?.message || 'Failed to create character');
          this.saving.set(false);
        }
      });
    }
  }

  private updateAssignmentIfNeeded(char: CharacterResponse): void {
    const currentOwnerId = char.owner?.id ?? null;
    if (this.form.userId !== currentOwnerId) {
      this.rosterService.assignCharacter(char.id, this.form.userId).subscribe({
        next: () => {
          this.router.navigate(['/roster', char.id]);
        },
        error: (err) => {
          console.error('Failed to update assignment', err);
          // Still navigate, character was updated
          this.router.navigate(['/roster', char.id]);
        }
      });
    } else {
      this.router.navigate(['/roster', char.id]);
    }
  }

  getClassName(wowClass: WowClass): string {
    return WOW_CLASS_NAMES[wowClass] || 'Unknown';
  }
}
