import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Download, RotateCcw, LockKeyhole, FileCode2, Gamepad2, Frame } from 'lucide-react';
import { GameItem, Product, ScriptItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { upsertSharedCatalogItem, deleteSharedCatalogItem } from '../lib/catalogSync';

const ADMIN_EMAIL = 'mm2ultimatehub@gmail.com';

interface AdminViewProps {
  scripts: ScriptItem[];
  games: GameItem[];
  products: Product[];
  onAddScript: (script: ScriptItem) => void;
  onDeleteScript: (id: string) => void;
  onAddGame: (game: GameItem) => void;
  onDeleteGame: (id: string) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onReset: () => void;
}

export const AdminView: React.FC<AdminViewProps> = (props) => {
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [supabaseRole, setSupabaseRole] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState('');
  const [tab, setTab] = useState<'scripts' | 'games' | 'products'>('scripts');
  const [form, setForm] = useState({ name:'', gameName:'', category:'custom', code:'', image:'', price:'500', link:'' });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session || !active) return;
      setAuthEmail(session.user.email || null);
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (active) setSupabaseRole(profile?.role || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthEmail(session?.user.email || null);
      if (!session) setSupabaseRole(null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const loginWithGoogle = async () => {
    if (!supabase) return;
    setAuthMessage('Google giriş penceresi açılıyor...');
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) setAuthMessage(error.message);
  };

  const isAdmin = authEmail?.trim().toLowerCase() === ADMIN_EMAIL || supabaseRole === 'admin' || (!isSupabaseConfigured && loggedIn && email.trim().toLowerCase() === ADMIN_EMAIL);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({
      scripts: props.scripts.filter(s => s.id.startsWith('admin-')),
      games: props.games.filter(g => g.id.startsWith('admin-')),
      products: props.products.filter(p => p.id.startsWith('admin-'))
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'harikascript-admin-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const add = () => {
    const id = 'admin-' + Date.now();
    if (!form.name.trim()) return;

    if (tab === 'scripts') {
      const item: ScriptItem = {
        id, name: form.name.trim(), category: 'custom',
        gameName: form.gameName || 'Özel Oyun', desc: 'Admin tarafından eklenen script.',
        features: ['Admin tarafından eklendi'], executors: ['Delta','Codex'],
        workingVotes: 0, patchedVotes: 0, code: form.code || '-- Script kodu',
        isPremium: false, isKeyless: true, coinPrice: 0, image: form.image,
        downloads: 0, views: 0, status: 'active', version: '1.0',
        userName: 'HarikaScript Admin', rating: 5, ratingCount: 0, updatedAt: new Date().toISOString()
      };
      props.onAddScript(item);
      void upsertSharedCatalogItem('script', item).catch((e) => setAuthMessage(e.message));
    } else if (tab === 'games') {
      const item: GameItem = {
        id, name: form.name.trim(), link: form.link || '#', image: form.image,
        desc: 'Admin tarafından eklenen Roblox oyunu.', developer: 'HarikaScript',
        scriptCount: 0, activePlayers: '—', genre: form.category || 'Roblox'
      };
      props.onAddGame(item);
      void upsertSharedCatalogItem('game', item).catch((e) => setAuthMessage(e.message));
    } else {
      const item: Product = {
        id, name: form.name.trim(), category: 'frames', description: 'Admin tarafından eklenen kozmetik.',
        price: Math.max(0, Number(form.price) || 0), isAnimated: false,
        previewImage: form.image, rarity: 'rare', tagText: 'ADMIN'
      };
      props.onAddProduct(item);
      void upsertSharedCatalogItem('product', item).catch((e) => setAuthMessage(e.message));
    }

    setForm({ name:'', gameName:'', category:'custom', code:'', image:'', price:'500', link:'' });
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="rounded-3xl border border-indigo-500/20 bg-[#0c0f18] p-7 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
            <LockKeyhole className="w-6 h-6 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Admin Paneli</h2>
          <p className="text-sm text-slate-400 mt-2">Ortak katalog için güvenli Supabase yöneticisiyle giriş yap.</p>
          {isSupabaseConfigured ? (
            <>
              <button onClick={loginWithGoogle} className="mt-5 w-full rounded-xl bg-white text-slate-900 px-4 py-3 text-sm font-bold hover:bg-slate-100">Google ile Yönetici Girişi</button>
              <p className="text-[11px] text-slate-500 mt-3">Giriş: {authEmail || 'yapılmadı'} · Rol: {supabaseRole || 'user'}</p>
            </>
          ) : (
            <>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')setLoggedIn(true)}} placeholder="Admin e-posta" className="mt-5 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
              <button onClick={()=>setLoggedIn(true)} className="mt-3 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-sm font-bold text-white">Yerel Yönetici Girişi</button>
              <p className="text-[11px] text-amber-300/70 mt-3">Supabase ayarlanınca bu yerel giriş kaldırılarak gerçek rol kontrolü kullanılır.</p>
            </>
          )}
          {authMessage && <p className="text-[11px] text-rose-300 mt-3">{authMessage}</p>}
        </div>
      </div>
    );
  }

  const rows = tab === 'scripts' ? props.scripts.filter(x=>x.id.startsWith('admin-')) : tab === 'games' ? props.games.filter(x=>x.id.startsWith('admin-')) : props.products.filter(x=>x.id.startsWith('admin-'));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#0c1514] to-[#10111b] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold"><ShieldCheck className="w-4 h-4"/> ADMIN AKTİF</div>
            <h2 className="text-2xl font-bold text-white font-heading mt-1">HarikaScript Yönetim Merkezi</h2>
            <p className="text-xs text-slate-400 mt-1">Supabase bağlıysa değişiklikler tüm cihazlarda ortak katalog olarak saklanır.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportData} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2"><Download className="w-4 h-4"/> Yedekle</button>
            <button onClick={props.onReset} className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Sıfırla</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {([['scripts','Scripts',FileCode2],['games','Oyunlar',Gamepad2],['products','Kozmetikler',Frame]] as const).map(([id,label,Icon])=>(
          <button key={id} onClick={()=>setTab(id)} className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap ${tab===id?'bg-indigo-600 text-white':'bg-white/5 text-slate-400'}`}><Icon className="w-4 h-4"/>{label}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0f17] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={tab==='scripts'?'Script adı':tab==='games'?'Oyun adı':'Kozmetik adı'} className="input-admin"/>
          {tab==='scripts' && <input value={form.gameName} onChange={e=>setForm({...form,gameName:e.target.value})} placeholder="Oyun adı" className="input-admin"/>}
          {tab==='products' && <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Coin fiyatı" type="number" className="input-admin"/>}
          {tab==='games' && <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Roblox oyun linki" className="input-admin"/>}
          <div className="space-y-2">
            <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Görsel URL (opsiyonel)" className="input-admin"/>
            <label className="flex items-center gap-2 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 px-3 py-2.5 text-xs text-indigo-200 cursor-pointer hover:bg-indigo-500/10 transition-colors">
              <span className="font-semibold">Galeriden görsel seç</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm(prev => ({ ...prev, image: String(reader.result || '') }));
                  reader.readAsDataURL(file);
                  e.currentTarget.value = '';
                }}
              />
            </label>
          </div>
          {tab==='scripts' && <textarea value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Loadstring / script kodu" className="input-admin md:col-span-2 min-h-28"/>}
        </div>
        <button onClick={add} className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"><Plus className="w-4 h-4"/> Ekle</button>
      </div>

      <div className="space-y-2">
        {rows.length===0 ? <div className="rounded-2xl border border-white/5 p-8 text-center text-xs text-slate-500">Henüz admin içeriği eklenmedi.</div> : rows.map((row:any)=>(
          <div key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#0b0e15] px-4 py-3">
            <div className="min-w-0"><div className="text-sm font-semibold text-white truncate">{row.name}</div><div className="text-[11px] text-slate-500 truncate">{row.id}</div></div>
            <button onClick={()=>{
              const type = tab === 'scripts' ? 'script' : tab === 'games' ? 'game' : 'product';
              tab==='scripts' ? props.onDeleteScript(row.id) : tab==='games' ? props.onDeleteGame(row.id) : props.onDeleteProduct(row.id);
              void deleteSharedCatalogItem(type, row.id).catch((e) => setAuthMessage(e.message));
            }} className="p-2 rounded-lg bg-rose-500/10 text-rose-300"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
};
