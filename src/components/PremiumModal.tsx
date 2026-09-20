import React from 'react';
import { X, Crown, Check, Sparkles, Zap, Shield, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  isPremium: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  isPremium,
  onClose,
  onUpgrade
}) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    onUpgrade();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  };

  const perks = [
    {
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      title: '%25 Tüm Ürünlerde İndirim',
      desc: 'Mağazadaki tüm çerçeve ve avatarlarda anında %25 indirim kazan.'
    },
    {
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      title: 'Özel Animasyonlu Efektler',
      desc: 'Sadece VIP üyelere açık parıldayan profil auraları ve çerçeve stilleri.'
    },
    {
      icon: <Gift className="w-4 h-4 text-emerald-400" />,
      title: 'Günlük +150 Coin Bonusu',
      desc: 'Her gün mağazaya girdiğinde hesabına otomatik 150 hediye coin eklenir.'
    },
    {
      icon: <Crown className="w-4 h-4 text-amber-300" />,
      title: 'Profilinde Altın VIP Rozeti',
      desc: 'Kullanıcı adının yanında ve profil kartında altın parlak taç rozeti.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="premium-membership-dialog"
        className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#16122e] via-[#100e22] to-[#090b10] border border-purple-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/25 blur-3xl pointer-events-none rounded-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Crown Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-purple-500/30 to-indigo-500/30 border border-purple-400/40 mb-3 shadow-[0_0_25px_rgba(168,85,247,0.35)]">
            <Crown className="w-8 h-8 text-amber-300 stroke-[2]" />
          </div>
          <h3 className="text-2xl font-black text-white font-heading tracking-tight">
            Neon Premium Kulübü
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Daha fazla ürün, özel avantajlar ve sınırsız profil özelleştirme gücü seni bekliyor!
          </p>
        </div>

        {/* Perks List */}
        <div className="mt-6 space-y-3 relative z-10">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                {perk.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {perk.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price & Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <span className="text-[11px] text-slate-400 block">Aylık Üyelik</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-heading">79 ₺</span>
              <span className="text-xs text-slate-500 line-through">129 ₺</span>
            </div>
          </div>

          {isPremium ? (
            <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Üyeliğin Aktif</span>
            </div>
          ) : (
            <button
              id="btn-upgrade-premium"
              onClick={handleJoin}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all active:scale-95"
            >
              Premium'a Geç
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
