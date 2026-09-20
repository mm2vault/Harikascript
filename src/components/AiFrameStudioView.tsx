import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Heart,
  Zap,
  Crown,
  Coins,
  Check,
  RotateCcw,
  Users,
  Flame,
  Layers,
  Palette,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserState, Product } from '../types';
import { FrameRenderer } from './FrameRenderer';

interface AiFrameStudioViewProps {
  user: UserState;
  onBuyAndEquip: (frame: Product) => void;
  onOpenCoinModal: () => void;
  communityFrames: Product[];
  onToggleLikeCommunityFrame: (id: string) => void;
}

export const AiFrameStudioView: React.FC<AiFrameStudioViewProps> = ({
  user,
  onBuyAndEquip,
  onOpenCoinModal,
  communityFrames,
  onToggleLikeCommunityFrame
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'showcase' | 'my-creations'>('create');
  const [prompt, setPrompt] = useState('');
  const [selectedGender, setSelectedGender] = useState<'unisex' | 'female' | 'male'>('unisex');
  const [selectedVibe, setSelectedVibe] = useState<'balanced' | 'cute' | 'dark' | 'cyber'>('balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedFrame, setGeneratedFrame] = useState<Product | null>(null);
  const [previewSize, setPreviewSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string>(user.avatarUrl);
  const [showcaseFilter, setShowcaseFilter] = useState<'all' | 'female' | 'male' | 'popular'>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleAvatars = [
    { label: 'Senin Avatarın', url: user.avatarUrl },
    { label: '🌸 Neko Anime', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80' },
    { label: '⚡ Siber Savaşçı', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80' },
    { label: '⚔️ Samuray', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: '🦊 Kitsune Mistik', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  ];

  const promptSuggestions = [
    { label: '🕷️ Spiderman Ağ & Kostüm Gözleri', prompt: 'Örümcek Adam Spiderman temalı, kırmızı mavi örümcek ağları, beyaz parlayan gözler ve örümcek amblemi', gender: 'male', vibe: 'cyber' },
    { label: '🦇 Gotham Batman & Batarang', prompt: 'Kara Şövalye Batman temalı, sivri yarasa kulakları, siyah zırh ve altın sarısı batarang amblemi', gender: 'male', vibe: 'dark' },
    { label: '🌸 Kawaii Pembe Kedi & Patiler', prompt: 'Sevimli pembe kedi kulakları, pembe kedi patileri ve narin ışıltı', gender: 'female', vibe: 'cute' },
    { label: '🐉 Ateşli Kızıl Ejderha & Pençeler', prompt: 'Alevli kızıl ejderha zırhı, kor pençeleri ve sivri alevler', gender: 'male', vibe: 'dark' },
    { label: '🐺 Buzul Kurt Ruhu & Mistik Rünler', prompt: 'Buz mavisi kurt başlığı, antik kuzey rünleri ve kutup ışığı aurası', gender: 'male', vibe: 'dark' },
    { label: '⚔️ Çapraz Katana & Kan Samurayı', prompt: 'Çapraz katana kılıçları, kan kırmızısı samuray miğferi ve siyah gölge', gender: 'male', vibe: 'dark' },
    { label: '⚡ Siberpunk Glitch Matrix HUD', prompt: 'Neon camgöbeği siber vizör, yeşil matrix kodları ve teknolojik HUD arayüzü', gender: 'male', vibe: 'cyber' },
    { label: '👼 Semavi Başmelek Kanatları & Halesi', prompt: 'Bembeyaz melek kanatları, parıldayan altın kutsal hare ve ipek kurdele', gender: 'female', vibe: 'balanced' },
    { label: '🌹 Büyülü Kadife Gül & Dikenler', prompt: 'Koyu bordo gül buketi, sarmaşık dikenler ve ışıltılı pembe yapraklar', gender: 'female', vibe: 'cute' },
    { label: '💀 Gothic Azrail & Kurukafalar', prompt: 'Karanlık mor ve siyah gölge kurukafası, ruh alevi ve antik kemikler', gender: 'male', vibe: 'dark' },
    { label: '👑 İmparatorluk Altın Tacı & Pırlanta', prompt: 'Saf altın imparatorluk tacı, pırlanta kristali ve parıldayan altın ışıklar', gender: 'unisex', vibe: 'balanced' },
    { label: '🦊 Efsanevi Kitsune Dokuz Kuyruk Tilki', prompt: 'Büyülü tilki kulakları, kırmızı mabet kurdelesi ve mistik mavi ruh alevi', gender: 'female', vibe: 'cute' },
  ];

  const handleApplySuggestion = (s: typeof promptSuggestions[0]) => {
    setPrompt(s.prompt);
    setSelectedGender(s.gender as any);
    setSelectedVibe(s.vibe as any);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Lütfen hayalindeki çerçeveyi anlatan kısa bir açıklama yaz.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep('Yapay Zeka çerçeve fikrini analiz ediyor...');

    try {
      const step1Timer = setTimeout(() => {
        setGenerationStep('Renk matrisi ve SVG vektör süslemeleri dokunuyor...');
      }, 700);

      const step2Timer = setTimeout(() => {
        setGenerationStep('Hareketli parçacık animasyonu ve nadirlik maliyeti hesaplanıyor...');
      }, 1500);

      const response = await fetch('/api/generate-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          gender: selectedGender,
          vibe: selectedVibe,
          requestedBy: user.name
        })
      });

      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      if (!response.ok) {
        throw new Error('Sunucu isteği başarısız oldu.');
      }

      const data = await response.json();
      if (data.success && data.frame) {
        const frameData: Product = {
          ...data.frame,
          creatorTag: user.tag,
          isAiGenerated: true,
          createdAt: 'Az önce'
        };
        setGeneratedFrame(frameData);
      } else {
        throw new Error('Çerçeve verisi işlenemedi.');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage('Tasarım yapılırken bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePurchase = (frame: Product) => {
    if (user.coins < frame.price) {
      setErrorMessage(`Yetersiz bakiye! Bu çerçeve için ${frame.price} Coin gerekiyor, sende ${user.coins} Coin var.`);
      return;
    }

    onBuyAndEquip(frame);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const displayedShowcaseFrames = communityFrames.filter((f) => {
    if (showcaseFilter === 'female') return f.gender === 'female';
    if (showcaseFilter === 'male') return f.gender === 'male';
    if (showcaseFilter === 'popular') return (f.likesCount || 0) > 150;
    return true;
  });

  const myCreations = communityFrames.filter(
    (f) => f.createdBy === user.name || f.creatorTag === user.tag
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#101426] via-[#161233] to-[#1c1228] border border-indigo-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-400" />
              <span>Gemini Destekli Özel Çerçeve Üretimi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Aklındaki Çerçeveyi Söyle, AI Çizsin ve Fiyatlandırsın!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              İstediğin renkleri, temayı, süslemeleri veya sembolleri tarif et. Yapay Zeka anında animasyonlu SVG çerçeveyi üretsin, yapılış karmaşıklığına göre adil Coin fiyatını versin, satın alıp profiline kuşanabilir ve tüm topluluğa sergileyebilirsin!
            </p>
          </div>

          {/* Quick Balance Counter */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-4 shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Kullanılabilir Bakiye</div>
              <div className="text-xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{user.coins.toLocaleString('tr-TR')}</span>
                <span className="text-amber-400 text-xs font-bold">Coin</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Wand2 className="w-4 h-4 text-indigo-300" />
            <span>Yeni Çerçeve Tasarla</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'showcase'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-pink-300" />
            <span>Topluluk AI Vitrini ({communityFrames.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-creations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my-creations'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Benim Tasarımlarım ({myCreations.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DESIGN / CREATE VIEW */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompt & Customizer Settings */}
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-3xl bg-[#0b0e16] border border-white/[0.08] p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Hayalindeki Çerçeveyi Tarif Et</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn: Ateşli kızıl ejderha pulları, siyah ve mor katana bıçakları, animasyonlu alevler ve göz alıcı parlama..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl bg-[#121624] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner leading-relaxed"
                />
              </div>

              {/* Ready Prompt Inspiration Chips */}
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-2 block">
                  İlham Verici Hazır Fikirler:
                </span>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySuggestion(item)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all text-left flex items-center gap-1.5"
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Vibe Options */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 mb-2 block">
                    Cinsiyet & Stil Teması:
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-[#121624] p-1.5 rounded-xl border border-white/5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedGender('unisex')}
                      className={`py-1.5 rounded-lg font-medium transition-all ${
                        selectedGender === 'unisex' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Evrensel
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('female')}
                      className={`py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                        selectedGender === 'female' ? 'bg-pink-600 text-white shadow' : 'text-pink-300/70 hover:text-pink-200'
                      }`}
                    >
                      <Heart className="w-3 h-3 fill-pink-300" /> Kız
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('male')}
                      className={`py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                        selectedGender === 'male' ? 'bg-cyan-600 text-white shadow' : 'text-cyan-300/70 hover:text-cyan-200'
                      }`}
                    >
                      <Zap className="w-3 h-3 fill-cyan-300" /> Erkek
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 mb-2 block">
                    Görsel Atmosfer:
                  </span>
                  <select
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#121624] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="balanced">✨ Büyülü & Dengeli</option>
                    <option value="cute">💖 Tatlı & Pastel Kawaii</option>
                    <option value="dark">🔥 Agresif & Alevli Karanlık</option>
                    <option value="cyber">⚡ Siberpunk & Glitch Matrix</option>
                  </select>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Generate Trigger Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:pointer-events-none active:scale-98 cursor-pointer"
              >
                <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Yapay Zeka Dokuyor...' : '✨ AI ile Çerçeveyi Tasarla'}</span>
              </button>

              {isGenerating && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2.5 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                    <span>{generationStep}</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 animate-[pulse_1s_infinite]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Showcase & Dynamic Price Breakdown */}
          <div className="lg:col-span-6 flex flex-col">
            {generatedFrame ? (
              <div className="rounded-3xl bg-gradient-to-b from-[#131728] to-[#0c0f1c] border border-indigo-500/30 p-6 sm:p-7 flex flex-col h-full shadow-2xl relative">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {generatedFrame.tagText || '✨ AI Özel Tasarım'}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {generatedFrame.rarity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                    <button
                      onClick={() => setPreviewSize('md')}
                      className={`px-2.5 py-1 rounded-lg ${previewSize === 'md' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Orta
                    </button>
                    <button
                      onClick={() => setPreviewSize('lg')}
                      className={`px-2.5 py-1 rounded-lg ${previewSize === 'lg' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Büyük
                    </button>
                  </div>
                </div>

                {/* Central Avatar Visual Preview */}
                <div className="my-6 flex flex-col items-center justify-center shrink-0">
                  <FrameRenderer
                    frameType={generatedFrame.id}
                    frameStyle={generatedFrame.frameStyle}
                    avatarUrl={previewAvatarUrl}
                    size={previewSize}
                    isAnimated={true}
                  />
                  <h3 className="text-xl font-bold text-white mt-4 font-heading text-center">
                    {generatedFrame.name}
                  </h3>
                  <p className="text-xs text-slate-300 text-center max-w-md mt-1 leading-relaxed">
                    {generatedFrame.description}
                  </p>

                  {/* Avatar Model Switcher */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
                    <span className="text-xs text-slate-400 font-medium">Avatar Dene:</span>
                    {sampleAvatars.map((av, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewAvatarUrl(av.url)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          previewAvatarUrl === av.url
                            ? 'bg-indigo-600/70 border-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {av.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI DYNAMIC PRICING BREAKDOWN RECEIPT */}
                {generatedFrame.pricing && (
                  <div className="mt-auto p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-3">
                    <div className="flex items-center justify-between font-bold text-white pb-2 border-b border-white/10">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="text-sm">AI Maliyet & Fiyatlandırma Dökümü</span>
                      </span>
                      <span className="text-amber-400 text-base font-extrabold">
                        {generatedFrame.price.toLocaleString('tr-TR')} Coin
                      </span>
                    </div>

                    {/* Breakdown rows */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {generatedFrame.pricing.priceBreakdown.map((b, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-slate-400">• {b.item}</span>
                          <span className="font-mono text-slate-200 font-semibold">+{b.cost} Coin</span>
                        </div>
                      ))}
                    </div>

                    {generatedFrame.pricing.explanation && (
                      <div className="text-xs text-indigo-300/90 pt-2 border-t border-white/5 italic">
                        💡 {generatedFrame.pricing.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Purchase & Try Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tekrar Tasarla</span>
                  </button>

                  {user.ownedProductIds.includes(generatedFrame.id) ||
                  user.equippedFrameId === generatedFrame.id ? (
                    <button
                      disabled
                      className="py-3 px-4 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Kuşanıldı</span>
                    </button>
                  ) : user.coins >= generatedFrame.price ? (
                    <button
                      type="button"
                      onClick={() => handlePurchase(generatedFrame)}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Coins className="w-4 h-4" />
                      <span>{generatedFrame.price} Coin İle Satın Al & Kuşan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenCoinModal}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-amber-300" />
                      <span>Yetersiz Bakiye (+ Coin Al)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[360px] rounded-3xl bg-[#0b0e16] border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-400/60 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-200">
                  Henüz Bir Çerçeve Üretilmedi
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Soldaki kutucuğa hayalindeki renkleri, temayı veya motifi yazıp &ldquo;AI ile Çerçeveyi Tasarla&rdquo; butonuna bas. Yapay zeka tasarımı yapıp detaylı maliyet analizini buraya çıkaracak.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY SHOWCASE ("ve her kese görüntüleye bilsin") */}
      {activeTab === 'showcase' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#0b0e16] p-2 rounded-2xl border border-white/[0.08]">
            <button
              onClick={() => setShowcaseFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                showcaseFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Tüm Topluluk ({communityFrames.length})
            </button>
            <button
              onClick={() => setShowcaseFilter('female')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                showcaseFilter === 'female'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white/5 text-pink-300 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-pink-300" />
              Kız Tasarımları ({communityFrames.filter((f) => f.gender === 'female').length})
            </button>
            <button
              onClick={() => setShowcaseFilter('male')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                showcaseFilter === 'male'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-cyan-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-cyan-300" />
              Erkek Tasarımları ({communityFrames.filter((f) => f.gender === 'male').length})
            </button>
            <button
              onClick={() => setShowcaseFilter('popular')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                showcaseFilter === 'popular'
                  ? 'bg-amber-500 text-amber-950 font-bold'
                  : 'bg-white/5 text-amber-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              En Çok Beğenilenler
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedShowcaseFrames.map((frame) => {
              const isOwned = user.ownedProductIds.includes(frame.id);
              const isEquipped = user.equippedFrameId === frame.id;
              return (
                <div
                  key={frame.id}
                  className="p-4 rounded-3xl bg-gradient-to-b from-[#121626] to-[#0c0f1c] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col group relative shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        @{frame.createdBy}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        {frame.creatorTag}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleLikeCommunityFrame(frame.id)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
                        frame.isLiked
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-pink-300'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${frame.isLiked ? 'fill-pink-400 text-pink-400' : ''}`}
                      />
                      <span>{frame.likesCount || 0}</span>
                    </button>
                  </div>

                  <div className="my-3 flex items-center justify-center">
                    <FrameRenderer
                      frameType={frame.id}
                      frameStyle={frame.frameStyle}
                      avatarUrl={user.avatarUrl}
                      size="md"
                      isAnimated={true}
                    />
                  </div>

                  <div className="mt-1 flex-1">
                    <div className="text-sm font-bold text-white truncate" title={frame.name}>
                      {frame.name}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
                      &ldquo;{frame.prompt || frame.description}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Coins className="w-4 h-4" />
                      <span>{frame.price} Coin</span>
                    </div>

                    {isEquipped ? (
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Kuşanıldı
                      </span>
                    ) : isOwned ? (
                      <button
                        onClick={() => onBuyAndEquip(frame)}
                        className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                      >
                        Kuşan
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(frame)}
                        className="text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Kopyasını Al</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MY CREATIONS ("Benim Tasarımlarım") */}
      {activeTab === 'my-creations' && (
        <div className="space-y-4">
          {myCreations.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#0b0e16] border border-white/[0.08] p-8">
              <Wand2 className="w-10 h-10 text-indigo-400/60 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-200">
                Henüz AI ile oluşturduğun bir çerçeve yok
              </div>
              <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                &ldquo;Yeni Çerçeve Tasarla&rdquo; sekmesinden ilk eserini üreterek topluluk vitrinine ekleyebilir ve profiline takabilirsin!
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Şimdi Tasarla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myCreations.map((frame) => {
                const isEquipped = user.equippedFrameId === frame.id;
                return (
                  <div
                    key={frame.id}
                    className="p-4 rounded-3xl bg-[#121626] border border-indigo-500/30 flex flex-col shadow-lg"
                  >
                    <div className="my-3 flex items-center justify-center">
                      <FrameRenderer
                        frameType={frame.id}
                        frameStyle={frame.frameStyle}
                        avatarUrl={user.avatarUrl}
                        size="md"
                        isAnimated={true}
                      />
                    </div>
                    <div className="text-sm font-bold text-white truncate">{frame.name}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {frame.prompt || frame.description}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-pink-300 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                        {frame.likesCount || 0} Beğeni
                      </span>
                      <button
                        onClick={() => onBuyAndEquip(frame)}
                        className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                        }`}
                      >
                        {isEquipped ? 'Kuşanıldı' : 'Kuşan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
