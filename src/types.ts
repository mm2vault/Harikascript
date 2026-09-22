export type CategoryType =
  | 'all'
  | 'scripts'
  | 'games'
  | 'executors'
  | 'frames'
  | 'ai-studio'
  | 'avatars'
  | 'effects'
  | 'badges'
  | 'inventory'
  | 'admin';

export type CosmeticFrameType = string;

export interface FrameStyleConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  glowColor: string;
  borderType?: 'solid' | 'dashed' | 'double' | 'gradient' | 'ornamental' | 'spikes' | 'hearts' | 'stars' | 'wings' | 'runes' | 'cyber' | 'electric' | 'floral' | 'fire_ring' | 'spider_web';
  ornament?: string;
  bottomOrnament?: string;
  animationEffect?: 'pulse' | 'spin' | 'shimmer' | 'bounce' | 'wave' | 'glitch' | 'aurora' | 'flame' | 'rainbow' | 'vortex' | 'electric';
  customSvg?: string;
  frameImage?: string;
  /** When true, black pixels in an uploaded frame/GIF visually blend away so the avatar remains visible. */
  removeBlackCenter?: boolean;
  particleType?: 'embers' | 'sparkles' | 'petals' | 'hearts' | 'matrix' | 'lightning' | 'bubbles' | 'none';
  auraSize?: number;
}

export interface FramePriceItem {
  item: string;
  cost: number;
}

export interface FramePricing {
  basePrice: number;
  complexityCost: number;
  ornamentCost: number;
  rarityMultiplier: number;
  totalCoinPrice: number;
  priceBreakdown: FramePriceItem[];
  explanation: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  originalPrice?: number;
  isAnimated: boolean;
  frameType?: CosmeticFrameType;
  frameStyle?: FrameStyleConfig;
  gender?: 'female' | 'male' | 'unisex';
  theme?: string;
  previewImage?: string;
  badgeIcon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isPopular?: boolean;
  isNew?: boolean;
  tagText?: string;
  isAiGenerated?: boolean;
  createdBy?: string;
  creatorTag?: string;
  likesCount?: number;
  isLiked?: boolean;
  pricing?: FramePricing;
  prompt?: string;
  createdAt?: string;
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
  creatorId?: string;
  creatorName?: string;
  creatorTag?: string;
  creatorAvatarUrl?: string;
  creatorFrameId?: string | null;
  creatorFrameStyle?: FrameStyleConfig;
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
