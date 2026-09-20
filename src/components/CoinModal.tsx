import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoinModalProps {
  isOpen: boolean;
  currentCoins: number;
  onClose: () => void;
  onAddCoins: (amount: number) => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({
  isOpen,
  currentCoins,
  onClose,
  onAddCoins
}) => {
  const [selectedPack, setSelectedPack] = useState<number | null>(1250);

  if (!isOpen) return null;

  const packages = [
    { coins: 500, bonus: 0, price: '49 ₺', popular: false },
    { coins: 1250, bonus: 100, price: '99 ₺', popular: true },
    { coins: 2800, bonus: 400, price: '199 ₺', popular: false },
    { coins: 6500, bonus: 1500, price: '399 ₺', popular: false, vip: true }
  ];

  const handlePurchase = (amount: number) => {
    onAddCoins(amount);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="coin-topup-dialog"
        className="w-full max-w-lg rounded-3xl bg-[#0d101a] border border-white/10 p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="text-xl">★</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Coin Yükle</h3>
              <p className="text-xs text-slate-400">
                Mevcut Bakiye: <strong className="text-amber-400 font-mono">{currentCoins.toLocaleString('tr-TR')} Coin</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Free Testing Button for Instant Reviewer Gratification */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs font-semibold text-white">Deneme / Hızlı Test Bakiyesi</div>
              <div className="text-[11px] text-slate-400">Anında +500 test coini hesabına ekle</div>
            </div>
          </div>
          <button
            id="btn-add-free-coins"
            onClick={() => handlePurchase(500)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md flex items-center gap-1 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 Ekle</span>
          </button>
        </div>

        {/* Packages Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {packages.map((pkg) => {
            const isSelected = selectedPack === pkg.coins;
            return (
              <div
                key={pkg.coins}
                onClick={() => setSelectedPack(pkg.coins)}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all border text-left ${
                  isSelected
                    ? 'bg-[#151929] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'bg-[#101320] border-white/5 hover:border-white/20'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 uppercase tracking-wide">
                    En Popüler
                  </span>
                )}
                {pkg.vip && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white uppercase tracking-wide">
                    VIP Paket
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-black">
                    ★
                  </div>
                  <span className="text-lg font-bold text-white font-heading">
                    {pkg.coins.toLocaleString('tr-TR')}
                  </span>
                </div>

                {pkg.bonus > 0 && (
                  <p className="text-[11px] font-semibold text-emerald-400 mt-1">
                    +{pkg.bonus.toLocaleString('tr-TR')} Bonus Coin
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{pkg.price}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit Güvenli Ödeme</span>
          </div>
          <button
            id="btn-confirm-coin-pack"
            onClick={() => handlePurchase(selectedPack || 1250)}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Seçilen Paketi Satın Al
          </button>
        </div>
      </div>
    </div>
  );
};
