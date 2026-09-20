import React from 'react';
import { X, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { Product } from '../types';
import { FrameRenderer } from './FrameRenderer';

interface PurchaseModalProps {
  product: Product | null;
  userCoins: number;
  userAvatarUrl?: string;
  onClose: () => void;
  onConfirmPurchase: (product: Product) => void;
  onOpenCoinTopup: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  product,
  userCoins,
  userAvatarUrl,
  onClose,
  onConfirmPurchase,
  onOpenCoinTopup
}) => {
  if (!product) return null;

  const canAfford = userCoins >= product.price;
  const remainingCoins = userCoins - product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="purchase-confirm-dialog"
        className="w-full max-w-md rounded-3xl bg-[#0c0f18] border border-white/10 p-6 shadow-2xl relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Visual */}
        <div className="my-3 flex items-center justify-center">
          {product.category === 'frames' || product.frameType ? (
            <FrameRenderer
              frameType={product.frameType}
              avatarUrl={userAvatarUrl}
              size="lg"
              isAnimated={product.isAnimated}
            />
          ) : product.previewImage ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500 shadow-xl">
              <img src={product.previewImage} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-4xl">
              ✨
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold text-white font-heading mt-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {product.description}
        </p>

        {/* Cost Summary Box */}
        <div className="mt-5 p-4 rounded-2xl bg-[#121624] border border-white/5 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Ürün Fiyatı:</span>
            <div className="flex items-center gap-1.5 font-bold text-white font-mono text-sm">
              <span className="text-amber-400">★</span>
              <span>{product.price.toLocaleString('tr-TR')} Coin</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Mevcut Bakiyeniz:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-300 font-mono">
              <span>{userCoins.toLocaleString('tr-TR')} Coin</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Kalan Bakiye:</span>
            <div className={`flex items-center gap-1.5 font-bold font-mono text-sm ${canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{remainingCoins.toLocaleString('tr-TR')} Coin</span>
            </div>
          </div>
        </div>

        {/* Warning if insufficient balance */}
        {!canAfford && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Yetersiz bakiye! Satın almak için coin yüklemelisiniz.</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-colors"
          >
            Vazgeç
          </button>

          {canAfford ? (
            <button
              id="btn-confirm-purchase"
              onClick={() => onConfirmPurchase(product)}
              className="flex-1 py-3 rounded-2xl bg-[#3b5bf5] hover:bg-[#2f4ee8] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Satın Al</span>
            </button>
          ) : (
            <button
              id="btn-modal-topup"
              onClick={() => {
                onClose();
                onOpenCoinTopup();
              }}
              className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              Coin Yükle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
