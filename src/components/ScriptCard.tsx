import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Coins,
  ThumbsUp,
  Flame,
  Eye,
  Lock
} from 'lucide-react';
import { ScriptItem } from '../types';
import { FrameRenderer } from './FrameRenderer';
import { X } from 'lucide-react';

interface ScriptCardProps {
  script: ScriptItem;
  isUnlocked: boolean;
  userCoins: number;
  onOpenScript: (script: ScriptItem) => void;
  onQuickCopy: (script: ScriptItem) => void;
  onUnlockWithCoins: (script: ScriptItem) => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({
  script,
  isUnlocked,
  userCoins,
  onOpenScript,
  onQuickCopy,
  onUnlockWithCoins
}) => {
  const [copied, setCopied] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked && script.coinPrice > 0) {
      onUnlockWithCoins(script);
      return;
    }
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    onQuickCopy(script);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFree = script.coinPrice === 0 || isUnlocked;

  return (
    <div
      id={`script-card-${script.id}`}
      onClick={() => onOpenScript(script)}
      className="group cursor-pointer rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-indigo-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      {/* Top Banner & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {script.gameName}
            </span>
            {script.isKeyless && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                Keyless
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <span>★</span>
            <span>{script.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Script Title & Version */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 font-heading">
            {script.name}
          </h3>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">{script.version}</span>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {script.desc}
        </p>
        <button onClick={(e)=>{e.stopPropagation();setCreatorOpen(true)}} className="mt-3 flex items-center gap-2 text-left hover:bg-white/[0.03] rounded-xl p-1 -ml-1 transition-colors">
          <FrameRenderer frameType={script.creatorFrameId || 'none'} frameStyle={script.creatorFrameStyle} avatarUrl={script.creatorAvatarUrl || ''} size="xs" isAnimated={true}/>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500">Ekleyen</div>
            <div className="text-xs font-semibold text-slate-200 truncate">{script.creatorName || script.userName}</div>
          </div>
          {script.creatorTag && <span className="text-[9px] text-indigo-300 font-mono">{script.creatorTag}</span>}
        </button>
        {creatorOpen && (
          <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e)=>{e.stopPropagation();setCreatorOpen(false)}}>
            <div className="w-full max-w-sm rounded-3xl bg-[#0d1019] border border-white/10 p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="flex justify-end"><button onClick={()=>setCreatorOpen(false)} className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center"><X className="w-4 h-4"/></button></div>
              <div className="flex flex-col items-center text-center -mt-3">
                <FrameRenderer frameType={script.creatorFrameId || 'none'} frameStyle={script.creatorFrameStyle} avatarUrl={script.creatorAvatarUrl || ''} size="lg" isAnimated={true}/>
                <h3 className="mt-3 text-lg font-bold text-white">{script.creatorName || script.userName}</h3>
                {script.creatorTag&&<div className="text-xs text-indigo-300 font-mono mt-1">{script.creatorTag}</div>}
                <div className="mt-4 w-full rounded-2xl bg-white/[0.03] border border-white/5 p-3 text-left">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Paylaşılan içerik</div>
                  <div className="text-sm text-white font-semibold mt-1">{script.name}</div>
                  <div className="text-xs text-slate-400 mt-1">Bu scripti bu profil ekledi.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {script.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/5 whitespace-nowrap"
            >
              {feat}
            </span>
          ))}
          {script.features.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/[0.02] text-slate-500">
              +{script.features.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Bar: Stats & Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">%{Math.round((script.workingVotes / (script.workingVotes + script.patchedVotes)) * 100)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{(script.views / 1000).toFixed(0)}k</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFree ? (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="Kodu Kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnlockWithCoins(script);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Lock className="w-3 h-3" />
              <span>{script.coinPrice} Coin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
