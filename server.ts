import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Fallback intelligent generator for frame synthesis if API key is not present or rate limited
function generateProceduralFrame(prompt: string, gender: string, vibe: string) {
  const p = (prompt || '').toLowerCase();
  
  // 1. Determine theme, ornaments & effects
  let borderType: any = 'gradient';
  let ornament = 'stars';
  let bottomOrnament: any = 'none';
  let animationEffect: any = 'shimmer';
  let rarity: 'rare' | 'epic' | 'legendary' | 'mythic' = 'epic';
  let frameGender: 'female' | 'male' | 'unisex' = (gender as any) || 'unisex';
  let themeTitle = 'Özel AI Çerçevesi';

  // Theme matching
  if (
    p.includes('spiderman') ||
    p.includes('spider-man') ||
    p.includes('spider man') ||
    p.includes('örümcek adam') ||
    p.includes('orumcek adam') ||
    p.includes('spider') ||
    p.includes('örümcek') ||
    p.includes('orumcek') ||
    p.includes('venom') ||
    p.includes('miles morales') ||
    p.includes('peter parker')
  ) {
    const isVenom = p.includes('venom');
    ornament = isVenom ? 'venom' : 'spiderman';
    bottomOrnament = 'spider_emblem';
    borderType = 'spider_web';
    animationEffect = isVenom ? 'pulse' : 'pulse';
    rarity = 'mythic';
    themeTitle = isVenom
      ? 'Simbiyot Venom Siyah Ağ Çerçevesi'
      : 'Örümcek Adam (Spider-Man) Web Savaşçısı';
  } else if (p.includes('batman') || p.includes('yarasa') || p.includes('kara şövalye') || p.includes('dark knight')) {
    ornament = 'batman';
    bottomOrnament = 'batarang';
    borderType = 'spikes';
    animationEffect = 'aurora';
    rarity = 'legendary';
    themeTitle = 'Gotham Kara Şövalye Batman';
  } else if (p.includes('ironman') || p.includes('iron man') || p.includes('demir adam') || p.includes('tony stark') || p.includes('arc reactor')) {
    ornament = 'ironman';
    bottomOrnament = 'arc_reactor';
    borderType = 'cyber';
    animationEffect = 'glitch';
    rarity = 'mythic';
    themeTitle = 'Yenilmez Demir Adam (Iron Man) Mark V';
  } else if (p.includes('kurt') || p.includes('wolf')) {
    ornament = 'wolf';
    bottomOrnament = 'runes';
    borderType = 'runes';
    animationEffect = 'aurora';
    rarity = 'legendary';
    themeTitle = 'Göksel Kurt Ruhu';
  } else if (p.includes('samuray') || p.includes('katana') || p.includes('kılıç') || p.includes('kilic') || p.includes('ninja') || p.includes('bıçak')) {
    ornament = 'katana';
    bottomOrnament = 'katana_crossed';
    borderType = 'spikes';
    animationEffect = 'glitch';
    rarity = 'mythic';
    themeTitle = 'Gölge Katana Usta Samuray';
  } else if (p.includes('kedi') || p.includes('neko') || p.includes('kawaii') || p.includes('tatlı') || p.includes('pati')) {
    ornament = 'cat_ears';
    bottomOrnament = 'paws';
    borderType = 'double';
    animationEffect = 'bounce';
    rarity = 'epic';
    frameGender = 'female';
    themeTitle = 'Kawaii AI Neko & Pembe Pati';
  } else if (p.includes('tilki') || p.includes('kitsune')) {
    ornament = 'kitsune';
    bottomOrnament = 'ribbon';
    borderType = 'double';
    animationEffect = 'aurora';
    rarity = 'legendary';
    themeTitle = 'Efsanevi Kitsune Tilki Ruhu';
  } else if (p.includes('melek') || p.includes('kanat') || p.includes('angel') || p.includes('cennet') || p.includes('ilahi')) {
    ornament = 'halo';
    bottomOrnament = 'ribbon';
    borderType = 'ornamental';
    animationEffect = 'aurora';
    rarity = 'legendary';
    themeTitle = 'Semavi Başmelek Kanatları & Halesi';
  } else if (p.includes('ejder') || p.includes('dragon') || p.includes('alev') || p.includes('ateş') || p.includes('ates') || p.includes('kor')) {
    ornament = 'dragon';
    bottomOrnament = 'dragon_claws';
    borderType = 'spikes';
    animationEffect = 'flame';
    rarity = 'mythic';
    themeTitle = 'Kızıl Ejder Başlığı & Pençesi';
  } else if (p.includes('şeytan') || p.includes('seytan') || p.includes('iblis') || p.includes('boynuz') || p.includes('demon') || p.includes('cehennem')) {
    ornament = 'horns';
    bottomOrnament = 'flames';
    borderType = 'spikes';
    animationEffect = 'flame';
    rarity = 'mythic';
    themeTitle = 'Cehennem İblis Boynuzları & Alevi';
  } else if (p.includes('gül') || p.includes('gul') || p.includes('rose') || p.includes('diken') || p.includes('romantik')) {
    ornament = 'rose';
    bottomOrnament = 'roses';
    borderType = 'floral';
    animationEffect = 'shimmer';
    rarity = 'epic';
    themeTitle = 'Büyülü Kadife Gül & Dikenler';
  } else if (p.includes('kurukafa') || p.includes('kuru kafa') || p.includes('skull') || p.includes('azrail') || p.includes('reaper') || p.includes('ölüm') || p.includes('iskelet')) {
    ornament = 'skull';
    bottomOrnament = 'skull_pile';
    borderType = 'dashed';
    animationEffect = 'pulse';
    rarity = 'legendary';
    themeTitle = 'Gothic Azrail & Kurukafa Tacı';
  } else if (p.includes('şimşek') || p.includes('simsek') || p.includes('yıldırım') || p.includes('yildirim') || p.includes('fırtına') || p.includes('elektrik')) {
    ornament = 'lightning';
    bottomOrnament = 'cyber_hud';
    borderType = 'electric';
    animationEffect = 'glitch';
    rarity = 'mythic';
    themeTitle = 'Fırtına Tanrısı Şimşek Arkı';
  } else if (p.includes('siber') || p.includes('cyber') || p.includes('glitch') || p.includes('matrix') || p.includes('hacker') || p.includes('robot')) {
    ornament = 'cyber';
    bottomOrnament = 'cyber_hud';
    borderType = 'cyber';
    animationEffect = 'glitch';
    rarity = 'legendary';
    themeTitle = 'Cyberpunk Matrix HUD V3';
  } else if (p.includes('taç') || p.includes('tac') || p.includes('kral') || p.includes('kraliçe') || p.includes('crown') || p.includes('imparator')) {
    ornament = 'crown';
    bottomOrnament = 'diamond';
    borderType = 'ornamental';
    animationEffect = 'shimmer';
    rarity = 'mythic';
    themeTitle = 'İmparatorluk Mücevherli Altın Tacı';
  } else if (p.includes('örümcek') || p.includes('orumcek') || p.includes('spider') || p.includes('ağ')) {
    ornament = 'spider';
    bottomOrnament = 'runes';
    borderType = 'spikes';
    animationEffect = 'pulse';
    rarity = 'legendary';
    themeTitle = 'Zehirli Karadul Örümcek Ağı';
  } else if (p.includes('kalp') || p.includes('aşk') || p.includes('ask') || p.includes('sevgi')) {
    ornament = 'hearts';
    bottomOrnament = 'ribbon';
    borderType = 'gradient';
    animationEffect = 'shimmer';
    rarity = 'epic';
    frameGender = 'female';
    themeTitle = 'Işıltılı Kalp & İpek Kurdele';
  } else if (p.includes('sakura') || p.includes('çiçek') || p.includes('cicek') || p.includes('bahar')) {
    ornament = 'sakura';
    bottomOrnament = 'roses';
    borderType = 'double';
    animationEffect = 'aurora';
    rarity = 'epic';
    frameGender = 'female';
    themeTitle = 'Kiraz Çiçeği Sakura Dansı';
  } else if (p.includes('kelebek') || p.includes('butterfly')) {
    ornament = 'butterfly';
    bottomOrnament = 'ribbon';
    borderType = 'gradient';
    animationEffect = 'aurora';
    rarity = 'legendary';
    frameGender = 'female';
    themeTitle = 'Kristal Gökkuşağı Kelebeği';
  } else if (p.includes('uzay') || p.includes('galaksi') || p.includes('kozmik') || p.includes('yıldız') || p.includes('yildiz')) {
    ornament = 'stars';
    bottomOrnament = 'diamond';
    borderType = 'gradient';
    animationEffect = 'vortex';
    rarity = 'mythic';
    themeTitle = 'Kozmik Galaksi Nebula Girdabı';
  } else {
    // Default smart theme based on vibe
    if (vibe === 'cute') {
      ornament = 'hearts';
      bottomOrnament = 'paws';
      borderType = 'double';
      animationEffect = 'bounce';
      rarity = 'epic';
      themeTitle = 'Pastel Işıltılı Rüya';
    } else if (vibe === 'dark') {
      ornament = 'horns';
      bottomOrnament = 'flames';
      borderType = 'spikes';
      animationEffect = 'flame';
      rarity = 'mythic';
      themeTitle = 'Karanlık Ruhun Fısıltısı';
    } else {
      ornament = 'stars';
      bottomOrnament = 'cyber_hud';
      borderType = 'cyber';
      animationEffect = 'shimmer';
      rarity = 'legendary';
      themeTitle = 'Kozmik AI Işıma Çemberi';
    }
  }

  // 2. Determine dominant colors based on explicit color words in prompt
  let primaryColor = '#8b5cf6';
  let secondaryColor = '#ec4899';
  let accentColor = '#f43f5e';
  let glowColor = '#a855f7';

  if (p.includes('kırmızı') || p.includes('kirmizi') || p.includes('red') || p.includes('al ')) {
    primaryColor = '#ef4444';
    secondaryColor = '#dc2626';
    glowColor = '#f87171';
    accentColor = '#fecaca';
  } else if (p.includes('mavi') || p.includes('blue') || p.includes('gök') || p.includes('buz')) {
    primaryColor = '#3b82f6';
    secondaryColor = '#1d4ed8';
    glowColor = '#60a5fa';
    accentColor = '#93c5fd';
  } else if (p.includes('mor') || p.includes('purple') || p.includes('violet')) {
    primaryColor = '#a855f7';
    secondaryColor = '#7e22ce';
    glowColor = '#c084fc';
    accentColor = '#e9d5ff';
  } else if (p.includes('yeşil') || p.includes('yesil') || p.includes('green') || p.includes('zümrüt') || p.includes('zumrut')) {
    primaryColor = '#22c55e';
    secondaryColor = '#15803d';
    glowColor = '#4ade80';
    accentColor = '#bbf7d0';
  } else if (p.includes('pembe') || p.includes('pink') || p.includes('rose')) {
    primaryColor = '#ec4899';
    secondaryColor = '#be185d';
    glowColor = '#f472b6';
    accentColor = '#fbcfe8';
  } else if (p.includes('sarı') || p.includes('sari') || p.includes('altın') || p.includes('altin') || p.includes('gold') || p.includes('yellow')) {
    primaryColor = '#f59e0b';
    secondaryColor = '#b45309';
    glowColor = '#fbbf24';
    accentColor = '#fef08a';
  } else if (p.includes('turkuaz') || p.includes('cyan') || p.includes('aqua')) {
    primaryColor = '#06b6d4';
    secondaryColor = '#0e7490';
    glowColor = '#22d3ee';
    accentColor = '#a5f3fc';
  } else if (p.includes('siyah') || p.includes('black') || p.includes('kara') || p.includes('karanlık') || p.includes('karanlik')) {
    primaryColor = '#1e293b';
    secondaryColor = '#0f172a';
    glowColor = '#64748b';
    accentColor = '#cbd5e1';
  } else if (p.includes('beyaz') || p.includes('white') || p.includes('gümüş') || p.includes('gumus') || p.includes('silver')) {
    primaryColor = '#e2e8f0';
    secondaryColor = '#94a3b8';
    glowColor = '#f8fafc';
    accentColor = '#ffffff';
  } else if (p.includes('turuncu') || p.includes('orange')) {
    primaryColor = '#f97316';
    secondaryColor = '#c2410c';
    glowColor = '#fb923c';
    accentColor = '#ffedd5';
  } else {
    // If no explicit color was named, assign thematic colors
    if (ornament === 'spiderman' || ornament === 'spider') {
      primaryColor = '#dc2626'; // Iconic Spidey Red
      secondaryColor = '#1d4ed8'; // Classic Comic Blue
      accentColor = '#ffffff'; // White Spidey Eye
      glowColor = '#ef4444';
    } else if (ornament === 'venom') {
      primaryColor = '#09090b';
      secondaryColor = '#18181b';
      accentColor = '#ffffff';
      glowColor = '#e2e8f0';
    } else if (ornament === 'batman') {
      primaryColor = '#0f172a';
      secondaryColor = '#334155';
      accentColor = '#facc15';
      glowColor = '#64748b';
    } else if (ornament === 'ironman') {
      primaryColor = '#b91c1c';
      secondaryColor = '#ca8a04';
      accentColor = '#fef08a';
      glowColor = '#06b6d4';
    } else if (ornament === 'dragon' || ornament === 'flames') {
      primaryColor = '#ef4444';
      secondaryColor = '#f97316';
      accentColor = '#facc15';
      glowColor = '#dc2626';
    } else if (ornament === 'cat_ears' || ornament === 'hearts') {
      primaryColor = '#f472b6';
      secondaryColor = '#fb7185';
      accentColor = '#ffffff';
      glowColor = '#ec4899';
    } else if (ornament === 'wolf') {
      primaryColor = '#38bdf8';
      secondaryColor = '#6366f1';
      accentColor = '#e0e7ff';
      glowColor = '#0ea5e9';
    } else if (ornament === 'katana') {
      primaryColor = '#dc2626';
      secondaryColor = '#1e1b4b';
      accentColor = '#ffffff';
      glowColor = '#ef4444';
    } else if (ornament === 'halo' || ornament === 'wings') {
      primaryColor = '#e0e7ff';
      secondaryColor = '#c7d2fe';
      accentColor = '#fef08a';
      glowColor = '#818cf8';
    } else if (ornament === 'horns') {
      primaryColor = '#991b1b';
      secondaryColor = '#581c87';
      accentColor = '#ef4444';
      glowColor = '#b91c1c';
    } else if (ornament === 'rose') {
      primaryColor = '#be123c';
      secondaryColor = '#881337';
      accentColor = '#fda4af';
      glowColor = '#e11d48';
    } else if (ornament === 'cyber' || ornament === 'lightning') {
      primaryColor = '#06b6d4';
      secondaryColor = '#3b82f6';
      accentColor = '#10b981';
      glowColor = '#0891b2';
    }
  }

  // Calculate pricing based on complexity
  const basePrice = 500;
  const complexityCost = animationEffect === 'flame' || animationEffect === 'glitch' || animationEffect === 'vortex' ? 450 : 250;
  const ornamentCost = ornament === 'dragon' || ornament === 'wolf' || ornament === 'katana' || ornament === 'horns' ? 400 : 220;
  const rarityMultiplier = rarity === 'mythic' ? 1.6 : rarity === 'legendary' ? 1.4 : 1.2;
  const rawTotal = Math.round((basePrice + complexityCost + ornamentCost) * rarityMultiplier);
  const totalCoinPrice = Math.round(rawTotal / 25) * 25;

  return {
    name: themeTitle,
    description: `"${prompt}" tarifine göre AI tarafından çok katmanlı olarak tasarlandı: Üstte ${ornament.toUpperCase()}, altta ${bottomOrnament.toUpperCase()} ve ${animationEffect} animasyonlu Discord profil süslemesi.`,
    gender: frameGender,
    rarity,
    tagText: '✨ AI Özel Tasarım',
    isAnimated: true,
    frameStyle: {
      primaryColor,
      secondaryColor,
      accentColor,
      glowColor,
      borderType,
      ornament,
      bottomOrnament,
      animationEffect
    },
    pricing: {
      basePrice,
      complexityCost,
      ornamentCost,
      rarityMultiplier,
      totalCoinPrice,
      priceBreakdown: [
        { item: 'Temel AI Vektör Matrisi', cost: basePrice },
        { item: `Hareketli Efekt (${animationEffect.toUpperCase()})`, cost: complexityCost },
        { item: `Özel Karakter Çizimi (${ornament.toUpperCase()})`, cost: ornamentCost },
        { item: `${rarity.toUpperCase()} Nadirlik Çarpanı`, cost: Math.round(totalCoinPrice - (basePrice + complexityCost + ornamentCost)) }
      ],
      explanation: `İsteğindeki "${prompt}" motifleri analiz edildi. Üst ve alt aksesuar katmanları ile ${animationEffect} animasyonu hesaplanarak adil fiyat çıkarıldı.`
    }
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Custom Frame Generator Route
app.post('/api/generate-frame', async (req, res) => {
  try {
    const { prompt, gender = 'unisex', vibe = 'balanced', requestedBy = 'Kullanıcı' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Lütfen yapmak istediğiniz çerçeveyi tarif eden bir açıklama girin.' });
      return;
    }

    const ai = getGenAI();

    // If Gemini client is available, prompt Gemini 3.8 Flash for structured creative design
    if (ai) {
      try {
        const systemInstruction = `Sen Discord ve oyun profilleri için animasyonlu çok katmanlı SVG profil çerçeveleri (Avatar Decorations) üreten uzman bir yapay zeka tasarımcısısın.
Kullanıcının Türkçe olarak verdiği çerçeve isteğine göre görsel olarak zengin, estetik, uyumlu ve kullanıcının tarif ettiği karakteri, renkleri ve motifleri BİREBİR yansıtan bir profil çerçevesi tasarlayacaksın.
Ayrıca tasarımın karmaşıklığına, süslemesine ve nadirliğine göre adil bir coin fiyatı hesaplayacaksın.

Renk kodları geçerli hex (#rrggbb) olmalıdır.
borderType şunlardan biri olmalı: 'solid' | 'dashed' | 'double' | 'gradient' | 'ornamental' | 'spikes' | 'cyber' | 'runes' | 'electric' | 'floral' | 'fire_ring' | 'spider_web'.
ornament (Üst ana süsleme) şunlardan biri olmalı: 'spiderman' | 'spider' | 'venom' | 'batman' | 'ironman' | 'dragon' | 'wolf' | 'katana' | 'wings' | 'horns' | 'cat_ears' | 'crown' | 'stars' | 'butterfly' | 'flames' | 'crystals' | 'skull' | 'sakura' | 'halo' | 'ribbon' | 'rose' | 'lightning' | 'kitsune' | 'cyber' | 'hearts'.
bottomOrnament (Alt tamamlayıcı süsleme) şunlardan biri olmalı: 'spider_emblem' | 'batarang' | 'arc_reactor' | 'katana_crossed' | 'paws' | 'roses' | 'dragon_claws' | 'skull_pile' | 'ribbon' | 'flames' | 'cyber_hud' | 'diamond' | 'runes' | 'none'.
animationEffect şunlardan biri olmalı: 'pulse' | 'spin' | 'shimmer' | 'bounce' | 'wave' | 'glitch' | 'aurora' | 'flame' | 'rainbow' | 'vortex'.
gender: 'female' | 'male' | 'unisex'.
rarity: 'rare' | 'epic' | 'legendary' | 'mythic'.

ÖZEL POPÜLER TEMA EŞLEŞTİRMELERİ (BUNLARA KESİNLİKLE DİKKAT ET):
1. Spiderman / Örümcek Adam / Ağ / Spider:
   - borderType: 'spider_web'
   - ornament: 'spiderman'
   - bottomOrnament: 'spider_emblem'
   - primaryColor: '#dc2626' (Kırmızı)
   - secondaryColor: '#1d4ed8' (Mavi)
   - accentColor: '#ffffff' (Beyaz Gözler)
   - glowColor: '#ef4444'
   - animationEffect: 'pulse'
2. Venom / Siyah Simbiyot:
   - borderType: 'spider_web'
   - ornament: 'venom'
   - bottomOrnament: 'spider_emblem'
   - primaryColor: '#09090b' (Siyah)
   - secondaryColor: '#18181b'
   - accentColor: '#ffffff'
   - glowColor: '#e2e8f0'
3. Batman / Kara Şövalye / Yarasa:
   - borderType: 'spikes'
   - ornament: 'batman'
   - bottomOrnament: 'batarang'
   - primaryColor: '#0f172a' (Siyah/Arduvaz)
   - secondaryColor: '#334155'
   - accentColor: '#facc15' (Altın Sarı)
   - glowColor: '#64748b'
4. Iron Man / Demir Adam:
   - borderType: 'cyber'
   - ornament: 'ironman'
   - bottomOrnament: 'arc_reactor'
   - primaryColor: '#b91c1c' (Metalik Kırmızı)
   - secondaryColor: '#ca8a04' (Altın Zırh)
   - accentColor: '#fef08a'
   - glowColor: '#06b6d4' (Ark Reaktörü Mavisi)

Fiyatlandırma Kuralları:
- Taban Fiyat (basePrice): 400 - 600 Coin
- Karmaşıklık Masrafı (complexityCost): 200 - 500 Coin
- Süsleme Masrafı (ornamentCost): 150 - 450 Coin
- Toplam Fiyat (totalCoinPrice): 750 ile 3500 coin arasında mantıklı bir toplam olmalı.
- priceBreakdown: Kullanıcıya sunulacak 3-4 maddelik masraf dökümü.
- explanation: Fiyatın neden bu şekilde çıktığını anlatan nazik, samimi 1 cümlelik Türkçe açıklama.`;

        const geminiPrompt = `Kullanıcı isteği: "${prompt}"
Tercih edilen tema/cinsiyet: ${gender}
Hava/Vibe: ${vibe}
Tasarım Sahibi: ${requestedBy}

Lütfen JSON formatında yanıt ver:
{
  "name": "Çerçeve Başlığı (Örn: Ateşli Kurt Ruhu Çerçevesi)",
  "description": "Detaylı Türkçe açıklama",
  "gender": "female" | "male" | "unisex",
  "rarity": "rare" | "epic" | "legendary" | "mythic",
  "tagText": "AI Özel Tasarım",
  "isAnimated": true,
  "frameStyle": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "glowColor": "#hex",
    "borderType": "spikes",
    "ornament": "wolf",
    "bottomOrnament": "runes",
    "animationEffect": "aurora"
  },
  "pricing": {
    "basePrice": 500,
    "complexityCost": 350,
    "ornamentCost": 250,
    "rarityMultiplier": 1.4,
    "totalCoinPrice": 1500,
    "priceBreakdown": [
      { "item": "Temel Vektör Matrisi", "cost": 500 },
      { "item": "Işıltı & Efekt Katmanı", "cost": 350 },
      { "item": "Özel Karakter Süslemesi", "cost": 250 },
      { "item": "Nadirlik Çarpanı", "cost": 400 }
    ],
    "explanation": "..."
  }
}`;

        let response: any = null;
        const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

        for (const modelName of candidateModels) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: geminiPrompt,
              config: {
                systemInstruction,
                responseMimeType: 'application/json'
              }
            });

            if (response && response.text) {
              break;
            }
          } catch {
            // Transient 503 / high demand: try next candidate model smoothly
            await new Promise((r) => setTimeout(r, 250));
          }
        }

        if (response && response.text) {
          try {
            const rawText = response.text || '';
            const parsed = JSON.parse(rawText);

            // Sanitize and ensure fallback safety
            if (parsed && parsed.frameStyle && parsed.pricing) {
              res.json({
                success: true,
                frame: {
                  ...parsed,
                  id: `ai-custom-${Date.now()}`,
                  category: 'frames',
                  price: parsed.pricing.totalCoinPrice || 1200,
                  createdBy: requestedBy,
                  prompt
                }
              });
              return;
            }
          } catch {
            // If response parsing fails, smoothly use procedural synthesis below
          }
        }
      } catch {
        // Fall back gracefully to high-precision procedural synthesis
      }
    }

    // Procedural fallback (always succeeds with full SVG styling & pricing)
    const generated = generateProceduralFrame(prompt, gender, vibe);
    res.json({
      success: true,
      frame: {
        ...generated,
        id: `ai-custom-${Date.now()}`,
        category: 'frames',
        price: generated.pricing.totalCoinPrice,
        createdBy: requestedBy,
        prompt
      }
    });
  } catch {
    res.status(500).json({ error: 'Çerçeve üretilirken bir hata oluştu.' });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
