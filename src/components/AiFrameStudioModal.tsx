import React, { useState } from 'react';
import {
  X,
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
  ArrowRight,
  HelpCircle,
  Share2,
  Layers,
  Palette,
  Eye,
  Sliders,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserState, Product } from '../types';
import { FrameRenderer } from './FrameRenderer';
import { generateClientFrame } from '../utils/clientFrameGenerator';

interface AiFrameStudioModalProps {
  isOpen: boolean;
  user: UserState;
  onClose: () => void;
  onBuyAndEquip: (frame: Product) => void;
  onOpenCoinModal: () => void;
  communityFrames: Product[];
  onToggleLikeCommunityFrame: (id: string) => void;
}

export const AiFrameStudioModal: React.FC<AiFrameStudioModalProps> = ({
  isOpen,
  user,
  onClose,
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
  const [previewSize, setPreviewSize] = useState<'md' | 'lg'>('md');
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

  if (!isOpen) return null;

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
        setGenerationStep('Hareketli fizik animasyonu ve malzeme dökümü hesaplanıyor...');
      }, 1500);

      let frameData: Product | null = null;

      // Sunucu/Gemini varsa onu kullan; GitHub Pages'te /api yoksa
      // zengin yerel üreticiye otomatik düş.
      try {
        const response = await fetch('/api/generate-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            gender: selectedGender,
            vibe: selectedVibe,
            requestedBy: user.name
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.frame) {
            frameData = {
              ...data.frame,
              creatorTag: user.tag,
              isAiGenerated: true,
              createdAt: 'Az önce'
            };
          }
        }
      } catch {
        // GitHub Pages statik olduğu için /api bulunamayabilir.
      }

      if (!frameData) {
        frameData = generateClientFrame(prompt.trim(), selectedGender, selectedVibe, user.name);
        frameData.creatorTag = user.tag;
      }

      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      setGeneratedFrame(frameData);
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

  // Filter showcase frames
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="ai-frame-studio-dialog"
        className="w-full max-w-4xl rounded-3xl bg-[#0b0e17] border border-indigo-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Glow Highlights */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-2xl bg-[#0d111d] flex items-center justify-center text-pink-400">
                <Wand2 className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  AI Özel Çerçeve Atölyesi
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300">
                  Gemini Yapay Zeka
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aklındaki çerçeveyi anlat, AI çizsin ve yapılış zorluğuna göre adil fiyat versin!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Coin Balance pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">{user.coins.toLocaleString('tr-TR')}</span>
              <span className="text-amber-300 text-[10px]">Coin</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-white/10 pb-3 shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Yeni Çerçeve Tasarla</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'showcase'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-pink-300" />
            <span>Topluluk AI Vitrini ({communityFrames.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-creations')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my-creations'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Benim Tasarımlarım ({myCreations.length})</span>
          </button>
        </div>

        {/* TAB 1: CREATE / DESIGN WITH AI */}
        {activeTab === 'create' && (
          <div className="mt-4 flex-1 overflow-y-auto pr-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Prompt & Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Hayalindeki Çerçeveyi Anlat:</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn: Ateşli kızıl ejderha pulları, siyah ve mor katana bıçakları, animasyonlu alevler ve göz alıcı parlama..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#121624] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Ready Prompt Inspiration Chips */}
              <div>
                <span className="text-[11px] font-medium text-slate-400 mb-2 block">
                  Hızlı İlham Al (Tıkla ve Dene):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {promptSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySuggestion(item)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Options (Gender & Vibe) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                    Tema / Cinsiyet:
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-[#121624] p-1 rounded-xl border border-white/5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedGender('unisex')}
                      className={`py-1 rounded-lg font-medium transition-all ${
                        selectedGender === 'unisex' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Evrensel
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('female')}
                      className={`py-1 rounded-lg font-medium transition-all flex items-center justify-center gap-0.5 ${
                        selectedGender === 'female' ? 'bg-pink-600 text-white' : 'text-pink-300/70 hover:text-pink-200'
                      }`}
                    >
                      <Heart className="w-2.5 h-2.5 fill-pink-300" /> Kız
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('male')}
                      className={`py-1 rounded-lg font-medium transition-all flex items-center justify-center gap-0.5 ${
                        selectedGender === 'male' ? 'bg-cyan-600 text-white' : 'text-cyan-300/70 hover:text-cyan-200'
                      }`}
                    >
                      <Zap className="w-2.5 h-2.5 fill-cyan-300" /> Erkek
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                    Hava / Atmosfer:
                  </span>
                  <select
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#121624] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
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
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Generate Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:pointer-events-none active:scale-98"
              >
                <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'AI Çerçeveyi Dokuyor...' : '✨ AI ile Çerçeveyi Tasarla'}</span>
              </button>

              {isGenerating && (
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                    <span>{generationStep}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 animate-[pulse_1s_infinite]" />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Showcase & Dynamic Price Receipt */}
            <div className="lg:col-span-6 flex flex-col">
              {generatedFrame ? (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#131728] to-[#0c0f1c] border border-indigo-500/30 flex flex-col h-full shadow-2xl relative">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {generatedFrame.tagText || '✨ AI Özel Tasarım'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                        {generatedFrame.rarity}
                      </span>
                    </div>

                    {/* Preview Size Toggle */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[10px]">
                      <button
                        onClick={() => setPreviewSize('md')}
                        className={`px-2 py-0.5 rounded-lg ${previewSize === 'md' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                      >
                        Orta
                      </button>
                      <button
                        onClick={() => setPreviewSize('lg')}
                        className={`px-2 py-0.5 rounded-lg ${previewSize === 'lg' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                      >
                        Büyük
                      </button>
                    </div>
                  </div>

                  {/* Live Rendered Custom Frame on Selected Avatar */}
                  <div className="my-3 flex flex-col items-center justify-center shrink-0">
                    <FrameRenderer
                      frameType={generatedFrame.id}
                      frameStyle={generatedFrame.frameStyle}
                      avatarUrl={previewAvatarUrl}
                      size={previewSize}
                      isAnimated={true}
                    />
                    <h4 className="text-base font-bold text-white mt-2 font-heading text-center">
                      {generatedFrame.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 text-center max-w-sm mt-0.5 line-clamp-2">
                      {generatedFrame.description}
                    </p>

                    {/* Avatar Model Switcher */}
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap justify-center">
                      <span className="text-[10px] text-slate-400 font-medium">Avatar Dene:</span>
                      {sampleAvatars.map((av, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewAvatarUrl(av.url)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            previewAvatarUrl === av.url
                              ? 'bg-indigo-600/60 border-indigo-400 text-white font-bold'
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
                    <div className="mt-auto p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-white pb-1.5 border-b border-white/10">
                        <span className="flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI Maliyet & Fiyatlandırma Dökümü</span>
                        </span>
                        <span className="text-amber-400 text-sm font-extrabold">
                          {generatedFrame.price.toLocaleString('tr-TR')} Coin
                        </span>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {generatedFrame.pricing.priceBreakdown.map((b, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-slate-400">• {b.item}</span>
                            <span className="font-mono text-slate-200">+{b.cost} Coin</span>
                          </div>
                        ))}
                      </div>

                      {/* Explanation from AI */}
                      {generatedFrame.pricing.explanation && (
                        <div className="text-[10px] text-indigo-300/90 pt-1.5 border-t border-white/5 italic">
                          💡 {generatedFrame.pricing.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Purchase / Re-try Buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerate()}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Tekrar Yap</span>
                    </button>

                    {user.ownedProductIds.includes(generatedFrame.id) ||
                    user.equippedFrameId === generatedFrame.id ? (
                      <button
                        disabled
                        className="py-2.5 px-3 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Kuşanıldı</span>
                      </button>
                    ) : user.coins >= generatedFrame.price ? (
                      <button
                        type="button"
                        onClick={() => handlePurchase(generatedFrame)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{generatedFrame.price} Coin İle Satın Al & Kuşan</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenCoinModal}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-300" />
                        <span>Coin Yetersiz (+ Coin Al)</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty Placeholder State */
                <div className="h-full min-h-[300px] rounded-3xl bg-[#101422]/60 border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7 text-indigo-400/60" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    Henüz Bir Çerçeve Üretilmedi
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Soldaki kutuya hayalindeki renkleri, temayı veya motifi yazıp &ldquo;AI ile Çerçeveyi Tasarla&rdquo; butonuna bas.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY SHOWCASE ("ve her kese görüntüleye bilsin") */}
        {activeTab === 'showcase' && (
          <div className="mt-4 flex-1 overflow-y-auto pr-1">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowcaseFilter('all')}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  showcaseFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Tümü ({communityFrames.length})
              </button>
              <button
                onClick={() => setShowcaseFilter('female')}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  showcaseFilter === 'female'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white/5 text-pink-300 hover:text-white'
                }`}
              >
                <Heart className="w-3 h-3 fill-pink-300" />
                Kız ({communityFrames.filter((f) => f.gender === 'female').length})
              </button>
              <button
                onClick={() => setShowcaseFilter('male')}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  showcaseFilter === 'male'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-cyan-300 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 fill-cyan-300" />
                Erkek ({communityFrames.filter((f) => f.gender === 'male').length})
              </button>
              <button
                onClick={() => setShowcaseFilter('popular')}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  showcaseFilter === 'popular'
                    ? 'bg-amber-500 text-amber-950 font-bold'
                    : 'bg-white/5 text-amber-300 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 fill-amber-400" />
                Popüler & Trend
              </button>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayedShowcaseFrames.map((frame) => {
                const isOwned = user.ownedProductIds.includes(frame.id);
                const isEquipped = user.equippedFrameId === frame.id;
                return (
                  <div
                    key={frame.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-b from-[#121626] to-[#0c0f1c] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col group relative"
                  >
                    {/* Creator Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-white">
                          @{frame.createdBy}
                        </span>
                        <span className="text-[9px] text-indigo-400 font-mono">
                          {frame.creatorTag}
                        </span>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => onToggleLikeCommunityFrame(frame.id)}
                        className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          frame.isLiked
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-bold'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:text-pink-300'
                        }`}
                      >
                        <Heart
                          className={`w-2.5 h-2.5 ${frame.isLiked ? 'fill-pink-400 text-pink-400' : ''}`}
                        />
                        <span>{frame.likesCount || 0}</span>
                      </button>
                    </div>

                    {/* Frame Miniature Render */}
                    <div className="my-2 flex items-center justify-center">
                      <FrameRenderer
                        frameType={frame.id}
                        frameStyle={frame.frameStyle}
                        avatarUrl={user.avatarUrl}
                        size="sm"
                        isAnimated={true}
                      />
                    </div>

                    {/* Name & Prompt */}
                    <div className="mt-1 flex-1">
                      <div className="text-xs font-bold text-white truncate" title={frame.name}>
                        {frame.name}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 italic">
                        &ldquo;{frame.prompt || frame.description}&rdquo;
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{frame.price} Coin</span>
                      </div>

                      {isEquipped ? (
                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Kuşanıldı
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => onBuyAndEquip(frame)}
                          className="text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Kuşan
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(frame)}
                          className="text-[10px] font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
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
          <div className="mt-4 flex-1 overflow-y-auto pr-1">
            {myCreations.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 p-6">
                <Wand2 className="w-8 h-8 text-indigo-400/60 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-300">
                  Henüz AI ile oluşturduğun bir çerçeve yok.
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  &ldquo;Yeni Çerçeve Tasarla&rdquo; sekmesinden ilk eserini üreterek topluluk vitrinine ekleyebilirsin!
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Şimdi Tasarla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {myCreations.map((frame) => {
                  const isEquipped = user.equippedFrameId === frame.id;
                  return (
                    <div
                      key={frame.id}
                      className="p-3.5 rounded-2xl bg-[#121626] border border-indigo-500/30 flex flex-col"
                    >
                      <div className="my-2 flex items-center justify-center">
                        <FrameRenderer
                          frameType={frame.id}
                          frameStyle={frame.frameStyle}
                          avatarUrl={user.avatarUrl}
                          size="sm"
                          isAnimated={true}
                        />
                      </div>
                      <div className="text-xs font-bold text-white truncate">{frame.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                        {frame.prompt || frame.description}
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                          {frame.likesCount || 0} Beğeni
                        </span>
                        <button
                          onClick={() => onBuyAndEquip(frame)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
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
    </div>
  );
};
