export type CategoryType =
  | 'all'
  | 'scripts'
  | 'games'
  | 'executors'
  | 'frames'
  | 'avatars'
  | 'effects'
  | 'badges'
  | 'inventory';

export type CosmeticFrameType =
  | 'gothic_black'
  | 'radiance'
  | 'neon_ring'
  | 'cyber_hex'
  | 'fire_aura'
  | 'void_dragon'
  | 'cosmic_star'
  | 'glitch_matrix'
  | 'aurora_borealis'
  | 'flame_burst'
  | 'lightning_shock'
  | 'rainbow_pulse'
  | 'void_portal'
  | 'gold_royale'
  | 'prism_cyber'
  | 'venom_toxic'
  | 'storm_tempest'
  | 'eclipse_dark'
  | 'sakura_blossom'
  | 'cyber_holo';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  originalPrice?: number;
  isAnimated: boolean;
  frameType?: CosmeticFrameType;
  previewImage?: string;
  badgeIcon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isPopular?: boolean;
  isNew?: boolean;
  tagText?: string;
}

export interface ScriptItem {
  id: string;
  name: string;
  category: string; // 'bloxfruits' | 'mm2' | 'bladeball' | 'dahood' | 'petsim' | 'rivals' | 'brookhaven' | 'fisch' | 'doors' | 'arsenal' | 'kinglegacy' | 'bedwars' | 'slapbattles'
  gameName: string;
  desc: string;
  features: string[];
  executors: string[];
  workingVotes: number;
  patchedVotes: number;
  code: string;
  isPremium: boolean;
  isKeyless: boolean;
  coinPrice: number;
  image: string;
  downloads: number;
  views: number;
  status: 'active' | 'updating' | 'verified';
  version: string;
  userName: string;
  rating: number;
  ratingCount: number;
  updatedAt: string;
}

export interface GameItem {
  id: string;
  name: string;
  link: string;
  image: string;
  desc: string;
  developer: string;
  scriptCount: number;
  activePlayers: string;
  genre: string;
}

export interface ExecutorItem {
  id: string;
  name: string;
  platform: string;
  badge: string;
  status: string;
  unc: string;
  level: string;
  version: string;
  downloadUrl: string;
  desc: string;
  features: string[];
  guide: string[];
}

export interface DailyTask {
  id: string;
  title: string;
  reward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  isClaimed: boolean;
  actionType: 'copy_script' | 'view_item' | 'equip_cosmetic' | 'daily_login';
}

export interface UserState {
  name: string;
  tag: string;
  avatarUrl: string;
  coins: number;
  isPremium: boolean;
  ownedProductIds: string[];
  unlockedScriptIds: string[];
  equippedFrameId: string | null;
  equippedAvatarId: string | null;
  equippedEffectId: string | null;
  equippedBadgeId: string | null;
  completedTasks: string[];
  claimedDailyStreak: number;
  lastDailyClaim: string | null;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning';
}
