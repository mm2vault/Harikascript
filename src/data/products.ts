import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // FRAMES (Çerçeveler) - Classic + Discord-Style
  // ==========================================
  {
    id: 'frame-siyah',
    name: 'Siyah Çerçeve',
    category: 'frames',
    description: 'Karanlığın gücünü profilinde hisset.',
    price: 450,
    isAnimated: true,
    frameType: 'gothic_black',
    rarity: 'mythic',
    isPopular: true,
    tagText: 'Klasik Neon'
  },
  {
    id: 'frame-isilti',
    name: 'Işıltı Çerçevesi',
    category: 'frames',
    description: 'Işık, seninle daha güzel.',
    price: 500,
    isAnimated: true,
    frameType: 'radiance',
    rarity: 'legendary',
    isPopular: true,
    tagText: 'Güneş Işıltısı'
  },
  {
    id: 'frame-halka',
    name: 'Halka Çerçeve',
    category: 'frames',
    description: 'Sadelik bazen en güçlü olandır.',
    price: 550,
    isAnimated: true,
    frameType: 'neon_ring',
    rarity: 'epic',
    isPopular: true,
    tagText: 'Minimal'
  },
  {
    id: 'frame-siber-heks',
    name: 'Siber Heksagon',
    category: 'frames',
    description: 'Neon elektrik akımlarıyla parlayan dijital petek.',
    price: 600,
    isAnimated: true,
    frameType: 'cyber_hex',
    rarity: 'legendary',
    tagText: 'Cyberpunk'
  },
  {
    id: 'frame-ates-cemberi',
    name: 'Alev Çemberi',
    category: 'frames',
    description: 'Köz ve akkor plazma dalgalarıyla çevrili profil.',
    price: 480,
    isAnimated: true,
    frameType: 'fire_aura',
    rarity: 'epic',
    tagText: 'Ateş'
  },
  {
    id: 'frame-void-dragon',
    name: 'Boşluk Ejderi',
    category: 'frames',
    description: 'Mor karanlık enerjinin kadim döngüsü.',
    price: 700,
    isAnimated: true,
    frameType: 'void_dragon',
    rarity: 'mythic',
    tagText: 'Void'
  },
  {
    id: 'frame-kozmik-yildiz',
    name: 'Kozmik Galaksi',
    category: 'frames',
    description: 'Yıldız tozu ve dönen nebulalarla donatılmış zarafet.',
    price: 520,
    isAnimated: true,
    frameType: 'cosmic_star',
    rarity: 'epic',
    tagText: 'Galaksi'
  },
  {
    id: 'frame-glitch-matris',
    name: 'Glitch Matrisi',
    category: 'frames',
    description: 'Sistem hatası efekti veren retro siber çerçeve.',
    price: 420,
    isAnimated: true,
    frameType: 'glitch_matrix',
    rarity: 'rare',
    tagText: 'Matrix'
  },

  // NEW DISCORD-STYLE COSMETICS
  {
    id: 'frame-aurora',
    name: 'Kuzey Işıkları (Aurora)',
    category: 'frames',
    description: 'Gökyüzünü büyüleyen turkuaz ve mor kutup ışık halkası.',
    price: 620,
    isAnimated: true,
    frameType: 'aurora_borealis',
    rarity: 'legendary',
    isNew: true,
    tagText: 'Discord Nitro Tarzı'
  },
  {
    id: 'frame-flame-burst',
    name: 'Cehennem Kıvılcımı',
    category: 'frames',
    description: 'Canlı akkor alev parçacıklarıyla yanan dinamik çerçeve.',
    price: 580,
    isAnimated: true,
    frameType: 'flame_burst',
    rarity: 'epic',
    isNew: true,
    tagText: 'Ateşli'
  },
  {
    id: 'frame-lightning',
    name: 'Yıldırım Fırtınası',
    category: 'frames',
    description: 'Profil çevresinde yüksek voltajlı elektrik patlamaları.',
    price: 650,
    isAnimated: true,
    frameType: 'lightning_shock',
    rarity: 'legendary',
    isNew: true,
    tagText: 'Elektrik'
  },
  {
    id: 'frame-rainbow',
    name: 'Neon Krom Prizma',
    category: 'frames',
    description: '360 derece kesintisiz renk değiştiren dinamik spektrum.',
    price: 750,
    isAnimated: true,
    frameType: 'rainbow_pulse',
    rarity: 'mythic',
    isPopular: true,
    tagText: 'Renkli Spektrum'
  },
  {
    id: 'frame-void-portal',
    name: 'Karanlık Portal',
    category: 'frames',
    description: 'Boyutlar arası açılan kara delik çekim alanı.',
    price: 800,
    isAnimated: true,
    frameType: 'void_portal',
    rarity: 'mythic',
    isNew: true,
    tagText: 'Kara Delik'
  },
  {
    id: 'frame-gold-royale',
    name: 'Kraliyet Altını',
    category: 'frames',
    description: '24 Ayar saf altın ışıltısı ve elmas süslemeleri.',
    price: 850,
    isAnimated: true,
    frameType: 'gold_royale',
    rarity: 'mythic',
    tagText: 'VIP Özel'
  },
  {
    id: 'frame-prism-cyber',
    name: 'Prizmatik Glitch',
    category: 'frames',
    description: 'Holografik prizma kırılımlı neon siber çerçeve.',
    price: 590,
    isAnimated: true,
    frameType: 'prism_cyber',
    rarity: 'epic',
    tagText: 'Holo'
  },
  {
    id: 'frame-venom-toxic',
    name: 'Zehirli Biyo-Tehlike',
    category: 'frames',
    description: 'Neon yeşil biyo-enerji sızıntısıyla kaplanmış çerçeve.',
    price: 540,
    isAnimated: true,
    frameType: 'venom_toxic',
    rarity: 'epic',
    tagText: 'Toxic'
  },
  {
    id: 'frame-sakura',
    name: 'Sakura Çiçek Esintisi',
    category: 'frames',
    description: 'Bahar rüzgarında uçuşan pembe sakura yaprakları.',
    price: 560,
    isAnimated: true,
    frameType: 'sakura_blossom',
    rarity: 'legendary',
    isNew: true,
    tagText: 'Anime / Sakura'
  },
  {
    id: 'frame-cyber-holo',
    name: 'Fütüristik Siber Kalkan',
    category: 'frames',
    description: 'Sürekli tarama yapan lazer hedefleme halkası.',
    price: 610,
    isAnimated: true,
    frameType: 'cyber_holo',
    rarity: 'epic',
    tagText: 'Sci-Fi'
  },

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
