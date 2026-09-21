import { Product } from '../types';

export function generateClientFrame(prompt: string, gender: 'unisex'|'female'|'male', vibe: string, creator: string): Product {
  const p = prompt.toLowerCase();
  const pick = (words:string[], value:string) => words.some(w=>p.includes(w)) ? value : null;
  let ornament = pick(['spider','örümcek'], 'spiderman') || pick(['batman','yarasa'], 'batman') || pick(['ejder','dragon','alev'], 'dragon') || pick(['kedi','cat'], 'cat_ears') || pick(['kurt','wolf'], 'wolf') || pick(['melek','angel','kanat'], 'wings') || pick(['taç','crown','kral'], 'crown') || pick(['gül','rose'], 'rose') || pick(['şimşek','yıldırım','elektrik'], 'lightning') || pick(['siber','cyber','matrix'], 'cyber') || pick(['kalp','aşk'], 'hearts') || 'stars';
  const colors: Record<string,[string,string,string,string]> = {
    spiderman:['#dc2626','#1d4ed8','#fff','#ef4444'], batman:['#0f172a','#334155','#facc15','#64748b'],
    dragon:['#ef4444','#f97316','#facc15','#dc2626'], cat_ears:['#f472b6','#fb7185','#fff','#ec4899'],
    wolf:['#38bdf8','#6366f1','#e0e7ff','#0ea5e9'], wings:['#e0e7ff','#c7d2fe','#fef08a','#818cf8'],
    crown:['#f59e0b','#b45309','#fef08a','#fbbf24'], rose:['#be123c','#881337','#fda4af','#e11d48'],
    lightning:['#06b6d4','#3b82f6','#fff','#22d3ee'], cyber:['#06b6d4','#3b82f6','#10b981','#0891b2'],
    hearts:['#ec4899','#be185d','#fff','#f472b6'], stars:['#8b5cf6','#ec4899','#fff','#a855f7']
  };
  const [primaryColor,secondaryColor,accentColor,glowColor]=colors[ornament]||colors.stars;
  const rarity = ['dragon','lightning','cyber','batman','spiderman'].includes(ornament) ? 'mythic' : 'epic';
  const price = rarity === 'mythic' ? 1500 : 1000;
  return {
    id:'ai-client-'+Date.now(), name:'AI '+(ornament.charAt(0).toUpperCase()+ornament.slice(1))+' Tasarımı',
    category:'frames', description:'GitHub Pages uyumlu yerel AI tasarım motoru ile oluşturuldu.',
    price, isAnimated:true, gender, rarity, tagText:'✨ AI Özel Tasarım', isAiGenerated:true,
    createdBy:creator, prompt, createdAt:'Az önce',
    frameType:'ai-custom', frameStyle:{primaryColor,secondaryColor,accentColor,glowColor,
      borderType: ornament==='spiderman'?'spider_web':'gradient',
      ornament, bottomOrnament: ornament==='dragon'?'dragon_claws':ornament==='spiderman'?'spider_emblem':'diamond',
      animationEffect: vibe==='cyber'?'glitch':vibe==='dark'?'flame':'shimmer'}
  };
}
