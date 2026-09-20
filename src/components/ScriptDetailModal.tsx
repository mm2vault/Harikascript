import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  FileCode,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Lock,
  Coins
} from 'lucide-react';
import { ScriptItem } from '../types';

interface ScriptDetailModalProps {
  script: ScriptItem | null;
  isOpen: boolean;
  isUnlocked: boolean;
  userCoins: number;
  onClose: () => void;
  onCopy: (script: ScriptItem) => void;
  onUnlock: (script: ScriptItem) => void;
}

export const ScriptDetailModal: React.FC<ScriptDetailModalProps> = ({
  script,
  isOpen,
  isUnlocked,
  userCoins,
  onClose,
  onCopy,
  onUnlock
}) => {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  if (!isOpen || !script) return null;

  const isFree = script.coinPrice === 0 || isUnlocked;

  const handleCopyCode = () => {
    if (!isFree) {
      onUnlock(script);
      return;
    }
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    onCopy(script);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadLua = () => {
    if (!isFree) {
      onUnlock(script);
      return;
    }
    const blob = new Blob([script.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${script.name.replace(/[^a-zA-Z0-9]/g, '_')}.lua`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="script-detail-dialog"
        className="w-full max-w-2xl rounded-3xl bg-[#0d101a] border border-white/10 p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                {script.gameName}
              </span>
              {script.isKeyless && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Keyless (Anahtarsız)
                </span>
              )}
              <span className="text-xs text-slate-500 font-mono">v{script.version}</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">{script.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed bg-[#131625] p-3.5 rounded-2xl border border-white/5">
            {script.desc}
          </p>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Özellikler & Fonksiyonlar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {script.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-200 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.04]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Executors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Desteklenen Executorlar
            </h4>
            <div className="flex flex-wrap gap-2">
              {script.executors.map((exec, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {exec}
                </span>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Lua Loadstring Kodu</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoted('up')}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                    voted === 'up'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-emerald-300'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Çalışıyor ({script.workingVotes + (voted === 'up' ? 1 : 0)})</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl bg-[#090b12] border border-white/10 p-3.5 font-mono text-xs text-indigo-200 overflow-x-auto shadow-inner">
              {isFree ? (
                <pre className="whitespace-pre-wrap break-all select-all font-mono leading-relaxed">
                  {script.code}
                </pre>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <Lock className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-sm font-bold text-white">Bu Script Kilitli</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Bu VIP scripti açmak için {script.coinPrice} coin harcayabilirsin.
                  </p>
                  <button
                    onClick={() => onUnlock(script)}
                    className="mt-3.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Coins className="w-4 h-4" />
                    <span>{script.coinPrice} Coin ile Aç</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Yükleyen: <span className="text-slate-300 font-semibold">{script.userName}</span>
          </div>

          <div className="flex items-center gap-2">
            {isFree ? (
              <>
                <button
                  onClick={handleDownloadLua}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
                  title="Lua Dosyası İndir"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.lua İndir</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => onUnlock(script)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>{script.coinPrice} Coin ile Kilidi Aç</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
