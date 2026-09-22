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
  Layers,
  Heart,
  Crown,
  Check,
  Coins,
  User,
  Settings,
  Wand2
} from 'lucide-react';
import { FrameRenderer } from './components/FrameRenderer';
import { ALL_FRAMES } from './data/framesCatalog';
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
import { INITIAL_AI_COMMUNITY_FRAMES } from './data/aiCommunityFrames';
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
import { AdminView } from './components/AdminView';
import { loadSharedCatalog, upsertSharedCatalogItem, deleteSharedCatalogItem } from './lib/catalogSync';
import { AiFrameStudioModal } from './components/AiFrameStudioModal';
import { AiFrameStudioView } from './components/AiFrameStudioView';
import { AuthModal } from './components/AuthModal';
import { supabase, isSupabaseConfigured } from './lib/supabase';
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
      title: 'Çerçeveler',
      subtitle: 'Profilini Discord Nitro tarzı parlayan çerçevelerle özelleştir.'
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
    },
    'ai-studio': {
      title: 'AI Özel Çerçeve Atölyesi',
      subtitle: 'Hayalindeki çerçeveyi tarif et, AI çizsin ve yapılış zorluğuna göre fiyatını çıkarsın!'
    },
    admin: {
      title: 'Admin Yönetim Merkezi',
      subtitle: 'Script, oyun ve kozmetik kataloğunu yönet.'
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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let alive = true;
    const applySession = async (session: any) => {
      if (!alive) return;
      const authUser = session?.user;
      setIsAuthenticated(Boolean(authUser));
      const savedAvatar = authUser?.id ? (() => { try { return localStorage.getItem('harika_avatar_' + authUser.id) || ''; } catch { return ''; } })() : '';
      setAuthUserId(authUser?.id || null);
      if (!authUser) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (!alive) return;
      if (profile) {
        setUser(prev => ({
          ...prev,
          name: profile.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || prev.name,
          tag: profile.tag || ('#' + authUser.id.slice(0,4).toUpperCase()),
          avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url || savedAvatar || prev.avatarUrl,
          coins: typeof profile.coins === 'number' ? profile.coins : prev.coins,
          isPremium: Boolean(profile.is_premium),
          ownedProductIds: Array.isArray(profile.owned_product_ids) ? profile.owned_product_ids : prev.ownedProductIds,
          unlockedScriptIds: Array.isArray(profile.unlocked_script_ids) ? profile.unlocked_script_ids : prev.unlockedScriptIds,
          equippedFrameId: profile.equipped_frame_id ?? prev.equippedFrameId,
          equippedAvatarId: profile.equipped_avatar_id ?? prev.equippedAvatarId,
          equippedEffectId: profile.equipped_effect_id ?? prev.equippedEffectId,
          equippedBadgeId: profile.equipped_badge_id ?? prev.equippedBadgeId
        }));
      } else {
        await supabase.from('profiles').upsert({
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Kullanıcı',
          tag: '#' + authUser.id.slice(0,4).toUpperCase(),
          avatar_url: authUser.user_metadata?.avatar_url || savedAvatar || '',
          coins: 1450,
          role: 'user'
        }, { onConflict: 'id' });
      }
    };
    supabase.auth.getSession().then(({data}) => applySession(data.session));
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => { void applySession(session); });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!authUserId || !supabase) return;
    const timer = window.setTimeout(() => {
      void supabase.from('profiles').update({
        name: user.name, tag: user.tag, avatar_url: user.avatarUrl,
        coins: user.coins, is_premium: user.isPremium,
        owned_product_ids: user.ownedProductIds, unlocked_script_ids: user.unlockedScriptIds,
        equipped_frame_id: user.equippedFrameId, equipped_avatar_id: user.equippedAvatarId,
        equipped_effect_id: user.equippedEffectId, equipped_badge_id: user.equippedBadgeId,
        updated_at: new Date().toISOString()
      }).eq('id', authUserId);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [authUserId, user]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neon_market_user_v2', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Admin-local catalog overlays (GitHub Pages-safe persistence)
  const loadAdmin = <T,>(key: string, fallback: T): T => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };
  const [customScripts, setCustomScripts] = useState<ScriptItem[]>(() => loadAdmin('harika_admin_scripts_v1', []));
  const [customGames, setCustomGames] = useState<GameItem[]>(() => loadAdmin('harika_admin_games_v1', []));
  const [customProducts, setCustomProducts] = useState<Product[]>(() => loadAdmin('harika_admin_products_v1', []));
  const [deletedScriptIds, setDeletedScriptIds] = useState<string[]>(() => loadAdmin('harika_admin_deleted_scripts_v1', []));
  const [deletedGameIds, setDeletedGameIds] = useState<string[]>(() => loadAdmin('harika_admin_deleted_games_v1', []));
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => loadAdmin('harika_admin_deleted_products_v1', []));

  useEffect(() => { localStorage.setItem('harika_admin_scripts_v1', JSON.stringify(customScripts)); }, [customScripts]);
  useEffect(() => { localStorage.setItem('harika_admin_games_v1', JSON.stringify(customGames)); }, [customGames]);
  useEffect(() => { localStorage.setItem('harika_admin_products_v1', JSON.stringify(customProducts)); }, [customProducts]);
  useEffect(() => { localStorage.setItem('harika_admin_deleted_scripts_v1', JSON.stringify(deletedScriptIds)); }, [deletedScriptIds]);
  useEffect(() => { localStorage.setItem('harika_admin_deleted_games_v1', JSON.stringify(deletedGameIds)); }, [deletedGameIds]);
  useEffect(() => { localStorage.setItem('harika_admin_deleted_products_v1', JSON.stringify(deletedProductIds)); }, [deletedProductIds]);

  // Supabase configured ise admin/catalog verisini tüm cihazlar için ortaklaştır.
  useEffect(() => {
    let cancelled = false;
    loadSharedCatalog().then((shared) => {
      if (!shared || cancelled) return;
      setCustomScripts(shared.customScripts);
      setCustomGames(shared.customGames);
      setCustomProducts(shared.customProducts);
      setDeletedScriptIds(shared.deletedScriptIds);
      setDeletedGameIds(shared.deletedGameIds);
      setDeletedProductIds(shared.deletedProductIds);
      if (shared.communityFrames.length) {
        setCommunityFrames((prev) => {
          const map = new Map([...prev, ...shared.communityFrames].map((f) => [f.id, f]));
          return [...map.values()];
        });
      }
    }).catch(() => { /* Supabase kurulmadıysa local fallback devam eder. */ });
    return () => { cancelled = true; };
  }, []);

  const catalogScripts = useMemo(() => [
    ...SCRIPTS_DATA.filter(s => !deletedScriptIds.includes(s.id)),
    ...customScripts
  ], [customScripts, deletedScriptIds]);
  const catalogGames = useMemo(() => [
    ...GAMES_DATA.filter(g => !deletedGameIds.includes(g.id)),
    ...customGames
  ], [customGames, deletedGameIds]);

  // AI Community Frames State (Dynamic Showcase)
  const [communityFrames, setCommunityFrames] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('neon_market_community_frames_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_AI_COMMUNITY_FRAMES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('neon_market_community_frames_v1', JSON.stringify(communityFrames));
    } catch {
      // ignore
    }
  }, [communityFrames]);

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
  const [frameGenderFilter, setFrameGenderFilter] = useState<'all' | 'female' | 'male' | 'popular' | 'mythic'>('all');

  // Modals state
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAiStudioModalOpen, setIsAiStudioModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [purchasingProduct, setPurchasingProduct] = useState<Product | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>({
    id: 'initial-toast',
    title: 'HarikaScript & Kozmetikler Entegre Edildi!',
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
    if (authUserId) {
      try { localStorage.setItem('harika_avatar_' + authUserId, url); } catch {}
    }
    showToast('Avatar Güncellendi', 'Yeni görsel profilinde görüntülenecek.');
  };

  // Combine base products with AI Community generated frames
  const allProducts = useMemo(() => {
    const existingIds = new Set([...INITIAL_PRODUCTS, ...customProducts].map((p) => p.id));
    const base = INITIAL_PRODUCTS.filter(p => !deletedProductIds.includes(p.id));
    const custom = customProducts.filter(p => !deletedProductIds.includes(p.id));
    const extraCommunity = communityFrames.filter((cf) => !existingIds.has(cf.id) && !deletedProductIds.includes(cf.id));
    return [...extraCommunity, ...custom, ...base];
  }, [communityFrames, customProducts, deletedProductIds]);

  // Buy & Equip AI generated custom frame
  const handleBuyAndEquipAiFrame = (frame: Product) => {
    if (user.coins < frame.price) {
      showToast('Yetersiz Bakiye!', `Bu çerçeve için ${frame.price} Coin gerekiyor.`, 'warning');
      setIsCoinModalOpen(true);
      return;
    }

    // Deduct coins & equip
    setUser((prev) => ({
      ...prev,
      coins: prev.coins - frame.price,
      ownedProductIds: prev.ownedProductIds.includes(frame.id)
        ? prev.ownedProductIds
        : [...prev.ownedProductIds, frame.id],
      equippedFrameId: frame.id
    }));

    // Add to community frames showcase so everyone can see it
    setCommunityFrames((prev) => {
      const exists = prev.some((f) => f.id === frame.id);
      if (exists) return prev;
      void upsertSharedCatalogItem('community_frame', frame).catch(() => {});
      return [frame, ...prev];
    });

    triggerTaskProgress('equip_cosmetic');
    triggerTaskProgress('view_item');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(
      '✨ AI Çerçevesi Kuşanıldı!',
      `"${frame.name}" başarıyla profilinize uygulandı ve topluluk vitrinine eklendi!`
    );
  };

  // Like / Unlike community frame
  const handleToggleLikeCommunityFrame = (id: string) => {
    setCommunityFrames((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const isLiked = !f.isLiked;
          const next = { ...f, isLiked, likesCount: (f.likesCount || 0) + (isLiked ? 1 : -1) };
          void upsertSharedCatalogItem('community_frame', next).catch(() => {});
          return next;
        }
        return f;
      })
    );
  };

  // Filtered Products (Frames, Avatars, Effects, Badges)
  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (activeCategory === 'inventory') {
      list = list.filter((p) => user.ownedProductIds.includes(p.id));
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeCategory === 'frames') {
      if (frameGenderFilter === 'female') {
        list = list.filter((p) => p.gender === 'female');
      } else if (frameGenderFilter === 'male') {
        list = list.filter((p) => p.gender === 'male');
      } else if (frameGenderFilter === 'popular') {
        list = list.filter((p) => p.isPopular || p.rarity === 'mythic');
      } else if (frameGenderFilter === 'mythic') {
        list = list.filter((p) => p.rarity === 'mythic' || p.rarity === 'legendary');
      }
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
  }, [activeCategory, searchQuery, sortBy, frameGenderFilter, user.ownedProductIds, allProducts]);

  // Filtered Scripts
  const filteredScripts = useMemo(() => {
    let list = catalogScripts;

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
  }, [activeCategory, scriptGameFilter, searchQuery, user.unlockedScriptIds, catalogScripts]);

  // Equip any cosmetic type
  const handleEquipProduct = (product: Product) => {
    setUser((prev) => ({
      ...prev,
      equippedFrameId: product.category === 'frames' ? product.id : prev.equippedFrameId,
      equippedAvatarId: product.category === 'avatars' ? product.id : prev.equippedAvatarId,
      equippedEffectId: product.category === 'effects' ? product.id : prev.equippedEffectId,
      equippedBadgeId: product.category === 'badges' ? product.id : prev.equippedBadgeId
    }));
    triggerTaskProgress('equip_cosmetic');
    showToast('Kullanıldı!', `${product.name} profiline uygulandı.`);
  };

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
        product.category === 'frames' ? product.id : prev.equippedFrameId,
      equippedAvatarId:
        product.category === 'avatars' ? product.id : prev.equippedAvatarId,
      equippedEffectId:
        product.category === 'effects' ? product.id : prev.equippedEffectId,
      equippedBadgeId:
        product.category === 'badges' ? product.id : prev.equippedBadgeId
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
  const handleQuickCopyScript = async (script: ScriptItem) => {
    try {
      await navigator.clipboard.writeText(script.code);
      triggerTaskProgress('copy_script');
      showToast('Kopyalandı!', `"${script.name}" kodu panoya kopyalandı.`);
    } catch {
      showToast('Kopyalama başarısız', 'Tarayıcı pano izni vermedi. Scripti açıp kodu manuel kopyalayabilirsin.', 'warning');
    }
  };

  // Select game -> filter scripts
  const handleSelectGame = (gameId: string) => {
    setScriptGameFilter(gameId);
    setActiveCategory('scripts');
    triggerTaskProgress('view_item');
  };

  const equippedProduct = allProducts.find((p) => p.id === user.equippedFrameId || p.frameType === user.equippedFrameId);
  const equippedFrameStyle = equippedProduct?.frameStyle || (equippedProduct?.previewImage ? {
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    glowColor: 'rgba(99,102,241,0.75)',
    frameImage: equippedProduct.previewImage
  } : undefined);

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
  const isAiStudioCategory = activeCategory === 'ai-studio';
  const isAdminCategory = activeCategory === 'admin';

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
        onOpenAiStudio={() => setIsAiStudioModalOpen(true)}
        hasUnreadNotifications={hasUnreadNotifications}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={async () => { if (supabase) await supabase.auth.signOut(); setIsAuthenticated(false); setAuthUserId(null); }}
        equippedFrameStyle={equippedFrameStyle}
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
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(['all','frames','avatars','effects','badges','inventory','scripts','games','executors','ai-studio','admin'] as CategoryType[]).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-[11px] font-bold border ${activeCategory===cat?'bg-indigo-600 border-indigo-500 text-white':'bg-white/5 border-white/10 text-slate-400'}`}>
                {cat==='all'?'🛍️ Tümü':cat==='frames'?'✨ Çerçeveler':cat==='avatars'?'👤 Avatarlar':cat==='effects'?'💫 Efektler':cat==='badges'?'🏆 Rozetler':cat==='inventory'?'🎒 Envanter':cat==='scripts'?'📜 Scriptler':cat==='games'?'🎮 Oyunlar':cat==='executors'?'⚙️ Executorlar':cat==='ai-studio'?'✨ AI Atölye':'🛡️ Admin'}
              </button>
            ))}
          </div>

          {/* Daily Tasks Banner */}
          <DailyTasksWidget
            tasks={tasks}
            onClaimTask={handleClaimTask}
            onClaimAll={handleClaimAllTasks}
          />

          {/* Page Heading & Search Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/[0.08]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-lg shadow-indigo-500/5">
                <SectionFrameIcon className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-[22px] font-bold text-white tracking-tight font-heading flex items-center gap-2">
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

          {/* AI Custom Frame Generator Banner inside Frames view */}
          {activeCategory === 'frames' && (
            <div className="relative rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-pink-950/50 border border-indigo-500/30 p-4 sm:p-5 mb-5 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                      Aklındaki Çerçeveyi Kendin Yaptır!
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      ✨ AI Atölye
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    İstediğin renk ve süslemeyi tarif et, AI çizsin ve yapılış zorluğuna göre fiyatını belirlesin. Satın alıp herkese sergile!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiStudioModalOpen(true)}
                className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI ile Çerçeve Yap</span>
              </button>
            </div>
          )}

          {/* Sub-filters for Frames (150+ Girls & Boys Collections) */}
          {activeCategory === 'frames' && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 overflow-x-auto">
              <button
                onClick={() => setFrameGenderFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  frameGenderFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-[#121522] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>Tümü ({ALL_FRAMES.length})</span>
              </button>
              <button
                onClick={() => setFrameGenderFilter('female')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  frameGenderFilter === 'female'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 ring-1 ring-pink-400'
                    : 'bg-[#121522] text-pink-300 hover:text-white border border-pink-500/20 hover:border-pink-500/40'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                <span>💖 Kız Çerçeveleri ({ALL_FRAMES.filter((f) => f.gender === 'female').length})</span>
              </button>
              <button
                onClick={() => setFrameGenderFilter('male')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  frameGenderFilter === 'male'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                    : 'bg-[#121522] text-cyan-300 hover:text-white border border-cyan-500/20 hover:border-cyan-500/40'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                <span>⚡ Erkek Çerçeveleri ({ALL_FRAMES.filter((f) => f.gender === 'male').length})</span>
              </button>
              <button
                onClick={() => setFrameGenderFilter('popular')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  frameGenderFilter === 'popular'
                    ? 'bg-amber-500 text-amber-950 font-bold shadow-lg shadow-amber-500/30'
                    : 'bg-[#121522] text-amber-300 hover:text-white border border-amber-500/20'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>🔥 Popüler & VIP</span>
              </button>
              <button
                onClick={() => setFrameGenderFilter('mythic')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  frameGenderFilter === 'mythic'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-[#121522] text-purple-300 hover:text-white border border-purple-500/20'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>👑 Efsanevi</span>
              </button>
            </div>
          )}

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
              games={catalogGames}
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
                          if (isEquipped) {
                            setUser((prev) => ({
                              ...prev,
                              equippedFrameId: prod.category === 'frames' ? null : prev.equippedFrameId,
                              equippedAvatarId: prod.category === 'avatars' ? null : prev.equippedAvatarId,
                              equippedEffectId: prod.category === 'effects' ? null : prev.equippedEffectId,
                              equippedBadgeId: prod.category === 'badges' ? null : prev.equippedBadgeId
                            }));
                            showToast('Kozmetik Çıkarıldı', `${prod.name} profilinden kaldırıldı.`, 'info');
                          } else {
                            handleEquipProduct(prod);
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
              {/* Live Profile Card & Active Appearance Showcase */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121628] via-[#0e1220] to-[#161226] border border-white/10 relative overflow-hidden shadow-2xl">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    {/* Live Rendered Active Frame */}
                  <div className="relative shrink-0">
                    <FrameRenderer
                      frameType={user.equippedFrameId || 'none'}
                      frameStyle={equippedFrameStyle}
                      avatarUrl={user.avatarUrl}
                      size="lg"
                      isAnimated={true}
                    />
                    {user.isPremium && (
                      <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-amber-950 shadow-lg border-2 border-[#0e1220]">
                        <Crown className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                        {user.name}
                      </h3>
                      <span className="text-xs text-indigo-400 font-mono bg-indigo-500/15 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                        {user.tag}
                      </span>
                      {user.isPremium && (
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> VIP Üye
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 flex items-center justify-center md:justify-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Aktif Kuşanılan Çerçeve:{' '}
                        <strong className="text-white font-semibold">
                          {allProducts.find((f) => f.id === user.equippedFrameId || f.frameType === user.equippedFrameId)?.name || 'Standart Çerçevesiz'}
                        </strong>
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white">{user.coins.toLocaleString('tr-TR')}</span>
                        <span className="text-slate-400">Coin</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <Package className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-white">{user.ownedProductIds.length}</span>
                        <span className="text-slate-400">Satın Alınan Kozmetik</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-white">{user.unlockedScriptIds.length}</span>
                        <span className="text-slate-400">Açık Script</span>
                      </div>

                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="ml-auto px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 active:scale-95 text-xs"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Profili & Dolabı Aç</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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
                        isEquipped={
                          user.equippedFrameId === product.id ||
                          user.equippedAvatarId === product.id ||
                          user.equippedEffectId === product.id ||
                          user.equippedBadgeId === product.id
                        }
                        userCoins={user.coins}
                        userAvatarUrl={user.avatarUrl}
                        onBuy={() => {}}
                        onEquip={(prod) => handleEquipProduct(prod)}
                        onPreview={(prod) => handleEquipProduct(prod)}
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

          {/* 7. ADMIN VIEW */}
          {isAdminCategory && (
            <AdminView
              scripts={catalogScripts}
              games={catalogGames}
              products={allProducts}
              onAddScript={(item) => setCustomScripts(prev => [{ ...item, creatorId: authUserId || undefined, creatorName: user.name, creatorTag: user.tag, creatorAvatarUrl: user.avatarUrl, creatorFrameId: user.equippedFrameId, creatorFrameStyle: allProducts.find(p => p.id === user.equippedFrameId)?.frameStyle }, ...prev])}
              onDeleteScript={(id) => id.startsWith('admin-') ? setCustomScripts(prev => prev.filter(x => x.id !== id)) : setDeletedScriptIds(prev => [...new Set([...prev, id])])}
              onAddGame={(item) => setCustomGames(prev => [item, ...prev])}
              onDeleteGame={(id) => id.startsWith('admin-') ? setCustomGames(prev => prev.filter(x => x.id !== id)) : setDeletedGameIds(prev => [...new Set([...prev, id])])}
              onAddProduct={(item) => setCustomProducts(prev => [item, ...prev])}
              onDeleteProduct={(id) => id.startsWith('admin-') ? setCustomProducts(prev => prev.filter(x => x.id !== id)) : setDeletedProductIds(prev => [...new Set([...prev, id])])}
              onReset={() => {
                setCustomScripts([]); setCustomGames([]); setCustomProducts([]);
                setDeletedScriptIds([]); setDeletedGameIds([]); setDeletedProductIds([]);
                showToast('Admin verileri sıfırlandı', 'Yerel katalog varsayılan haline döndü.', 'info');
              }}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* 6. AI FRAME STUDIO VIEW */}
          {isAiStudioCategory && (
            <AiFrameStudioView
              user={user}
              onBuyAndEquip={handleBuyAndEquipAiFrame}
              onOpenCoinModal={() => setIsCoinModalOpen(true)}
              communityFrames={communityFrames}
              onToggleLikeCommunityFrame={handleToggleLikeCommunityFrame}
            />
          )}
        </main>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

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
        allProducts={allProducts}
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

      {/* AI Frame Studio Modal */}
      <AiFrameStudioModal
        isOpen={isAiStudioModalOpen}
        user={user}
        onClose={() => setIsAiStudioModalOpen(false)}
        onBuyAndEquip={handleBuyAndEquipAiFrame}
        onOpenCoinModal={() => {
          setIsAiStudioModalOpen(false);
          setIsCoinModalOpen(true);
        }}
        communityFrames={communityFrames}
        onToggleLikeCommunityFrame={handleToggleLikeCommunityFrame}
      />
    </div>
  );
}
