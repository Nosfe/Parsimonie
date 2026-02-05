export interface User {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface Character {
  id: string;
  name: string;
  realm: string;
  class: WowClass;
  primarySpec: WowSpec;
  secondarySpec: WowSpec | null;
  isMain: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MeResponse {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  roles: string[];
  createdAt: string;
  lastLoginAt: string;
  characters: Character[];
}

export enum WowClass {
  Warrior = 1,
  Paladin = 2,
  Hunter = 3,
  Rogue = 4,
  Priest = 5,
  Shaman = 7,
  Mage = 8,
  Warlock = 9,
  Druid = 11
}

export enum WowSpec {
  // Warriors (1xx)
  Arms = 101,
  Fury = 102,
  ProtectionWarrior = 103,
  // Paladins (2xx)
  HolyPaladin = 201,
  ProtectionPaladin = 202,
  Retribution = 203,
  // Hunters (3xx)
  BeastMastery = 301,
  Marksmanship = 302,
  Survival = 303,
  // Rogues (4xx)
  Assassination = 401,
  Combat = 402,
  Subtlety = 403,
  // Priests (5xx)
  Discipline = 501,
  HolyPriest = 502,
  Shadow = 503,
  // Shamans (7xx)
  Elemental = 701,
  Enhancement = 702,
  RestorationShaman = 703,
  // Mages (8xx)
  Arcane = 801,
  Fire = 802,
  FrostMage = 803,
  // Warlocks (9xx)
  Affliction = 901,
  Demonology = 902,
  Destruction = 903,
  // Druids (11xx)
  Balance = 1101,
  FeralCombat = 1102,
  RestorationDruid = 1103
}

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
