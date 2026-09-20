import React from 'react';
import { User } from 'lucide-react';
import { CosmeticFrameType } from '../types';

interface FrameRendererProps {
  frameType?: CosmeticFrameType | string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({
  frameType = 'gothic_black',
  avatarUrl,
  size = 'md',
  isAnimated = true,
  className = ''
}) => {
  // Dimension mapping
  const sizeMap = {
    sm: { container: 90, avatar: 52 },
    md: { container: 180, avatar: 96 },
    lg: { container: 240, avatar: 130 },
    xl: { container: 300, avatar: 165 },
  };

  const { container, avatar } = sizeMap[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: `${container}px`, height: `${container}px` }}
    >
      {/* Central Avatar Circle */}
      <div
        className="rounded-full overflow-hidden flex items-center justify-center bg-[#151824] z-10 transition-transform duration-300 relative border border-white/5"
        style={{ width: `${avatar}px`, height: `${avatar}px` }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#181c28] flex items-center justify-center text-slate-500">
            <User style={{ width: `${avatar * 0.48}px`, height: `${avatar * 0.48}px` }} />
          </div>
        )}
      </div>

      {/* Frame 1: Gothic Black (Classic from screenshot) */}
      {frameType === 'gothic_black' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-gothic-pulse' : ''}`}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full overflow-visible"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4)) drop-shadow(0 0 20px rgba(160,175,255,0.25))'
            }}
          >
            <circle cx="100" cy="100" r="54" fill="none" stroke="#222736" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.6" />
            <path
              d="M100 24 C104 36 114 42 126 42 C114 48 108 58 106 70 C94 58 86 48 74 42 C86 42 96 36 100 24 Z"
              fill="#0e1118"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <path
              d="M100 176 C104 164 114 158 126 158 C114 152 108 142 106 130 C94 142 86 152 74 158 C86 158 96 164 100 176 Z"
              fill="#0e1118"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <path
              d="M24 100 C36 104 42 114 42 126 C48 114 58 108 70 106 C58 94 48 86 42 74 C42 86 36 96 24 100 Z"
              fill="#0e1118"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <path
              d="M176 100 C164 104 158 114 158 126 C152 114 142 108 130 106 C142 94 152 86 158 74 C158 86 164 96 176 100 Z"
              fill="#0e1118"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="38" r="2.5" fill="#ffffff" />
            <circle cx="100" cy="162" r="2.5" fill="#ffffff" />
            <circle cx="38" cy="100" r="2.5" fill="#ffffff" />
            <circle cx="162" cy="100" r="2.5" fill="#ffffff" />
          </svg>
        </div>
      )}

      {/* Frame 2: Radiance / Işıltı */}
      {frameType === 'radiance' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-radiance-shimmer' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="radGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="54" fill="none" stroke="url(#radGold)" strokeWidth="2.5" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + Math.cos(angle) * 58;
              const y1 = 100 + Math.sin(angle) * 58;
              const x2 = 100 + Math.cos(angle) * (i % 2 === 0 ? 74 : 66);
              const y2 = 100 + Math.sin(angle) * (i % 2 === 0 ? 74 : 66);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#radGold)"
                  strokeWidth={i % 2 === 0 ? '2' : '1.2'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Frame 3: Neon Ring / Halka */}
      {frameType === 'neon_ring' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-ring-float' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 8" opacity="0.8" />
            <circle cx="100" cy="46" r="3" fill="#38bdf8" />
            <circle cx="100" cy="154" r="3" fill="#38bdf8" />
            <circle cx="46" cy="100" r="3" fill="#38bdf8" />
            <circle cx="154" cy="100" r="3" fill="#38bdf8" />
          </svg>
        </div>
      )}

      {/* Frame 4: Cyber Hex */}
      {frameType === 'cyber_hex' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-spin-slow' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <polygon
              points="100,28 162,64 162,136 100,172 38,136 38,64"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }}
            />
            <polygon
              points="100,38 152,68 152,132 100,162 48,132 48,68"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.2"
              opacity="0.6"
            />
          </svg>
        </div>
      )}

      {/* Frame 5: Fire Aura */}
      {frameType === 'fire_aura' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-fire-pulse' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#f97316" strokeWidth="3" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 5" />
            <circle cx="100" cy="38" r="4" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
            <circle cx="155" cy="80" r="3" fill="#f97316" style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }} />
            <circle cx="45" cy="120" r="3" fill="#f97316" style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }} />
          </svg>
        </div>
      )}

      {/* Frame 6: Void Dragon */}
      {frameType === 'void_dragon' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-gothic-pulse' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#9333ea" strokeWidth="3" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="6 6" />
            <path
              d="M100,20 L108,36 L124,38 L112,50 L115,66 L100,58 L85,66 L88,50 L76,38 L92,36 Z"
              fill="#581c87"
              stroke="#c084fc"
              strokeWidth="1.2"
              transform="translate(0,-12)"
            />
          </svg>
        </div>
      )}

      {/* Frame 7: Cosmic Star */}
      {frameType === 'cosmic_star' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-radiance-shimmer' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#ec4899" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 4" />
            {[0, 90, 180, 270].map((deg) => (
              <polygon
                key={deg}
                points="100,28 104,36 112,40 104,44 100,52 96,44 88,40 96,36"
                fill="#f472b6"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Frame 8: Glitch Matrix */}
      {frameType === 'glitch_matrix' && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 4 2 4" />
            <rect x="42" y="96" width="16" height="3" fill="#4ade80" opacity="0.8" />
            <rect x="142" y="102" width="18" height="3" fill="#4ade80" opacity="0.8" />
            <rect x="96" y="42" width="8" height="10" fill="#22c55e" opacity="0.7" />
            <rect x="96" y="148" width="8" height="10" fill="#22c55e" opacity="0.7" />
          </svg>
        </div>
      )}

      {/* Frame 9: Aurora Borealis (Discord-Style) */}
      {frameType === 'aurora_borealis' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-cyan-400/90 ${
            isAnimated ? 'animate-aurora' : ''
          }`}
          style={{
            boxShadow: '0 0 16px rgba(34,211,238,0.7), inset 0 0 14px rgba(167,139,250,0.5)'
          }}
        />
      )}

      {/* Frame 10: Flame Burst */}
      {frameType === 'flame_burst' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-rose-500 ${
            isAnimated ? 'animate-flame' : ''
          }`}
          style={{
            boxShadow: '0 0 20px rgba(244,63,94,0.8), 0 0 35px rgba(251,146,60,0.6)'
          }}
        />
      )}

      {/* Frame 11: Lightning Shock */}
      {frameType === 'lightning_shock' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-sky-400 ${
            isAnimated ? 'animate-lightning' : ''
          }`}
          style={{
            boxShadow: '0 0 18px rgba(56,189,248,0.9), inset 0 0 10px rgba(125,211,252,0.6)'
          }}
        />
      )}

      {/* Frame 12: Rainbow Pulse (Spectrum) */}
      {frameType === 'rainbow_pulse' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-purple-400 ${
            isAnimated ? 'animate-rainbow' : ''
          }`}
          style={{
            boxShadow: '0 0 22px rgba(216,180,254,0.8), 0 0 40px rgba(147,197,253,0.4)'
          }}
        />
      )}

      {/* Frame 13: Void Portal */}
      {frameType === 'void_portal' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-violet-600 ${
            isAnimated ? 'animate-void' : ''
          }`}
          style={{
            boxShadow: '0 0 24px rgba(124,58,237,0.9), 0 0 45px rgba(30,27,75,0.9)'
          }}
        />
      )}

      {/* Frame 14: Gold Royale */}
      {frameType === 'gold_royale' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-amber-400 ${
            isAnimated ? 'animate-gold' : ''
          }`}
          style={{
            boxShadow: '0 0 20px rgba(245,158,11,0.85), inset 0 0 15px rgba(251,191,36,0.4)'
          }}
        />
      )}

      {/* Frame 15: Prism Cyber */}
      {frameType === 'prism_cyber' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full ${
            isAnimated ? 'animate-prism-spin' : ''
          }`}
          style={{
            border: '2px solid transparent',
            background: 'conic-gradient(from 0deg, #f472b6, #818cf8, #22d3ee, #f472b6) border-box',
            mask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
            boxShadow: '0 0 18px rgba(192,132,252,0.8)'
          }}
        />
      )}

      {/* Frame 16: Venom Toxic */}
      {frameType === 'venom_toxic' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-lime-400 ${
            isAnimated ? 'animate-venom' : ''
          }`}
          style={{
            boxShadow: '0 0 18px rgba(163,230,53,0.9), inset 0 0 12px rgba(34,197,94,0.3)'
          }}
        />
      )}

      {/* Frame 17: Sakura Blossom */}
      {frameType === 'sakura_blossom' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-pink-400/90 ${
            isAnimated ? 'animate-sakura' : ''
          }`}
          style={{
            boxShadow: '0 0 16px rgba(244,114,182,0.8), inset 0 0 10px rgba(251,207,232,0.5)'
          }}
        />
      )}

      {/* Frame 18: Cyber Holo */}
      {frameType === 'cyber_holo' && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 rounded-full border-2 border-dashed border-cyan-400 ${
            isAnimated ? 'animate-cyber-pulse' : ''
          }`}
          style={{
            boxShadow: '0 0 16px rgba(34,211,238,0.8), inset 0 0 8px rgba(34,211,238,0.3)'
          }}
        />
      )}
    </div>
  );
};
