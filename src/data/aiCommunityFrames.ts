import { Product } from '../types';

export const INITIAL_AI_COMMUNITY_FRAMES: Product[] = [
  {
    id: 'ai-comm-1',
    name: 'Kızıl Şafak Ejderha Haresi',
    category: 'frames',
    description: '"Alevli kan kırmızı ejderha başı, altın kıvılcımlar ve dönen kor halkası" isteğine göre AI tarafından üretildi.',
    price: 1850,
    isAnimated: true,
    isAiGenerated: true,
    createdBy: 'AteşEfendisi',
    creatorTag: '#7789',
    likesCount: 142,
    isLiked: false,
    rarity: 'mythic',
    gender: 'male',
    theme: 'dragon',
    tagText: '✨ AI Başyapıt',
    prompt: 'Alevli kan kırmızı ejderha başı, altın kıvılcımlar ve dönen kor halkası',
    createdAt: '2 saat önce',
    frameStyle: {
      primaryColor: '#ef4444',
      secondaryColor: '#f97316',
      accentColor: '#facc15',
      glowColor: '#dc2626',
      borderType: 'spikes',
      ornament: 'dragon',
      animationEffect: 'flame'
    },
    pricing: {
      basePrice: 500,
      complexityCost: 450,
      ornamentCost: 400,
      rarityMultiplier: 1.6,
      totalCoinPrice: 1850,
      priceBreakdown: [
        { item: 'Temel AI Matris Kalıbı', cost: 500 },
        { item: 'Alev & Partikül Fizik Motoru', cost: 450 },
        { item: 'Özel Ejderha Başı Süslemesi', cost: 400 },
        { item: 'Mistik Nadirlik Çarpanı', cost: 500 }
      ],
      explanation: 'Çift alev akışı ve detaylı ejderha kalkanı sebebiyle yüksek nadirlikte hesaplandı.'
    }
  },
  {
    id: 'ai-comm-2',
    name: 'Pastel Pembe Kawaii Neko',
    category: 'frames',
    description: '"Sevimli kedi kulakları, pembe pastel kalpler ve narin ışıltı" isteğiyle AI tarafından dokundu.',
    price: 1200,
    isAnimated: true,
    isAiGenerated: true,
    createdBy: 'MeowPrincess',
    creatorTag: '#2048',
    likesCount: 289,
    isLiked: true,
    rarity: 'epic',
    gender: 'female',
    theme: 'cute',
    tagText: '🌸 AI Özel Kız',
    prompt: 'Sevimli kedi kulakları, pembe pastel kalpler ve narin ışıltı',
    createdAt: '5 saat önce',
    frameStyle: {
      primaryColor: '#f472b6',
      secondaryColor: '#fb7185',
      accentColor: '#ffffff',
      glowColor: '#ec4899',
      borderType: 'double',
      ornament: 'cat_ears',
      animationEffect: 'bounce'
    },
    pricing: {
      basePrice: 500,
      complexityCost: 250,
      ornamentCost: 250,
      rarityMultiplier: 1.2,
      totalCoinPrice: 1200,
      priceBreakdown: [
        { item: 'Temel AI Matris Kalıbı', cost: 500 },
        { item: 'Zıplayan Kawaii Animasyonu', cost: 250 },
        { item: 'Kedi Kulakları Vektör Çizimi', cost: 250 },
        { item: 'Destansı Nadirlik Çarpanı', cost: 200 }
      ],
      explanation: 'Kawaii neko kulakları ve sevimli kalp parçacıkları optimize edilerek fiyatlandırıldı.'
    }
  },
  {
    id: 'ai-comm-3',
    name: 'Semavi Işık Melek Kanatları',
    category: 'frames',
    description: '"Göklerden inen bembeyaz melek kanatları ve kutsal altın hare" komutuyla AI tarafından tasarlandı.',
    price: 1600,
    isAnimated: true,
    isAiGenerated: true,
    createdBy: 'Seraphim',
    creatorTag: '#0001',
    likesCount: 195,
    isLiked: false,
    rarity: 'legendary',
    gender: 'female',
    theme: 'angel',
    tagText: '✨ AI Başyapıt',
    prompt: 'Göklerden inen bembeyaz melek kanatları ve kutsal altın hare',
    createdAt: '1 gün önce',
    frameStyle: {
      primaryColor: '#e0e7ff',
      secondaryColor: '#c7d2fe',
      accentColor: '#fef08a',
      glowColor: '#818cf8',
      borderType: 'ornamental',
      ornament: 'wings',
      animationEffect: 'aurora'
    },
    pricing: {
      basePrice: 500,
      complexityCost: 350,
      ornamentCost: 400,
      rarityMultiplier: 1.4,
      totalCoinPrice: 1600,
      priceBreakdown: [
        { item: 'Temel AI Matris Kalıbı', cost: 500 },
        { item: 'Aurora Işıltı Animasyonu', cost: 350 },
        { item: 'Çift Melek Kanadı İllüstrasyonu', cost: 400 },
        { item: 'Efsanevi Nadirlik Çarpanı', cost: 350 }
      ],
      explanation: 'Yumuşak kutup ışığı geçişleri ve zarif melek tüyü detayları birleştirildi.'
    }
  },
  {
    id: 'ai-comm-4',
    name: 'Glitch Runner 2099',
    category: 'frames',
    description: '"Karanlık siberpunk neon mavi ve turkuaz glitch dalgaları" isteğiyle AI tarafından kodlandı.',
    price: 1450,
    isAnimated: true,
    isAiGenerated: true,
    createdBy: 'CyberGhost',
    creatorTag: '#9901',
    likesCount: 167,
    isLiked: false,
    rarity: 'legendary',
    gender: 'male',
    theme: 'cyber',
    tagText: '⚡ AI Siber Tasarım',
    prompt: 'Karanlık siberpunk neon mavi ve turkuaz glitch dalgaları',
    createdAt: '2 gün önce',
    frameStyle: {
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      accentColor: '#10b981',
      glowColor: '#0891b2',
      borderType: 'cyber',
      ornament: 'crystals',
      animationEffect: 'glitch'
    },
    pricing: {
      basePrice: 500,
      complexityCost: 400,
      ornamentCost: 250,
      rarityMultiplier: 1.4,
      totalCoinPrice: 1450,
      priceBreakdown: [
        { item: 'Temel AI Matris Kalıbı', cost: 500 },
        { item: 'Siber Glitch & Frekans Bozulması', cost: 400 },
        { item: 'Teknoloji Köşebentleri', cost: 250 },
        { item: 'Efsanevi Nadirlik Çarpanı', cost: 300 }
      ],
      explanation: 'Dinamik frekans bozulma motoru ve köşeli siber braketler için optimize edildi.'
    }
  }
];
