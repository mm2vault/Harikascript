import React, { useState, useRef } from 'react';
import { X, Upload, Check, Sparkles, Crown, Image as ImageIcon, RotateCcw, Package } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'preview' | 'frames' | 'avatar-pick'>('preview');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Find currently equipped frame
  const equippedFrame = allProducts.find((p) => p.id === user.equippedFrameId);
  // Owned frames
  const ownedFrames = allProducts.filter(
    (p) => p.category === 'frames' && user.ownedProductIds.includes(p.id)
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="profile-customizer-dialog"
        className="w-full max-w-xl rounded-3xl bg-[#0d101a] border border-white/10 p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              Profil & Avatar Özelleştirici
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Live Stage Preview */}
        <div className="mt-5 p-6 rounded-3xl bg-gradient-to-b from-[#141828] to-[#0a0c13] border border-white/5 flex flex-col items-center justify-center relative shadow-inner">
          <div className="relative mb-3">
            <FrameRenderer
              frameType={equippedFrame?.frameType}
              avatarUrl={user.avatarUrl}
              size="lg"
              isAnimated={animationsEnabled}
            />

            {user.isPremium && (
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-amber-950 shadow-lg border-2 border-[#0a0c13]">
                <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-white font-heading">{user.name}</span>
              <span className="text-xs text-slate-500 font-mono">{user.tag}</span>
            </div>
            <div className="text-xs text-indigo-300 font-medium mt-0.5">
              {equippedFrame ? equippedFrame.name : 'Standart Profil Çerçevesi'}
            </div>
          </div>
        </div>

        {/* Tabs: Önizleme / Çerçevelerim / Avatar Seç */}
        <div className="flex gap-2 mt-4 border-b border-white/5 pb-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Genel Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('frames')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'frames'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Çerçevelerim ({ownedFrames.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('avatar-pick')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'avatar-pick'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Avatar Değiştir</span>
          </button>
        </div>

        {/* Tab 1: Preview Settings */}
        {activeTab === 'preview' && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div>
                <div className="text-xs font-semibold text-white">Animasyonları Göster</div>
                <div className="text-[11px] text-slate-400">
                  Düşük performanslı cihazlarda animasyonları kapatabilirsin.
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
                className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Çerçeveyi Çıkar (Varsayılana Dön)</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Owned Frames Quick Equip */}
        {activeTab === 'frames' && (
          <div className="mt-4">
            {ownedFrames.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Henüz satın aldığın bir çerçeve yok. Mağazadan hemen alabilirsin!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {ownedFrames.map((frame) => {
                  const isEquipped = user.equippedFrameId === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => onEquipFrame(isEquipped ? null : frame.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <div className="truncate text-xs font-semibold">{frame.name}</div>
                      {isEquipped && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Avatar Presets or Upload */}
        {activeTab === 'avatar-pick' && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-6 gap-2">
              {presetAvatars.map((url, i) => (
                <button
                  key={i}
                  onClick={() => onUpdateAvatar(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                    user.avatarUrl === url ? 'border-indigo-500 scale-105' : 'border-white/10'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Kendi Resmini / GIF Yükle</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
