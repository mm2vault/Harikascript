import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  Sparkles,
  Crown,
  Image as ImageIcon,
  RotateCcw,
  Package,
  Heart,
  Zap,
  Shield,
  Coins,
  Palette
} from 'lucide-react';
import { UserState, Product } from '../types';
import { FrameRenderer } from './FrameRenderer';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserState;
  allProducts: Product[];
  onClose: () => void;
  onEquipFrame: (frameId: string | null) => void;
  onUpdateAvatar: (url: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  allProducts,
  onClose,
  onEquipFrame,
  onUpdateAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'preview' | 'avatar-pick'>('wardrobe');
  const [wardrobeFilter, setWardrobeFilter] = useState<'all' | 'female' | 'male' | 'other'>('all');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Find currently equipped frame
  const equippedFrame = allProducts.find(
    (p) => p.id === user.equippedFrameId || p.frameType === user.equippedFrameId
  );

  // All owned items
  const ownedProducts = allProducts.filter((p) =>
    user.ownedProductIds.includes(p.id)
  );

  // Owned frames
  const ownedFrames = ownedProducts.filter((p) => p.category === 'frames');
  const ownedGirlFrames = ownedFrames.filter((f) => f.gender === 'female');
  const ownedBoyFrames = ownedFrames.filter((f) => f.gender === 'male');
  const ownedOtherCosmetics = ownedProducts.filter((p) => p.category !== 'frames');

  // Filtered frames for the wardrobe
  const displayedFrames =
    wardrobeFilter === 'all'
      ? ownedFrames
      : wardrobeFilter === 'female'
      ? ownedGirlFrames
      : wardrobeFilter === 'male'
      ? ownedBoyFrames
      : [];

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="profile-customizer-dialog"
        className="w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Profil & Satın Alınanlar Dolabı
              </h3>
              <p className="text-[11px] text-slate-400">
                Aldığın tüm çerçeveleri burada görebilir ve tek tıkla kuşanabilirsin.
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

        {/* Live Profile Header Banner */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141828] via-[#101422] to-[#18122c] border border-white/10 relative overflow-hidden shrink-0 shadow-lg">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            {/* Live Profile Frame Display */}
            <div className="relative shrink-0">
              <FrameRenderer
                frameType={equippedFrame?.frameType || user.equippedFrameId}
                frameStyle={
                  equippedFrame?.frameStyle ||
                  (equippedFrame?.previewImage
                    ? {
                        primaryColor: '#6366f1',
                        secondaryColor: '#a855f7',
                        glowColor: 'rgba(99,102,241,0.75)',
                        frameImage: equippedFrame.previewImage
                      }
                    : undefined)
                }
                avatarUrl={user.avatarUrl}
                size="md"
                isAnimated={animationsEnabled}
              />
              {user.isPremium && (
                <span
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-amber-950 shadow-lg border-2 border-[#0a0c13]"
                  title="VIP Premium Üye"
                >
                  <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              )}
            </div>

            {/* User Details & Stats */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-lg sm:text-xl font-bold text-white font-heading">
                  {user.name}
                </span>
                <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {user.tag}
                </span>
                {equippedFrame?.gender === 'female' && (
                  <span className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 fill-pink-400" /> Kız Teması
                  </span>
                )}
                {equippedFrame?.gender === 'male' && (
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-cyan-400" /> Erkek Teması
                  </span>
                )}
              </div>

              <div className="text-xs text-indigo-200/90 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kuşanılan Çerçeve: </span>
                <strong className="text-white">
                  {equippedFrame ? equippedFrame.name : 'Standart (Çerçevesiz)'}
                </strong>
              </div>

              {/* Badges / Quick Stats Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.coins.toLocaleString('tr-TR')} Coin</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{ownedFrames.length} Sahip Olunan Çerçeve</span>
                </div>
                {user.equippedFrameId && (
                  <button
                    onClick={() => onEquipFrame(null)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 ml-auto"
                    title="Çerçeveyi Çıkar"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Çıkar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-white/10 pb-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'wardrobe'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Satın Aldıklarım ({ownedProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('avatar-pick')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'avatar-pick'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Avatar Seçimi</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Ayarlar</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1">
          {/* TAB 1: SATIN ALINANLAR (WARDROBE) */}
          {activeTab === 'wardrobe' && (
            <div>
              {/* Filter Pills for Wardrobe */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setWardrobeFilter('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    wardrobeFilter === 'all'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tüm Çerçeveler ({ownedFrames.length})
                </button>
                <button
                  onClick={() => setWardrobeFilter('female')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                    wardrobeFilter === 'female'
                      ? 'bg-pink-500/30 text-pink-200 border border-pink-500/40 font-semibold'
                      : 'bg-white/5 text-slate-400 hover:text-pink-300'
                  }`}
                >
                  <Heart className="w-2.5 h-2.5 text-pink-400" />
                  Kız ({ownedGirlFrames.length})
                </button>
                <button
                  onClick={() => setWardrobeFilter('male')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                    wardrobeFilter === 'male'
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-semibold'
                      : 'bg-white/5 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Zap className="w-2.5 h-2.5 text-cyan-400" />
                  Erkek ({ownedBoyFrames.length})
                </button>
                {ownedOtherCosmetics.length > 0 && (
                  <button
                    onClick={() => setWardrobeFilter('other')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      wardrobeFilter === 'other'
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold'
                        : 'bg-white/5 text-slate-400 hover:text-amber-300'
                    }`}
                  >
                    Diğer ({ownedOtherCosmetics.length})
                  </button>
                )}
              </div>

              {/* Items Grid */}
              {wardrobeFilter === 'other' ? (
                // Other cosmetics
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ownedOtherCosmetics.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3"
                    >
                      {item.previewImage && (
                        <img
                          src={item.previewImage}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedFrames.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-300">
                    Bu kategoride henüz satın aldığın çerçeve yok.
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Mağazadaki 150+ yeni kız ve erkek çerçevelerinden istediğini alabilirsin!
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayedFrames.map((frame) => {
                    const isEquipped =
                      user.equippedFrameId === frame.id ||
                      user.equippedFrameId === frame.frameType;
                    return (
                      <div
                        key={frame.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center relative group ${
                          isEquipped
                            ? 'bg-gradient-to-b from-indigo-950/40 to-[#0e1220] border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Live Frame Miniature */}
                        <div className="my-1">
                          <FrameRenderer
                            frameType={frame.frameType || frame.id}
                            frameStyle={frame.frameStyle}
                            avatarUrl={user.avatarUrl}
                            size="sm"
                            isAnimated={animationsEnabled}
                          />
                        </div>

                        <div className="w-full mt-2">
                          <div className="text-xs font-bold text-white truncate" title={frame.name}>
                            {frame.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {frame.tagText || (frame.gender === 'female' ? '🌸 Kız Çerçevesi' : '⚡ Erkek Çerçevesi')}
                          </div>
                        </div>

                        {/* Equip / Unequip Action Button */}
                        <button
                          onClick={() => onEquipFrame(isEquipped ? null : frame.id)}
                          className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            isEquipped
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-white/10 hover:bg-indigo-600/80 text-slate-200 hover:text-white'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Kullanımda</span>
                            </>
                          ) : (
                            <span>Kuşan</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AVATAR SEÇİMİ */}
          {activeTab === 'avatar-pick' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Hazır Profil Avatarları
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => onUpdateAvatar(url)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                        user.avatarUrl === url ? 'border-indigo-500 scale-105 ring-2 ring-indigo-500/50' : 'border-white/10'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Kendi Resmini Yükle
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all hover:border-indigo-500/50"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Bilgisayarından veya Telefonundan Resim Seç</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AYARLAR */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div>
                  <div className="text-xs font-semibold text-white">Çerçeve Animasyonları</div>
                  <div className="text-[11px] text-slate-400">
                    Düşük performanslı cihazlarda pil tasarrufu için animasyonları durdurabilirsin.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[#131622] border-white/10"
                />
              </div>

              {user.equippedFrameId && (
                <button
                  onClick={() => onEquipFrame(null)}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Çerçeveyi Çıkar (Varsayılana Dön)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
