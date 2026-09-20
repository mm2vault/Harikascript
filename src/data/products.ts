import { Product } from '../types';
import { ALL_FRAMES } from './framesCatalog';

export { ALL_FRAMES };

export const INITIAL_PRODUCTS: Product[] = [
  // 160+ Frames (Boys & Girls & Unisex)
  ...ALL_FRAMES,

  // ==========================================
  // AVATARS (Avatarlar)
  // ==========================================
  {
    id: 'avatar-cyber-samurai',
    name: 'Siber Samuray',
    category: 'avatars',
    description: 'Geleceğin neon sokaklarında onurlu bir savaşçı.',
    price: 350,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    rarity: 'epic'
  },
  {
    id: 'avatar-neon-cat',
    name: 'Siber Kedi Maskot',
    category: 'avatars',
    description: 'Fütüristik vizörlü sevimli siber kedi avatarı.',
    price: 300,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    rarity: 'rare'
  },
  {
    id: 'avatar-shadow-reaper',
    name: 'Gölge Avcısı',
    category: 'avatars',
    description: 'Karanlıklar aleminden yükselen gizemli siluet.',
    price: 400,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=80',
    rarity: 'legendary'
  },
  {
    id: 'avatar-mecha-valkyrie',
    name: 'Meka Valkyrie',
    category: 'avatars',
    description: 'Yapay zeka zırhı kuşanmış galaktik koruyucu.',
    price: 450,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    rarity: 'mythic'
  },
  {
    id: 'avatar-arcade-bot',
    name: 'Arcade Bot 8-Bit',
    category: 'avatars',
    description: 'Retro 80ler arcade dünyasından gelen sevimli robot.',
    price: 280,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    rarity: 'rare',
    isNew: true
  },
  {
    id: 'avatar-cyber-ninja',
    name: 'Karanlık Siber Ninja',
    category: 'avatars',
    description: 'Neon bıçaklarıyla gölgelerde bekleyen suikastçı.',
    price: 380,
    isAnimated: false,
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    rarity: 'epic',
    isNew: true
  },

  // ==========================================
  // EFFECTS (Profil Efektleri)
  // ==========================================
  {
    id: 'effect-simsek',
    name: 'Şimşek Kıvılcımları',
    category: 'effects',
    description: 'Profil arkasında çakan dinamik mavi elektrik arkları.',
    price: 380,
    isAnimated: true,
    rarity: 'epic',
    isPopular: true
  },
  {
    id: 'effect-matrix',
    name: 'Matrix Kod Akışı',
    category: 'effects',
    description: 'Yukarıdan aşağıya süzülen yeşil siber kod yağmuru.',
    price: 320,
    isAnimated: true,
    rarity: 'rare'
  },
  {
    id: 'effect-starfall',
    name: 'Kayan Yıldızlar & Nebula',
    category: 'effects',
    description: 'Sürekli parıldayan altın rengi büyü tozu.',
    price: 400,
    isAnimated: true,
    rarity: 'legendary'
  },
  {
    id: 'effect-snow-blizzard',
    name: 'Kristal Kar Tanesi Fırtınası',
    category: 'effects',
    description: 'Buz mavisi parıldayan buz kristalleri ve dondurucu aura.',
    price: 420,
    isAnimated: true,
    rarity: 'epic',
    isNew: true
  },
  {
    id: 'effect-hologram-glitch',
    name: 'Hologram Tarayıcı',
    category: 'effects',
    description: 'Profilin üstünde dönen fütüristik hedefleme hologramı.',
    price: 460,
    isAnimated: true,
    rarity: 'legendary',
    isNew: true
  },

  // ==========================================
  // BADGES (Rozetler)
  // ==========================================
  {
    id: 'badge-vip-crown',
    name: 'VIP Altın Taç',
    category: 'badges',
    description: 'Profilinde parıldayan asil kraliyet tacı rozeti.',
    price: 600,
    isAnimated: true,
    rarity: 'mythic',
    isPopular: true
  },
  {
    id: 'badge-diamond',
    name: 'Elmas Onay Rozeti',
    category: 'badges',
    description: 'Doğrulanmış elit üyelik elmas simgesi.',
    price: 450,
    isAnimated: false,
    rarity: 'legendary'
  },
  {
    id: 'badge-script-master',
    name: 'Script Ustası (Developer)',
    category: 'badges',
    description: 'Lua kod yazma ve executor testinde usta olanlara özel nişan.',
    price: 520,
    isAnimated: true,
    rarity: 'legendary',
    isNew: true
  },
  {
    id: 'badge-early-supporter',
    name: 'Erken Destekçi',
    category: 'badges',
    description: 'Topluluğun ilk kurucu üyelerine özel rozet.',
    price: 250,
    isAnimated: false,
    rarity: 'rare'
  },
  {
    id: 'badge-mm2-champion',
    name: 'MM2 Şampiyon Rozeti',
    category: 'badges',
    description: 'Murder Mystery 2 arenasında en iyi şerif ve katillere özel.',
    price: 350,
    isAnimated: false,
    rarity: 'rare',
    isNew: true
  }
];
