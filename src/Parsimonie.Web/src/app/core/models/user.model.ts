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
  spec: WowSpec;
  isMain: boolean;
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
  // Warriors
  Arms = 101,
  Fury = 102,
  ProtectionWarrior = 103,
  // Paladins
  HolyPaladin = 201,
  ProtectionPaladin = 202,
  Retribution = 203,
  // etc. - matching API enums
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
