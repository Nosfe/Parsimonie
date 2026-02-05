import { Injectable } from '@angular/core';
import { MeResponse, User, Character, WowClass, WowSpec } from '../models/user.model';

export interface MockRaidEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  instance: string;
  status: 'Open' | 'Full' | 'Locked';
  signedUp: number;
  needed: number;
  tanks?: { current: number; needed: number };
  healers?: { current: number; needed: number };
  dps?: { current: number; needed: number };
}

export interface MockGearItem {
  id: string;
  name: string;
  slot: string;
  quality: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  itemLevel: number;
  source: string;
}

export interface MockGuildStats {
  totalMembers: number;
  onlineNow: number;
  raidsThisWeek: number;
  bossesKilled: number;
  averageAttendance: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  private readonly mockUser: User = {
    id: 'demo-user-001',
    discordId: '123456789',
    username: 'DemoRaider',
    avatar: null,
    roles: ['Raider', 'Officer']
  };

  private readonly mockCharacters: Character[] = [
    {
      id: 'char-001',
      name: 'Thunderfury',
      realm: 'Firemaw',
      class: WowClass.Warrior,
      primarySpec: WowSpec.ProtectionWarrior,
      secondarySpec: WowSpec.Fury,
      isMain: true,
      isActive: true,
      createdAt: '2026-01-15T10:00:00Z'
    },
    {
      id: 'char-002',
      name: 'Shadowmeld',
      realm: 'Firemaw',
      class: WowClass.Rogue,
      primarySpec: WowSpec.Combat,
      secondarySpec: null,
      isMain: false,
      isActive: true,
      createdAt: '2026-01-20T14:30:00Z'
    },
    {
      id: 'char-003',
      name: 'Holytree',
      realm: 'Firemaw',
      class: WowClass.Druid,
      primarySpec: WowSpec.RestorationDruid,
      secondarySpec: WowSpec.Balance,
      isMain: false,
      isActive: true,
      createdAt: '2026-01-22T09:15:00Z'
    }
  ];

  getMockUser(): User {
    return { ...this.mockUser };
  }

  getMockUserResponse(): MeResponse {
    return {
      ...this.mockUser,
      createdAt: '2026-01-10T08:00:00Z',
      lastLoginAt: new Date().toISOString(),
      characters: [...this.mockCharacters]
    };
  }

  getMockCharacters(): Character[] {
    return [...this.mockCharacters];
  }

  getMockRosterCharacters(): any[] {
    const owners = [
      { id: 'user-1', username: 'Thunderlord', avatar: null },
      { id: 'user-2', username: 'ShadowDancer', avatar: null },
      { id: 'user-3', username: 'HolyMoly', avatar: null },
      { id: 'user-4', username: 'FrostBite', avatar: null },
      { id: 'user-5', username: 'FireStorm', avatar: null },
      null
    ];

    return [
      // Warriors
      { id: '1', name: 'Thunderfury', realm: 'Firemaw', class: WowClass.Warrior, primarySpec: WowSpec.ProtectionWarrior, primarySpecName: 'Protection', secondarySpec: WowSpec.Fury, secondarySpecName: 'Fury', isMain: true, isActive: true, owner: owners[0] },
      { id: '2', name: 'Rageclaw', realm: 'Firemaw', class: WowClass.Warrior, primarySpec: WowSpec.Fury, primarySpecName: 'Fury', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[1] },
      
      // Paladins
      { id: '3', name: 'Lightbringer', realm: 'Firemaw', class: WowClass.Paladin, primarySpec: WowSpec.HolyPaladin, primarySpecName: 'Holy', secondarySpec: WowSpec.ProtectionPaladin, secondarySpecName: 'Protection', isMain: true, isActive: true, owner: owners[2] },
      { id: '4', name: 'Crusader', realm: 'Firemaw', class: WowClass.Paladin, primarySpec: WowSpec.Retribution, primarySpecName: 'Retribution', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[3] },
      
      // Hunters
      { id: '5', name: 'Beastmaster', realm: 'Firemaw', class: WowClass.Hunter, primarySpec: WowSpec.BeastMastery, primarySpecName: 'Beast Mastery', secondarySpec: WowSpec.Marksmanship, secondarySpecName: 'Marksmanship', isMain: true, isActive: true, owner: owners[4] },
      { id: '6', name: 'Deadeye', realm: 'Firemaw', class: WowClass.Hunter, primarySpec: WowSpec.Survival, primarySpecName: 'Survival', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: null },
      
      // Rogues
      { id: '7', name: 'Shadowstep', realm: 'Firemaw', class: WowClass.Rogue, primarySpec: WowSpec.Combat, primarySpecName: 'Combat', secondarySpec: WowSpec.Assassination, secondarySpecName: 'Assassination', isMain: true, isActive: true, owner: owners[1] },
      { id: '8', name: 'Venomfang', realm: 'Firemaw', class: WowClass.Rogue, primarySpec: WowSpec.Subtlety, primarySpecName: 'Subtlety', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: false, owner: null },
      
      // Priests
      { id: '9', name: 'Serenity', realm: 'Firemaw', class: WowClass.Priest, primarySpec: WowSpec.HolyPriest, primarySpecName: 'Holy', secondarySpec: WowSpec.Discipline, secondarySpecName: 'Discipline', isMain: true, isActive: true, owner: owners[2] },
      { id: '10', name: 'Shadowform', realm: 'Firemaw', class: WowClass.Priest, primarySpec: WowSpec.Shadow, primarySpecName: 'Shadow', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[4] },
      
      // Shamans
      { id: '11', name: 'Stormcaller', realm: 'Firemaw', class: WowClass.Shaman, primarySpec: WowSpec.RestorationShaman, primarySpecName: 'Restoration', secondarySpec: WowSpec.Elemental, secondarySpecName: 'Elemental', isMain: true, isActive: true, owner: owners[3] },
      { id: '12', name: 'Earthshaker', realm: 'Firemaw', class: WowClass.Shaman, primarySpec: WowSpec.Enhancement, primarySpecName: 'Enhancement', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[0] },
      
      // Mages
      { id: '13', name: 'Frostfire', realm: 'Firemaw', class: WowClass.Mage, primarySpec: WowSpec.FrostMage, primarySpecName: 'Frost', secondarySpec: WowSpec.Fire, secondarySpecName: 'Fire', isMain: true, isActive: true, owner: owners[4] },
      { id: '14', name: 'Arcanus', realm: 'Firemaw', class: WowClass.Mage, primarySpec: WowSpec.Arcane, primarySpecName: 'Arcane', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: null },
      
      // Warlocks
      { id: '15', name: 'Soulstealer', realm: 'Firemaw', class: WowClass.Warlock, primarySpec: WowSpec.Destruction, primarySpecName: 'Destruction', secondarySpec: WowSpec.Affliction, secondarySpecName: 'Affliction', isMain: true, isActive: true, owner: owners[1] },
      { id: '16', name: 'Demonlord', realm: 'Firemaw', class: WowClass.Warlock, primarySpec: WowSpec.Demonology, primarySpecName: 'Demonology', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[2] },
      
      // Druids
      { id: '17', name: 'Moonkin', realm: 'Firemaw', class: WowClass.Druid, primarySpec: WowSpec.Balance, primarySpecName: 'Balance', secondarySpec: WowSpec.RestorationDruid, secondarySpecName: 'Restoration', isMain: true, isActive: true, owner: owners[3] },
      { id: '18', name: 'Feralclaw', realm: 'Firemaw', class: WowClass.Druid, primarySpec: WowSpec.FeralCombat, primarySpecName: 'Feral', secondarySpec: null, secondarySpecName: null, isMain: false, isActive: true, owner: owners[0] },
    ];
  }

  getMockRaidEvents(): MockRaidEvent[] {
    const today = new Date();
    return [
      {
        id: 'raid-1',
        name: 'Karazhan Clear',
        date: this.formatDate(this.addDays(today, 1)),
        time: '20:00',
        instance: 'Karazhan',
        status: 'Full',
        signedUp: 10,
        needed: 10,
        tanks: { current: 2, needed: 2 },
        healers: { current: 3, needed: 3 },
        dps: { current: 5, needed: 5 }
      },
      {
        id: 'raid-2',
        name: 'Gruul & Magtheridon',
        date: this.formatDate(this.addDays(today, 3)),
        time: '20:00',
        instance: "Gruul's Lair",
        status: 'Open',
        signedUp: 22,
        needed: 25,
        tanks: { current: 3, needed: 3 },
        healers: { current: 5, needed: 6 },
        dps: { current: 14, needed: 16 }
      },
      {
        id: 'raid-3',
        name: 'SSC Progress',
        date: this.formatDate(this.addDays(today, 5)),
        time: '19:30',
        instance: 'Serpentshrine Cavern',
        status: 'Open',
        signedUp: 24,
        needed: 25,
        tanks: { current: 3, needed: 3 },
        healers: { current: 6, needed: 6 },
        dps: { current: 15, needed: 16 }
      },
      {
        id: 'raid-4',
        name: 'The Eye Progress',
        date: this.formatDate(this.addDays(today, 7)),
        time: '19:30',
        instance: 'Tempest Keep',
        status: 'Open',
        signedUp: 20,
        needed: 25,
        tanks: { current: 2, needed: 3 },
        healers: { current: 5, needed: 6 },
        dps: { current: 13, needed: 16 }
      },
      {
        id: 'raid-5',
        name: 'Karazhan Clear (Alt Run)',
        date: this.formatDate(this.addDays(today, 8)),
        time: '21:00',
        instance: 'Karazhan',
        status: 'Locked',
        signedUp: 8,
        needed: 10,
        tanks: { current: 1, needed: 2 },
        healers: { current: 2, needed: 3 },
        dps: { current: 5, needed: 5 }
      }
    ];
  }

  getMockGearWishlist(): MockGearItem[] {
    return [
      { id: 'item-1', name: 'Thunderfury, Blessed Blade', slot: 'Main Hand', quality: 'legendary', itemLevel: 80, source: 'Molten Core' },
      { id: 'item-2', name: 'Bulwark of Azzinoth', slot: 'Off Hand', quality: 'epic', itemLevel: 141, source: 'Illidan Stormrage' },
      { id: 'item-3', name: 'Helm of Wrath', slot: 'Head', quality: 'epic', itemLevel: 76, source: 'Onyxia' },
      { id: 'item-4', name: 'Ashes of Al\'ar', slot: 'Mount', quality: 'legendary', itemLevel: 1, source: 'Kael\'thas Sunstrider' }
    ];
  }

  getMockGuildStats(): MockGuildStats {
    return {
      totalMembers: 47,
      onlineNow: 12,
      raidsThisWeek: 3,
      bossesKilled: 8,
      averageAttendance: 87
    };
  }

  getMockRecentActivity(): { action: string; character: string; time: string }[] {
    return [
      { action: 'Signed up for Karazhan Clear', character: 'Thunderfury', time: '2 hours ago' },
      { action: 'Updated spec to Protection', character: 'Lightbringer', time: '5 hours ago' },
      { action: 'Added new alt', character: 'Frostfire', time: '1 day ago' },
      { action: 'Marked as Main', character: 'Shadowstep', time: '2 days ago' },
      { action: 'Joined the guild', character: 'Moonkin', time: '3 days ago' }
    ];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
