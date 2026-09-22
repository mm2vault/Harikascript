import React from 'react';
import { ShoppingCart, Check, Play, Eye } from 'lucide-react';
import { Product } from '../types';
import { FrameRenderer } from './FrameRenderer';

interface ProductCardProps {
  product: Product;
  isOwned: boolean;
  isEquipped: boolean;
  userCoins: number;
  userAvatarUrl?: string;
  onBuy: (product: Product) => void;
  onEquip: (product: Product) => void;
  onPreview: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isOwned,
  isEquipped,
  userCoins,
  userAvatarUrl,
  onBuy,
  onEquip,
  onPreview
}) => {
  const canAfford = userCoins >= product.price;

  return (
    <div
      id={`card-${product.id}`}
      className="group relative rounded-2xl bg-[#0b0e16]/95 border border-white/[0.08] hover:border-indigo-500/40 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Top Bar inside card: Animated Badge or Rarity */}
      <div className="flex items-center justify-between z-10 w-full mb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.isAiGenerated && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30">
              ✨ AI {product.createdBy ? `@${product.createdBy}` : 'Özel'}
            </span>
          )}
          {product.gender === 'female' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
              🌸 Kız
            </span>
          )}
          {product.gender === 'male' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              ⚡ Erkek
            </span>
          )}
          {product.isPopular && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Popüler
            </span>
          )}
        </div>

        {product.isAnimated && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111628] border border-indigo-400/30 shadow-sm">
            <Play className="w-2.5 h-2.5 fill-white text-white" />
            <span className="text-[10px] font-medium text-slate-200 tracking-wide">
              Animasyonlu
            </span>
          </div>
        )}
      </div>

      {/* Center Visual: Frame or Avatar Preview with Interactive Hover Try-On */}
      <div className="relative my-3 flex items-center justify-center min-h-[185px]">
        {product.category === 'frames' || product.frameType || product.frameStyle ? (
          <FrameRenderer
            frameType={product.frameType || product.id}
            frameStyle={product.frameStyle}
            avatarUrl={userAvatarUrl}
            size="sm"
            isAnimated={product.isAnimated}
          />
        ) : product.category === 'avatars' && product.previewImage ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-lg group-hover:scale-105 transition-transform">
            <img
              src={product.previewImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <span className="text-3xl">✨</span>
          </div>
        )}

        {/* Quick Preview overlay on hover */}
        <button
          onClick={() => onPreview(product)}
          className="absolute bottom-1 px-3 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg z-30"
          title="Profilinde Canlı Dene"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>Canlı Dene</span>
        </button>
      </div>

      {/* Content Info */}
      <div className="mt-1">
        <h3 className="text-base font-bold text-white tracking-tight font-heading group-hover:text-indigo-200 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 min-h-[36px] line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price Section */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
          <span className="text-[11px] font-black text-amber-950 leading-none">★</span>
        </div>
        <span className="text-base font-bold text-white tracking-tight font-heading">
          {product.price.toLocaleString('tr-TR')}
        </span>
      </div>

      {/* Action Button: Matches exact screenshot blue pill button */}
      <div className="mt-3">
        {isEquipped ? (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-default"
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>Kullanımda</span>
          </button>
        ) : isOwned ? (
          <button
            id={`btn-equip-${product.id}`}
            onClick={() => onEquip(product)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1e2746] hover:bg-[#28355f] border border-indigo-400/40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            <Check className="w-4 h-4 text-indigo-300 stroke-[2]" />
            <span>Kuşan</span>
          </button>
        ) : (
          <button
            id={`btn-buy-${product.id}`}
            onClick={() => onBuy(product)}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${
              canAfford
                ? 'bg-[#3b5bf5] hover:bg-[#2f4ee8] text-white hover:shadow-[0_0_24px_rgba(59,91,245,0.45)]'
                : 'bg-[#181d2c] text-slate-400 border border-white/10 hover:border-amber-500/40'
            }`}
          >
            <ShoppingCart className="w-4 h-4 stroke-[2]" />
            <span>Satın Al</span>
          </button>
        )}
      </div>
    </div>
  );
};
