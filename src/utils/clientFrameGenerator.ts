import { Product } from '../types';

type Theme = { key:string; name:string; colors:[string,string,string,string]; ornament:string; border:NonNullable<NonNullable<Product['frameStyle']>['borderType']>; animation:NonNullable<NonNullable<Product['frameStyle']>['animationEffect']>; rarity:'rare'|'epic'|'legendary'|'mythic'; price:number };

const THEMES: Theme[] = [
  {key:'cyber',name:'Cyber Neon',colors:['#06b6d4','#7c3aed','#f0abfc','#22d3ee'],ornament:'cyber',border:'cyber',animation:'glitch',rarity:'legendary',price:1400},
  {key:'dragon',name:'Ejderha',colors:['#991b1b','#f97316','#fde047','#ef4444'],ornament:'dragon',border:'fire_ring',animation:'flame',rarity:'mythic',price:1800},
  {key:'angel',name:'Melek',colors:['#e0e7ff','#c4b5fd','#fff7ed','#818cf8'],ornament:'wings',border:'wings',animation:'aurora',rarity:'legendary',price:1600},
  {key:'rose',name:'Gül',colors:['#be123c','#ec4899','#fda4af','#fb7185'],ornament:'rose',border:'floral',animation:'shimmer',rarity:'epic',price:1100},
  {key:'wolf',name:'Buz Kurdu',colors:['#0ea5e9','#4f46e5','#e0f2fe','#38bdf8'],ornament:'wolf',border:'spikes',animation:'wave',rarity:'epic',price:1200},
  {key:'crown',name:'Kraliyet',colors:['#92400e','#f59e0b','#fef08a','#fbbf24'],ornament:'crown',border:'ornamental',animation:'shimmer',rarity:'legendary',price:1500},
  {key:'hearts',name:'Kalp',colors:['#be185d','#ec4899','#fff','#f472b6'],ornament:'hearts',border:'hearts',animation:'pulse',rarity:'epic',price:1000},
  {key:'lightning',name:'Yıldırım',colors:['#1d4ed8','#06b6d4','#fff','#22d3ee'],ornament:'lightning',border:'electric',animation:'electric',rarity:'mythic',price:1750},
  {key:'dark',name:'Karanlık Yıldız',colors:['#111827','#312e81','#a78bfa','#6366f1'],ornament:'stars',border:'runes',animation:'vortex',rarity:'legendary',price:1500},
  {key:'cat',name:'Kawaii Kedi',colors:['#f472b6','#fb7185','#fff','#ec4899'],ornament:'cat_ears',border:'hearts',animation:'bounce',rarity:'rare',price:900},
  {key:'spider',name:'Örümcek',colors:['#111827','#dc2626','#fff','#ef4444'],ornament:'spiderman',border:'spider_web',animation:'glitch',rarity:'mythic',price:1700}
];

const has=(p:string,...words:string[])=>words.some(w=>p.includes(w));
export function generateClientFrame(prompt:string, gender:'unisex'|'female'|'male', vibe:string, creator:string):Product{
  const p=prompt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let theme=THEMES.find(t=>has(p,t.key,...({
    cyber:['siber','cyber','neon','matrix','hacker'],
    dragon:['ejder','dragon','alev','ates'],
    angel:['melek','angel','kanat'],
    rose:['gul','rose','cicek'],
    wolf:['kurt','wolf','buz'],
    crown:['tac','crown','kral','kraliyet'],
    hearts:['kalp','ask','heart'],
    lightning:['simsek','yildirim','elektrik'],
    dark:['karanlik','dark','gece','mor'],
    cat:['kedi','cat','pembe'],
    spider:['orumcek','spider','spiderman']
  } as Record<string,string[]>)[t.key]||[]));
  if(!theme){
    if(vibe==='cyber') theme=THEMES.find(t=>t.key==='cyber')!;
    else if(vibe==='dark') theme=THEMES.find(t=>t.key==='dark')!;
    else if(gender==='female') theme=THEMES.find(t=>t.key==='rose')!;
    else if(gender==='male') theme=THEMES.find(t=>t.key==='lightning')!;
    else theme=THEMES.find(t=>t.key==='dark')!;
  }
  const [primaryColor,secondaryColor,accentColor,glowColor]=theme.colors;
  const suffix=gender==='female'?' Kız':gender==='male'?' Erkek':'';
  return {
    id:'ai-client-'+Date.now(), name:'AI '+theme.name+suffix+' Çerçevesi',
    category:'frames',description:'İstediğin tema, renk, süsleme ve animasyona göre oluşturulan özel tasarım.',
    price:theme.price,isAnimated:true,gender,rarity:theme.rarity,tagText:'✨ AI Özel Tasarım',isAiGenerated:true,
    createdBy:creator,prompt,createdAt:'Az önce',
    frameType:'ai-custom-'+theme.key,
    frameStyle:{primaryColor,secondaryColor,accentColor,glowColor,borderType:theme.border,ornament:theme.ornament,bottomOrnament:theme.key==='dragon'?'dragon_claws':theme.key==='spider'?'spider_emblem':'diamond',animationEffect:theme.animation}
  };
}