import React from 'react';
import { ShoppingBag, Plus, Bell, Sparkles } from 'lucide-react';
import { UserState, FrameStyleConfig } from '../types';
import { FrameRenderer } from './FrameRenderer';

interface NavbarProps {
  user: UserState;
  onOpenCoinsModal: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAiStudio?: () => void;
  hasUnreadNotifications?: boolean;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  equippedFrameStyle?: FrameStyleConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenCoinsModal,
  onOpenNotifications,
  onOpenProfile,
  onOpenAiStudio,
  hasUnreadNotifications = true,
  isAuthenticated = false,
  onOpenAuth,
  onSignOut,
  equippedFrameStyle
}) => {
  // Format coin balance with dot separator like in the screenshot (e.g. 1.250)
  const formatCoins = (amount: number) => {
    return amount.toLocaleString('tr-TR');
  };

  return (
    <header className="w-full h-[72px] border-b border-white/[0.07] bg-[#090b10]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand / Market Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#131622] border border-white/10 flex items-center justify-center text-white shadow-inner">
          <ShoppingBag className="w-5 h-5 text-slate-200 stroke-[1.8]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight font-heading">Market</h1>
            {user.isPremium && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30">
                VIP
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Coinlerinle özel ürünler satın al!</p>
        </div>
      </div>

      {/* Right Controls: Coin Counter, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Coin Balance Pill */}
        <div className="flex items-center bg-[#131622] border border-white/10 rounded-full pl-2.5 pr-1 py-1 gap-2 shadow-sm hover:border-amber-500/40 transition-colors">
          {/* Gold Coin Icon */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            <span className="text-[11px] font-black text-amber-950 leading-none">★</span>
          </div>

          <span className="text-sm sm:text-base font-bold text-white tracking-wide font-mono">
            {formatCoins(user.coins)}
          </span>

          {/* Plus / Top-up button */}
          <button
            id="btn-coin-topup"
            onClick={onOpenCoinsModal}
            title="Coin Yükle"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* AI Frame Studio Quick-Access Button */}
        {onOpenAiStudio && (
          <button
            id="btn-navbar-ai-studio"
            onClick={onOpenAiStudio}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 hover:from-indigo-600/50 hover:to-pink-600/50 border border-indigo-400/40 text-white text-xs font-bold transition-all shadow-sm active:scale-95 group"
            title="AI ile Özel Çerçeve Üret"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent">
              ✨ AI Çerçeve Yap
            </span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          id="btn-notifications"
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-full bg-[#131622] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="Bildirimler"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#090b10] shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
          )}
        </button>

          {!isAuthenticated && onOpenAuth && (
          <button onClick={onOpenAuth} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-bold">
            Giriş Yap
          </button>
        )}
        {isAuthenticated && onSignOut && (
          <button onClick={onSignOut} className="text-[10px] text-slate-500 hover:text-white">
            Çıkış
          </button>
        )}

      {/* Profile Avatar Button with Live Equipped Frame */}
        <button
          id="btn-profile"
          onClick={onOpenProfile}
          className="relative flex items-center justify-center p-0.5 rounded-full hover:scale-105 active:scale-95 transition-all group"
          title={`${user.name} - Profilim & Envanter`}
        >
          <div className="relative">
            <FrameRenderer
              frameType={user.equippedFrameId || 'none'}
              frameStyle={equippedFrameStyle}
              avatarUrl={user.avatarUrl}
              size="xs"
              isAnimated={true}
            />
          </div>
        </button>
      </div>
    </header>
  );
};
