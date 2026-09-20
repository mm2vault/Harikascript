import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  FileCode,
  Flame,
  Zap,
  Gamepad2,
  Package,
  Layers
} from 'lucide-react';
import {
  CategoryType,
  Product,
  ScriptItem,
  GameItem,
  ExecutorItem,
  DailyTask,
  UserState,
  ToastMessage
} from './types';
import { INITIAL_PRODUCTS } from './data/products';
import {
  SCRIPTS_DATA,
  GAMES_DATA,
  EXECUTORS_DATA,
  INITIAL_DAILY_TASKS
} from './data/scriptDepoData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProductCard } from './components/ProductCard';
import { ScriptCard } from './components/ScriptCard';
import { ScriptDetailModal } from './components/ScriptDetailModal';
import { GamesView } from './components/GamesView';
import { ExecutorsView } from './components/ExecutorsView';
import { DailyTasksWidget } from './components/DailyTasksWidget';
import { Toast } from './components/Toast';
import { CoinModal } from './components/CoinModal';
import { PurchaseModal } from './components/PurchaseModal';
import { PremiumModal } from './components/PremiumModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import confetti from 'canvas-confetti';

// Custom Ornamental Frame Icon matching screenshot header
const SectionFrameIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 3H3v2M19 3h2v2M5 21H3v-2M19 21h2v-2" />
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function App() {
  // Category headers and subtitles
  const categoryHeaders: Record<CategoryType, { title: string; subtitle: string }> = {
    all: {
      title: 'Tüm Ürünler & Scriptler',
      subtitle: 'En popüler çerçeveler, avatarlar ve Roblox scriptleri bir arada!'
    },
    scripts: {
      title: 'Roblox Scriptleri',
      subtitle: 'Blox Fruits, MM2, Blade Ball, Fisch ve daha fazlası için güncel loadstring kodları.'
    },
    games: {
      title: 'Popüler Roblox Oyunları',
      subtitle: 'En çok oynanan ve zengin script kütüphanesine sahip oyunlar.'
    },
    executors: {
      title: 'Güvenli Executor İndir',
      subtitle: 'PC ve Mobil (Android) için test edilmiş çalışan Roblox executorları.'
    },
    frames: {
      title: 'Discord & Neon Çerçeveler',
      subtitle: 'Profilini Discord Nitro tarzı parlayan çerçevelerle özelleştir!'
    },
    avatars: {
      title: 'Avatarlar',
      subtitle: 'Tarzını yansıtan eşsiz karakter ve vizör tasarımları.'
    },
    effects: {
      title: 'Profil Efektleri',
      subtitle: 'Profilinde dinamik ışık patlamaları, hologram ve kar fırtınası.'
    },
    badges: {
      title: 'Rozetler & Nişanlar',
      subtitle: 'Toplulukta ayrıcalığını ve statünü gösteren nişanlar.'
    },
    inventory: {
      title: 'Kişisel Envanterim',
      subtitle: 'Satın aldığın ve açtığın tüm kozmetikler ile özel VIP scriptlerin.'
    }
  };

  // User state
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('neon_market_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: 'Eleddin',
      tag: '#2026',
      avatarUrl: '',
      coins: 1450, // generous starting balance
      isPremium: false,
      ownedProductIds: ['frame-siyah'], // starter frame
      unlockedScriptIds: ['bf_hoho', 'mm2_eclipse', 'bb_redz', 'fisch_speedhub'],
      equippedFrameId: 'frame-siyah',
      equippedAvatarId: null,
      equippedEffectId: null,
      equippedBadgeId: null,
      completedTasks: [],
      claimedDailyStreak: 1,
      lastDailyClaim: null
    };
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neon_market_user_v2', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Tasks state
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem('neon_market_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DAILY_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('neon_market_tasks_v2', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Active view tab & filters
  const [activeCategory, setActiveCategory] = useState<CategoryType>('frames');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [scriptGameFilter, setScriptGameFilter] = useState<string>('all');

  // Modals state
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [purchasingProduct, setPurchasingProduct] = useState<Product | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>({
    id: 'initial-toast',
    title: 'ScriptDepo & Kozmetikler Entegre Edildi!',
    description: 'Yeni Discord çerçeveleri ve Roblox scriptleri yüklendi.',
    type: 'success'
  });

  const showToast = (title: string, description: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: Math.random().toString(),
      title,
      description,
      type
    });
  };

  // Complete a task helper
  const triggerTaskProgress = (action: DailyTask['actionType']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.actionType === action && !t.isCompleted) {
          const next = Math.min(t.target, t.progress + 1);
          return {
            ...t,
            progress: next,
            isCompleted: next >= t.target
          };
        }
        return t;
      })
    );
  };

  // Claim single task
  const handleClaimTask = (task: DailyTask) => {
    if (task.isClaimed || !task.isCompleted) return;
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + task.reward
    }));
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isClaimed: true } : t))
    );
    showToast(`+${task.reward} Coin Kazandın!`, `"${task.title}" görevi tamamlandı.`);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  };

  // Claim all completed tasks
  const handleClaimAllTasks = () => {
    const claimable = tasks.filter((t) => t.isCompleted && !t.isClaimed);
    if (claimable.length === 0) return;
    const totalReward = claimable.reduce((acc, t) => acc + t.reward, 0);
    setUser((prev) => ({ ...prev, coins: prev.coins + totalReward }));
    setTasks((prev) => prev.map((t) => (t.isCompleted ? { ...t, isClaimed: true } : t)));
    showToast(`Tümü Toplandı!`, `+${totalReward} Coin hesabına eklendi.`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // Equip frame
  const handleEquipFrame = (frameId: string | null) => {
    setUser((prev) => ({
      ...prev,
      equippedFrameId: frameId
    }));
    triggerTaskProgress('equip_cosmetic');
    showToast(
      frameId ? 'Çerçeve Kuşanıldı!' : 'Varsayılan Profil',
      frameId ? 'Profiline başarıyla uygulandı.' : 'Çerçeven çıkarıldı.'
    );
  };

  // Update avatar
  const handleUpdateAvatar = (url: string) => {
    setUser((prev) => ({ ...prev, avatarUrl: url }));
    showToast('Avatar Güncellendi', 'Yeni görsel profilinde görüntülenecek.');
  };

  // Filtered Products (Frames, Avatars, Effects, Badges)
  const filteredProducts = useMemo(() => {
    let list = INITIAL_PRODUCTS;

    if (activeCategory === 'inventory') {
      list = list.filter((p) => user.ownedProductIds.includes(p.id));
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tagText && p.tagText.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeCategory, searchQuery, sortBy, user.ownedProductIds]);

  // Filtered Scripts
  const filteredScripts = useMemo(() => {
    let list = SCRIPTS_DATA;

    if (activeCategory === 'inventory') {
      list = list.filter((s) => user.unlockedScriptIds.includes(s.id));
    }

    if (scriptGameFilter !== 'all') {
      list = list.filter((s) => s.category === scriptGameFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.gameName.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCategory, scriptGameFilter, searchQuery, user.unlockedScriptIds]);

  // Buy cosmetic
  const handleConfirmPurchase = (product: Product) => {
    if (user.coins < product.price) {
      showToast('Yetersiz Bakiye!', 'Daha fazla coine ihtiyacın var.', 'warning');
      setIsCoinModalOpen(true);
      return;
    }

    setUser((prev) => ({
      ...prev,
      coins: prev.coins - product.price,
      ownedProductIds: [...prev.ownedProductIds, product.id],
      equippedFrameId:
        product.category === 'frames' ? product.id : prev.equippedFrameId
    }));

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    showToast(
      'Satın Alındı & Kuşanıldı!',
      `${product.name} envanterine eklendi ve profiline uygulandı!`
    );
    setPurchasingProduct(null);
    triggerTaskProgress('equip_cosmetic');
  };

  // Unlock VIP Script
  const handleUnlockScript = (script: ScriptItem) => {
    if (user.unlockedScriptIds.includes(script.id) || script.coinPrice === 0) {
      setSelectedScript(script);
      return;
    }

    if (user.coins < script.coinPrice) {
      showToast('Yetersiz Coin!', `Bu scripti açmak için ${script.coinPrice} coin gerekiyor.`, 'warning');
      setIsCoinModalOpen(true);
      return;
    }

    setUser((prev) => ({
      ...prev,
      coins: prev.coins - script.coinPrice,
      unlockedScriptIds: [...prev.unlockedScriptIds, script.id]
    }));

    showToast('Script Kilidi Açıldı!', `"${script.name}" artık sınırsız kullanımına açık.`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setSelectedScript(script);
  };

  // Quick copy script
  const handleQuickCopyScript = (script: ScriptItem) => {
    triggerTaskProgress('copy_script');
    showToast('Kopyalandı!', `"${script.name}" panoya kopyalandı.`);
  };

  // Select game -> filter scripts
  const handleSelectGame = (gameId: string) => {
    setScriptGameFilter(gameId);
    setActiveCategory('scripts');
    triggerTaskProgress('view_item');
  };

  // Determine which layout to show
  const isCosmeticsCategory = [
    'frames',
    'avatars',
    'effects',
    'badges'
  ].includes(activeCategory);

  const isScriptsCategory = activeCategory === 'scripts';
  const isGamesCategory = activeCategory === 'games';
  const isExecutorsCategory = activeCategory === 'executors';
  const isInventoryCategory = activeCategory === 'inventory';

  return (
    <div className="min-h-screen bg-[#070810] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navigation */}
      <Navbar
        user={user}
        onOpenCoinsModal={() => setIsCoinModalOpen(true)}
        onOpenNotifications={() => {
          setIsNotificationsModalOpen(true);
          setHasUnreadNotifications(false);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (cat !== 'scripts') setScriptGameFilter('all');
          }}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          isPremium={user.isPremium}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {/* Daily Tasks Banner */}
          <DailyTasksWidget
            tasks={tasks}
            onClaimTask={handleClaimTask}
            onClaimAll={handleClaimAllTasks}
          />

          {/* Page Heading & Search Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-lg shadow-indigo-500/5">
                <SectionFrameIcon className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading flex items-center gap-2">
                  <span>{categoryHeaders[activeCategory]?.title || 'Mağaza'}</span>
                  {activeCategory === 'frames' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Discord Nitro Tarzı
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  {categoryHeaders[activeCategory]?.subtitle}
                </p>
              </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isScriptsCategory
                      ? 'Script veya oyun ara...'
                      : 'Kozmetik ara...'
                  }
                  className="w-full bg-[#121522] border border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Sort Filter for Products */}
              {isCosmeticsCategory && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121522] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none hover:border-white/20 transition-colors"
                >
                  <option value="default">Varsayılan Sıralama</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                </select>
              )}

              {/* Game Filter for Scripts */}
              {isScriptsCategory && (
                <select
                  value={scriptGameFilter}
                  onChange={(e) => setScriptGameFilter(e.target.value)}
                  className="bg-[#121522] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none hover:border-white/20 transition-colors"
                >
                  <option value="all">Tüm Oyunlar</option>
                  <option value="bloxfruits">Blox Fruits</option>
                  <option value="mm2">Murder Mystery 2</option>
                  <option value="bladeball">Blade Ball</option>
                  <option value="fisch">Fisch</option>
                  <option value="rivals">Rivals</option>
                  <option value="doors">Doors</option>
                  <option value="dahood">Da Hood</option>
                  <option value="brookhaven">Brookhaven RP</option>
                  <option value="bedwars">BedWars</option>
                  <option value="slapbattles">Slap Battles</option>
                </select>
              )}
            </div>
          </div>

          {/* VIEW ROUTING */}

          {/* 1. SCRIPTS VIEW */}
          {isScriptsCategory && (
            <div className="space-y-4">
              {filteredScripts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-white/5 bg-[#0b0e16]">
                  <p className="text-sm font-semibold text-slate-300">Aradığınız kriterde script bulunamadı.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setScriptGameFilter('all');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition-colors"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredScripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      isUnlocked={user.unlockedScriptIds.includes(script.id)}
                      userCoins={user.coins}
                      onOpenScript={(s) => setSelectedScript(s)}
                      onQuickCopy={handleQuickCopyScript}
                      onUnlockWithCoins={handleUnlockScript}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. GAMES VIEW */}
          {isGamesCategory && (
            <GamesView
              games={GAMES_DATA}
              onSelectGame={handleSelectGame}
            />
          )}

          {/* 3. EXECUTORS VIEW */}
          {isExecutorsCategory && (
            <ExecutorsView executors={EXECUTORS_DATA} />
          )}

          {/* 4. COSMETICS (Frames, Avatars, Effects, Badges) */}
          {isCosmeticsCategory && (
            <div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-white/5 bg-[#0b0e16]">
                  <p className="text-sm font-semibold text-slate-300">Aramanıza uygun ürün bulunamadı.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition-colors"
                  >
                    Aramayı Temizle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map((product) => {
                    const isOwned = user.ownedProductIds.includes(product.id);
                    const isEquipped =
                      user.equippedFrameId === product.id ||
                      user.equippedAvatarId === product.id ||
                      user.equippedEffectId === product.id ||
                      user.equippedBadgeId === product.id;

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isOwned={isOwned}
                        isEquipped={isEquipped}
                        userCoins={user.coins}
                        userAvatarUrl={user.avatarUrl}
                        onBuy={(prod) => setPurchasingProduct(prod)}
                        onEquip={(prod) => {
                          if (prod.category === 'frames') {
                            handleEquipFrame(isEquipped ? null : prod.id);
                          } else {
                            showToast('Kullanıldı!', `${prod.name} profiline uygulandı.`);
                          }
                        }}
                        onPreview={(prod) => {
                          if (prod.category === 'frames') {
                            handleEquipFrame(prod.id);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. INVENTORY VIEW */}
          {isInventoryCategory && (
            <div className="space-y-8">
              {/* Owned Cosmetics Section */}
              <div>
                <h3 className="text-base font-bold text-white font-heading mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span>Satın Alınan Kozmetikler ({user.ownedProductIds.length})</span>
                </h3>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 rounded-2xl bg-[#0b0e16] border border-white/5 text-xs text-slate-400">
                    Henüz satın alınmış bir kozmetik yok. Çerçeveler sekmesinden dilediğini seçebilirsin!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isOwned={true}
                        isEquipped={user.equippedFrameId === product.id}
                        userCoins={user.coins}
                        userAvatarUrl={user.avatarUrl}
                        onBuy={() => {}}
                        onEquip={(prod) => handleEquipFrame(user.equippedFrameId === prod.id ? null : prod.id)}
                        onPreview={(prod) => handleEquipFrame(prod.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Unlocked Scripts Section */}
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-base font-bold text-white font-heading mb-4 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Açık Script Kütüphanem ({user.unlockedScriptIds.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredScripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      isUnlocked={true}
                      userCoins={user.coins}
                      onOpenScript={(s) => setSelectedScript(s)}
                      onQuickCopy={handleQuickCopyScript}
                      onUnlockWithCoins={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Script Detail Modal with Syntax Highlighting & Lua Download */}
      <ScriptDetailModal
        script={selectedScript}
        isOpen={!!selectedScript}
        isUnlocked={selectedScript ? user.unlockedScriptIds.includes(selectedScript.id) : false}
        userCoins={user.coins}
        onClose={() => setSelectedScript(null)}
        onCopy={handleQuickCopyScript}
        onUnlock={handleUnlockScript}
      />

      {/* Purchase Confirmation Modal */}
      {purchasingProduct && (
        <PurchaseModal
          product={purchasingProduct}
          userCoins={user.coins}
          userAvatarUrl={user.avatarUrl}
          onClose={() => setPurchasingProduct(null)}
          onConfirmPurchase={handleConfirmPurchase}
          onOpenCoinTopup={() => {
            setPurchasingProduct(null);
            setIsCoinModalOpen(true);
          }}
        />
      )}

      {/* Coin Top-up Modal */}
      <CoinModal
        isOpen={isCoinModalOpen}
        currentCoins={user.coins}
        onClose={() => setIsCoinModalOpen(false)}
        onAddCoins={(amount) => {
          setUser((prev) => ({ ...prev, coins: prev.coins + amount }));
          showToast(`+${amount} Coin Eklendi!`, 'Bakiyen anında güncellendi.');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        isPremium={user.isPremium}
        onUpgrade={() => {
          setUser((prev) => ({
            ...prev,
            isPremium: true,
            coins: prev.coins + 2000
          }));
          showToast('VIP Premium Aktif Edildi!', '2.000 Hediye Coin ve VIP rozeti hesabına tanımlandı!');
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
        }}
      />

      {/* Profile & Avatar Customizer Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        user={user}
        allProducts={INITIAL_PRODUCTS}
        onClose={() => setIsProfileModalOpen(false)}
        onEquipFrame={handleEquipFrame}
        onUpdateAvatar={handleUpdateAvatar}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onClear={() => {
          setHasUnreadNotifications(false);
          showToast('Bildirimler Temizlendi', 'Tüm bildirimler okundu olarak işaretlendi.');
        }}
      />
    </div>
  );
}
