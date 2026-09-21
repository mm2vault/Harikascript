import React from 'react';
import {
  FileCode2,
  Gamepad2,
  Cpu,
  User,
  Sparkles,
  Crown,
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { CategoryType } from '../types';

interface SidebarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onOpenPremium: () => void;
  isPremium?: boolean;
}

const FrameIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 3H3v2M19 3h2v2M5 21H3v-2M19 21h2v-2" />
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory, onOpenPremium, isPremium = false }) => {
  const navSections: { heading: string; items: { id: CategoryType; label: string; icon: React.ReactNode; badge?: string }[] }[] = [
    {
      heading: 'İçerik & Scriptler',
      items: [
        { id: 'scripts', label: 'Roblox Scriptleri', icon: <FileCode2 className="w-4 h-4" />, badge: '90+' },
        { id: 'games', label: 'Oyunlar', icon: <Gamepad2 className="w-4 h-4" /> },
        { id: 'executors', label: 'Executor İndir', icon: <Cpu className="w-4 h-4" />, badge: 'Güncel' }
      ]
    },
    {
      heading: 'Kozmetik Mağazası',
      items: [
        { id: 'frames', label: 'Çerçeveler', icon: <FrameIcon className="w-4 h-4" />, badge: '160+' },
        { id: 'ai-studio', label: '✨ AI Çerçeve Atölyesi', icon: <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />, badge: 'YENİ' },
        { id: 'avatars', label: 'Avatarlar', icon: <User className="w-4 h-4" /> },
        { id: 'effects', label: 'Profil Efektleri', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'badges', label: 'Rozetler', icon: <Crown className="w-4 h-4" /> },
        { id: 'inventory', label: 'Envanterim', icon: <Package className="w-4 h-4" /> },
        { id: 'admin', label: 'Admin Paneli', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, badge: 'ADMIN' }
      ]
    }
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between py-6 px-4 min-h-[calc(100vh-5rem)] border-r border-white/[0.06] bg-[#090b10]">
      <div className="space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">{section.heading}</div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeCategory === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectCategory(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left relative ${isActive ? 'bg-[#15142a] text-white border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}`}
                  >
                    {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-indigo-300' : 'text-slate-400'}>{item.icon}</span>
                      <span className="tracking-wide text-xs sm:text-sm">{item.label}</span>
                    </div>
                    {item.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'}`}>{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="relative rounded-2xl p-4 overflow-hidden border border-indigo-500/30 bg-gradient-to-b from-[#16142a] via-[#100e20] to-[#0d0c18] shadow-lg">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/20 blur-2xl pointer-events-none rounded-full" />
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300 mb-3">
            <Crown className="w-4 h-4 text-amber-300 stroke-[2]" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">{isPremium ? 'Premium Aktif' : 'Premium'}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{isPremium ? 'Tüm VIP avantajlarından ve ekstra indirimlerden yararlanıyorsun.' : 'VIP scriptler ve özel Discord kozmetikleri seni bekliyor!'}</p>
          <button id="btn-sidebar-premium" onClick={onOpenPremium} className="mt-3.5 w-full py-2 px-3 rounded-xl bg-[#1d1b38] hover:bg-[#252247] border border-indigo-500/30 hover:border-indigo-400/50 text-xs font-semibold text-indigo-200 hover:text-white flex items-center justify-between transition-all group">
            <span>{isPremium ? 'Avantajları Gör' : "Premium'a Geç"}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="mt-4 px-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>Hızlı & Güvenli Script Platformu</span>
        </div>
      </div>
    </aside>
  );
};
