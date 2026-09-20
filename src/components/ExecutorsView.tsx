import React from 'react';
import { Download, CheckCircle2, ShieldAlert, Cpu, ExternalLink, HelpCircle } from 'lucide-react';
import { ExecutorItem } from '../types';

interface ExecutorsViewProps {
  executors: ExecutorItem[];
}

export const ExecutorsView: React.FC<ExecutorsViewProps> = ({ executors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {executors.map((exec) => (
          <div
            key={exec.id}
            id={`executor-${exec.id}`}
            className="rounded-3xl bg-[#0c0e17] border border-white/[0.08] hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {exec.badge}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {exec.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading">{exec.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">{exec.platform}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                    {exec.unc}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{exec.level}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#131624] p-3 rounded-xl border border-white/5 mt-2">
                {exec.desc}
              </p>

              {/* Features */}
              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Öne Çıkan Özellikler
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {exec.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs text-slate-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guide Accordion / Preview */}
              <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nasıl Kullanılır?</span>
                </span>
                <div className="space-y-1 text-xs text-slate-400 leading-relaxed font-sans">
                  {exec.guide.map((step, idx) => (
                    <div key={idx}>{step}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Sürüm: {exec.version}</span>
              <a
                href={exec.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resmi İndir</span>
                <ExternalLink className="w-3 h-3 text-indigo-200" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
