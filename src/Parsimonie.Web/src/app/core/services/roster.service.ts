import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WowClass, WowSpec } from '../models/user.model';

export interface CharacterOwner {
  id: string;
  username: string;
  avatar: string | null;
}

export interface CharacterResponse {
  id: string;
  name: string;
  realm: string;
  class: WowClass;
  className: string;
  primarySpec: WowSpec;
  primarySpecName: string;
  secondarySpec: WowSpec | null;
  secondarySpecName: string | null;
  isMain: boolean;
  isActive: boolean;
  notes: string | null;
  owner: CharacterOwner | null;
}

export interface RosterResponse {
  characters: CharacterResponse[];
  totalCount: number;
  activeCount: number;
}

export interface CreateCharacterRequest {
  name: string;
  realm: string;
  class: WowClass;
  primarySpec: WowSpec;
  secondarySpec?: WowSpec;
  userId?: string;
  isMain: boolean;
  notes?: string;
}

export interface UpdateCharacterRequest {
  name?: string;
  realm: string;
  primarySpec: WowSpec;
  secondarySpec?: WowSpec;
  isMain: boolean;
  isActive: boolean;
  notes?: string;
}

export interface UpdateSpecRequest {
  primarySpec: WowSpec;
  secondarySpec?: WowSpec;
}

export interface AssignCharacterRequest {
  userId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/roster`;

  // Get all roster characters
  getRoster(includeInactive = false): Observable<RosterResponse> {
    return this.http.get<RosterResponse>(`${this.baseUrl}?includeInactive=${includeInactive}`);
  }

  // Get single character
  getCharacter(id: string): Observable<CharacterResponse> {
    return this.http.get<CharacterResponse>(`${this.baseUrl}/${id}`);
  }

  // Create character (Officer only)
  createCharacter(request: CreateCharacterRequest): Observable<CharacterResponse> {
    return this.http.post<CharacterResponse>(this.baseUrl, request);
  }

  // Update character (Officer only)
  updateCharacter(id: string, request: UpdateCharacterRequest): Observable<CharacterResponse> {
    return this.http.put<CharacterResponse>(`${this.baseUrl}/${id}`, request);
  }

  // Delete character (Officer only - soft delete)
  deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Assign character to user (Officer only)
  assignCharacter(id: string, userId: string | null): Observable<CharacterResponse> {
    return this.http.put<CharacterResponse>(`${this.baseUrl}/${id}/assign`, { userId });
  }

  // Update own character spec (Raider)
  updateSpec(id: string, request: UpdateSpecRequest): Observable<CharacterResponse> {
    return this.http.put<CharacterResponse>(`${this.baseUrl}/${id}/spec`, request);
  }

  // Set character as main (Raider)
  setAsMain(id: string): Observable<CharacterResponse> {
    return this.http.put<CharacterResponse>(`${this.baseUrl}/${id}/main`, {});
  }
}

// Helper functions
export const WOW_CLASS_NAMES: Record<WowClass, string> = {
  [WowClass.Warrior]: 'Warrior',
  [WowClass.Paladin]: 'Paladin',
  [WowClass.Hunter]: 'Hunter',
  [WowClass.Rogue]: 'Rogue',
  [WowClass.Priest]: 'Priest',
  [WowClass.Shaman]: 'Shaman',
  [WowClass.Mage]: 'Mage',
  [WowClass.Warlock]: 'Warlock',
  [WowClass.Druid]: 'Druid',
};

export const WOW_CLASS_COLORS: Record<WowClass, string> = {
  [WowClass.Warrior]: '#C79C6E',
  [WowClass.Paladin]: '#F58CBA',
  [WowClass.Hunter]: '#ABD473',
  [WowClass.Rogue]: '#FFF569',
  [WowClass.Priest]: '#FFFFFF',
  [WowClass.Shaman]: '#0070DE',
  [WowClass.Mage]: '#69CCF0',
  [WowClass.Warlock]: '#9482C9',
  [WowClass.Druid]: '#FF7D0A',
};

export const WOW_SPECS_BY_CLASS: Record<WowClass, { value: WowSpec; name: string }[]> = {
  [WowClass.Warrior]: [
    { value: WowSpec.Arms, name: 'Arms' },
    { value: WowSpec.Fury, name: 'Fury' },
    { value: WowSpec.ProtectionWarrior, name: 'Protection' },
  ],
  [WowClass.Paladin]: [
    { value: WowSpec.HolyPaladin, name: 'Holy' },
    { value: WowSpec.ProtectionPaladin, name: 'Protection' },
    { value: WowSpec.Retribution, name: 'Retribution' },
  ],
  [WowClass.Hunter]: [
    { value: WowSpec.BeastMastery, name: 'Beast Mastery' },
    { value: WowSpec.Marksmanship, name: 'Marksmanship' },
    { value: WowSpec.Survival, name: 'Survival' },
  ],
  [WowClass.Rogue]: [
    { value: WowSpec.Assassination, name: 'Assassination' },
    { value: WowSpec.Combat, name: 'Combat' },
    { value: WowSpec.Subtlety, name: 'Subtlety' },
  ],
  [WowClass.Priest]: [
    { value: WowSpec.Discipline, name: 'Discipline' },
    { value: WowSpec.HolyPriest, name: 'Holy' },
    { value: WowSpec.Shadow, name: 'Shadow' },
  ],
  [WowClass.Shaman]: [
    { value: WowSpec.Elemental, name: 'Elemental' },
    { value: WowSpec.Enhancement, name: 'Enhancement' },
    { value: WowSpec.RestorationShaman, name: 'Restoration' },
  ],
  [WowClass.Mage]: [
    { value: WowSpec.Arcane, name: 'Arcane' },
    { value: WowSpec.Fire, name: 'Fire' },
    { value: WowSpec.FrostMage, name: 'Frost' },
  ],
  [WowClass.Warlock]: [
    { value: WowSpec.Affliction, name: 'Affliction' },
    { value: WowSpec.Demonology, name: 'Demonology' },
    { value: WowSpec.Destruction, name: 'Destruction' },
  ],
  [WowClass.Druid]: [
    { value: WowSpec.Balance, name: 'Balance' },
    { value: WowSpec.FeralCombat, name: 'Feral' },
    { value: WowSpec.RestorationDruid, name: 'Restoration' },
  ],
};

export const ALL_WOW_CLASSES = [
  WowClass.Warrior,
  WowClass.Paladin,
  WowClass.Hunter,
  WowClass.Rogue,
  WowClass.Priest,
  WowClass.Shaman,
  WowClass.Mage,
  WowClass.Warlock,
  WowClass.Druid,
];
