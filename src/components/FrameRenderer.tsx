import React from 'react';
import { User } from 'lucide-react';
import { CosmeticFrameType, FrameStyleConfig } from '../types';
import { ALL_FRAMES } from '../data/framesCatalog';

interface FrameRendererProps {
  frameType?: CosmeticFrameType | string | null;
  frameStyle?: FrameStyleConfig;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({
  frameType = 'gothic_black',
  frameStyle,
  avatarUrl,
  size = 'md',
  isAnimated = true,
  className = ''
}) => {
  // Dimension mapping
  const sizeMap = {
    xs: { container: 40, avatar: 28 },
    sm: { container: 90, avatar: 52 },
    md: { container: 180, avatar: 96 },
    lg: { container: 240, avatar: 130 },
    xl: { container: 300, avatar: 165 },
  };

  const { container, avatar } = sizeMap[size];

  // Check catalog for matched frame style or use provided frameStyle
  const catalogFrame = ALL_FRAMES.find(
    (f) => f.id === frameType || f.frameType === frameType
  );
  const styleConfig: FrameStyleConfig | undefined = frameStyle || catalogFrame?.frameStyle;
  const uniqueId = typeof frameType === 'string' && frameType.length > 0 ? frameType.replace(/[^a-zA-Z0-9-_]/g, '_') : 'custom';

  const animClass = isAnimated && styleConfig?.animationEffect
    ? styleConfig.animationEffect === 'flame'
      ? 'animate-flame'
      : styleConfig.animationEffect === 'glitch'
      ? 'animate-cyber-pulse'
      : styleConfig.animationEffect === 'spin'
      ? 'animate-spin-slow'
      : styleConfig.animationEffect === 'aurora'
      ? 'animate-aurora'
      : styleConfig.animationEffect === 'rainbow'
      ? 'animate-rainbow'
      : styleConfig.animationEffect === 'shimmer'
      ? 'animate-radiance-shimmer'
      : styleConfig.animationEffect === 'vortex'
      ? 'animate-spin-slow'
      : 'animate-gothic-pulse'
    : '';

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: `${container}px`, height: `${container}px` }}
    >
      {/* ============================================================ */}
      {/* 0. LAYER: BACK AURA (Behind Avatar - Wings, Dragon, Flames)  */}
      {/* ============================================================ */}
      {styleConfig && (
        <div
          className={`absolute inset-0 pointer-events-none z-0 flex items-center justify-center ${animClass}`}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full overflow-visible"
            style={{
              filter: `drop-shadow(0 0 ${size === 'xs' ? '4px' : '10px'} ${styleConfig.glowColor})`
            }}
          >
            <defs>
              <linearGradient id={`backGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={styleConfig.primaryColor} />
                <stop offset="50%" stopColor={styleConfig.secondaryColor} />
                <stop offset="100%" stopColor={styleConfig.accentColor || styleConfig.primaryColor} />
              </linearGradient>
            </defs>

            {/* Back: Archangel Grand Wings */}
            {(styleConfig.ornament === 'wings' || styleConfig.ornament === 'angel') && (
              <g fill={`url(#backGrad-${uniqueId})`} stroke="#ffffff" strokeWidth="0.8" opacity="0.95">
                {/* Left Grand Wing */}
                <path d="M48 95 C25 80 10 55 5 28 C20 40 32 58 42 75 C26 50 18 35 12 18 C30 35 44 58 48 85 C32 60 26 44 22 28 C40 48 50 72 52 92 Z" />
                {/* Right Grand Wing */}
                <path d="M152 95 C175 80 190 55 195 28 C180 40 168 58 158 75 C174 50 182 35 188 18 C170 35 156 58 152 85 C168 60 174 44 178 28 C160 48 150 72 148 92 Z" />
                {/* Golden Divine Feathers */}
                <circle cx="18" cy="36" r="2" fill="#fef08a" />
                <circle cx="182" cy="36" r="2" fill="#fef08a" />
              </g>
            )}

            {/* Back: Demon Bat Wings */}
            {(styleConfig.ornament === 'demon_wings' || styleConfig.ornament === 'demon') && (
              <g fill={`url(#backGrad-${uniqueId})`} stroke="#000000" strokeWidth="1" opacity="0.9">
                <path d="M48 85 C22 65 8 40 2 15 C18 32 30 50 36 68 C22 45 16 32 10 18 C32 40 44 65 48 82 Z" />
                <path d="M152 85 C178 65 192 40 198 15 C182 32 170 50 164 68 C178 45 184 32 190 18 C168 40 156 65 152 82 Z" />
              </g>
            )}

            {/* Back: Coiling Dragon Body */}
            {(styleConfig.ornament === 'dragon' || styleConfig.ornament === 'ejderha') && (
              <g stroke={`url(#backGrad-${uniqueId})`} fill="none" strokeWidth="8" strokeLinecap="round" opacity="0.85">
                <path d="M30 140 C15 90 35 40 75 25 C120 10 165 30 175 75 C185 120 160 165 120 175 C85 185 45 165 35 140" strokeDasharray="6 3" />
              </g>
            )}

            {/* Back: Spectral Wolf Aura */}
            {(styleConfig.ornament === 'wolf' || styleConfig.ornament === 'kurt') && (
              <g opacity="0.4" fill={styleConfig.secondaryColor}>
                <circle cx="100" cy="100" r="74" fill="none" stroke={styleConfig.primaryColor} strokeWidth="1.5" strokeDasharray="4 8" />
                {/* Full Moon Glow */}
                <circle cx="100" cy="55" r="30" fill={styleConfig.glowColor} opacity="0.25" filter="blur(6px)" />
              </g>
            )}

            {/* Back: Surging Fire Aura */}
            {(styleConfig.ornament === 'flames' || styleConfig.borderType === 'fire_ring' || styleConfig.animationEffect === 'flame') && (
              <g fill={`url(#backGrad-${uniqueId})`} opacity="0.75">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M100 24 C94 36 106 42 100 52 C92 42 88 34 100 24 Z"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
              </g>
            )}

            {/* Back: Crackling Lightning Bolts */}
            {(styleConfig.ornament === 'lightning' || styleConfig.borderType === 'electric') && (
              <g stroke={styleConfig.accentColor || '#38bdf8'} strokeWidth="2" fill="none" opacity="0.9">
                <path d="M25 60 L40 75 L32 90 L50 110" />
                <path d="M175 60 L160 75 L168 90 L150 110" />
                <path d="M90 15 L100 30 L95 40 L105 52" />
              </g>
            )}

            {/* Back: Rose Brambles & Thorny Vines */}
            {(styleConfig.ornament === 'rose' || styleConfig.borderType === 'floral') && (
              <g stroke={styleConfig.secondaryColor} strokeWidth="2.5" fill="none" opacity="0.8">
                <circle cx="100" cy="100" r="62" strokeDasharray="12 6" />
                {/* Tiny thorns */}
                {[30, 75, 120, 165, 210, 255, 300, 345].map((deg) => (
                  <polygon
                    key={deg}
                    points="100,36 102,40 98,40"
                    fill={styleConfig.primaryColor}
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. CENTRAL AVATAR CIRCLE (Layer 10)                          */}
      {/* ============================================================ */}
      <div
        className="rounded-full overflow-hidden flex items-center justify-center bg-[#121522] z-10 transition-transform duration-300 relative border border-white/10 shadow-2xl"
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
          <div className="w-full h-full bg-[#161a2b] flex items-center justify-center text-slate-400">
            <User style={{ width: `${avatar * 0.5}px`, height: `${avatar * 0.5}px` }} />
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. LAYER: FRONT DECORATION (Layer 20 - Over Avatar Edges)     */}
      {/* ============================================================ */}
      {styleConfig && (
        <div
          className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${animClass}`}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full overflow-visible"
            style={{
              filter: `drop-shadow(0 0 ${size === 'xs' ? '3px' : '8px'} ${styleConfig.glowColor}) drop-shadow(0 0 ${size === 'xs' ? '6px' : '16px'} ${styleConfig.secondaryColor}66)`
            }}
          >
            <defs>
              <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={styleConfig.primaryColor} />
                <stop offset="50%" stopColor={styleConfig.secondaryColor} />
                <stop offset="100%" stopColor={styleConfig.accentColor || styleConfig.primaryColor} />
              </linearGradient>

              {/* Gold gradient for jewelry & crowns */}
              <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              {/* Fire gradient */}
              <linearGradient id={`fireGrad-${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>

            {/* Custom SVG Injection if provided by AI generator */}
            {styleConfig.customSvg && (
              <g dangerouslySetInnerHTML={{ __html: styleConfig.customSvg }} />
            )}

            {/* ================= BORDER RINGS ================= */}
            {styleConfig.borderType === 'dashed' ? (
              <circle
                cx="100"
                cy="100"
                r="55"
                fill="none"
                stroke={`url(#grad-${uniqueId})`}
                strokeWidth="3.5"
                strokeDasharray="6 6"
              />
            ) : styleConfig.borderType === 'double' ? (
              <>
                <circle
                  cx="100"
                  cy="100"
                  r="53"
                  fill="none"
                  stroke={`url(#grad-${uniqueId})`}
                  strokeWidth="2.5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="59"
                  fill="none"
                  stroke={styleConfig.secondaryColor}
                  strokeWidth="1.4"
                  strokeDasharray="4 4"
                  opacity="0.85"
                />
              </>
            ) : styleConfig.borderType === 'cyber' ? (
              <>
                <circle
                  cx="100"
                  cy="100"
                  r="54"
                  fill="none"
                  stroke={`url(#grad-${uniqueId})`}
                  strokeWidth="3"
                />
                {/* Tech Bracket Corners */}
                <path d="M48 56 L42 56 L42 66" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M152 56 L158 56 L158 66" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M48 144 L42 144 L42 134" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M152 144 L158 144 L158 134" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Mini cyber nodes */}
                <circle cx="42" cy="56" r="2.5" fill={styleConfig.accentColor || '#38bdf8'} />
                <circle cx="158" cy="56" r="2.5" fill={styleConfig.accentColor || '#38bdf8'} />
                <circle cx="42" cy="144" r="2.5" fill={styleConfig.accentColor || '#38bdf8'} />
                <circle cx="158" cy="144" r="2.5" fill={styleConfig.accentColor || '#38bdf8'} />
              </>
            ) : styleConfig.borderType === 'runes' ? (
              <>
                <circle cx="100" cy="100" r="54" fill="none" stroke={`url(#grad-${uniqueId})`} strokeWidth="3" />
                <circle cx="100" cy="100" r="61" fill="none" stroke={styleConfig.secondaryColor} strokeWidth="1" strokeDasharray="1 8" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <text
                    key={deg}
                    x="100"
                    y="42"
                    fill={styleConfig.accentColor || '#ffffff'}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${deg} 100 100)`}
                  >
                    ᚠ
                  </text>
                ))}
              </>
            ) : styleConfig.borderType === 'spikes' ? (
              <>
                <circle cx="100" cy="100" r="54" fill="none" stroke={`url(#grad-${uniqueId})`} strokeWidth="3.2" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <polygon
                    key={deg}
                    points="100,36 103,45 97,45"
                    fill={styleConfig.primaryColor}
                    stroke="#ffffff"
                    strokeWidth="0.4"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
              </>
            ) : styleConfig.borderType === 'spider_web' ? (
              <>
                {/* Spider-Man Web Ring Matrix */}
                <circle cx="100" cy="100" r="54" fill="none" stroke={`url(#grad-${uniqueId})`} strokeWidth="3" />
                <circle cx="100" cy="100" r="62" fill="none" stroke={styleConfig.secondaryColor} strokeWidth="1.2" opacity="0.8" />
                <circle cx="100" cy="100" r="48" fill="none" stroke={styleConfig.accentColor || '#ffffff'} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.8" />
                {/* Web Spoke Lines */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="100"
                    y1="44"
                    x2="100"
                    y2="64"
                    stroke={styleConfig.primaryColor}
                    strokeWidth="1.2"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
                {/* Web Connecting Threads */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <path
                    key={`arc-${deg}`}
                    d="M88 47 Q100 52 112 47"
                    fill="none"
                    stroke={styleConfig.accentColor || '#ffffff'}
                    strokeWidth="0.9"
                    opacity="0.9"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
              </>
            ) : (
              // Default Solid / Ornamental Ring
              <>
                <circle
                  cx="100"
                  cy="100"
                  r="55"
                  fill="none"
                  stroke={`url(#grad-${uniqueId})`}
                  strokeWidth="3.5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="61"
                  fill="none"
                  stroke={styleConfig.secondaryColor}
                  strokeWidth="1.2"
                  strokeDasharray="3 8"
                  opacity="0.8"
                />
              </>
            )}

            {/* ================= TOP ORNAMENTS ================= */}

            {/* TOP: Iconic Spider-Man / Spider Mask & Eyes */}
            {(styleConfig.ornament === 'spiderman' ||
              styleConfig.ornament === 'spider' ||
              styleConfig.ornament === 'orumcek' ||
              styleConfig.ornament === 'venom') && (
              <g id="spiderman-mask-top">
                {/* Spider Head Web Shield */}
                <path
                  d="M80 44 C80 20 120 20 120 44 C112 50 88 50 80 44 Z"
                  fill="#0f172a"
                  stroke={`url(#grad-${uniqueId})`}
                  strokeWidth="1.5"
                />
                {/* Web Lines on Head */}
                <line x1="100" y1="20" x2="100" y2="46" stroke="#dc2626" strokeWidth="1.2" />
                <line x1="88" y1="26" x2="112" y2="40" stroke="#dc2626" strokeWidth="1" />
                <line x1="112" y1="26" x2="88" y2="40" stroke="#dc2626" strokeWidth="1" />
                
                {/* Left Spidey Eye (Angular comic shape with black contour) */}
                <path
                  d="M98 34 C94 25 84 27 86 36 C87 40 98 42 98 34 Z"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="2.4"
                  style={{ filter: 'drop-shadow(0 0 3px #ffffff)' }}
                />
                {/* Right Spidey Eye */}
                <path
                  d="M102 34 C106 25 116 27 114 36 C113 40 102 42 102 34 Z"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="2.4"
                  style={{ filter: 'drop-shadow(0 0 3px #ffffff)' }}
                />

                {/* Hanging Silk Webs */}
                <line x1="80" y1="24" x2="68" y2="14" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                <line x1="120" y1="24" x2="132" y2="14" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                <path d="M70 16 Q100 24 130 16" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
              </g>
            )}

            {/* TOP: Dark Knight Batman Cowl */}
            {(styleConfig.ornament === 'batman' || styleConfig.ornament === 'yarasa') && (
              <g id="batman-top">
                <polygon points="76,46 70,12 88,32" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                <polygon points="124,46 130,12 112,32" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                <path d="M82 32 C92 36 108 36 118 32 C116 44 84 44 82 32 Z" fill="#1e293b" />
                <circle cx="92" cy="36" r="1.5" fill="#facc15" />
                <circle cx="108" cy="36" r="1.5" fill="#facc15" />
              </g>
            )}

            {/* TOP: Iron Man Mark Helmet */}
            {(styleConfig.ornament === 'ironman' || styleConfig.ornament === 'demir_adam') && (
              <g id="ironman-top">
                <path d="M84 46 L90 20 L110 20 L116 46 Z" fill="#b91c1c" stroke="#facc15" strokeWidth="1" />
                <polygon points="90,26 110,26 106,42 94,42" fill="#facc15" />
                <line x1="92" y1="34" x2="98" y2="34" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="102" y1="34" x2="108" y2="34" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* TOP: Detailed Dragon Head */}
            {(styleConfig.ornament === 'dragon' || styleConfig.ornament === 'ejderha') && (
              <g id="dragon-head">
                {/* Fierce Horns */}
                <path d="M85 36 C80 18 68 8 55 5 C66 18 75 28 82 38 Z" fill={`url(#grad-${uniqueId})`} stroke="#000000" strokeWidth="0.8" />
                <path d="M115 36 C120 18 132 8 145 5 C134 18 125 28 118 38 Z" fill={`url(#grad-${uniqueId})`} stroke="#000000" strokeWidth="0.8" />
                {/* Central Dragon Crown Snout */}
                <polygon points="100,12 114,28 124,30 114,42 100,36 86,42 76,30 86,28" fill={`url(#grad-${uniqueId})`} stroke="#1e1b4b" strokeWidth="1" />
                {/* Glowing Dragon Eyes */}
                <polygon points="90,32 94,30 96,33 92,34" fill="#facc15" />
                <polygon points="110,32 106,30 104,33 108,34" fill="#facc15" />
                {/* Fire Breath Jets */}
                <path d="M96 40 C92 48 94 54 90 58 C96 52 98 46 96 40 Z" fill="#ef4444" />
                <path d="M104 40 C108 48 106 54 110 58 C104 52 102 46 104 40 Z" fill="#ef4444" />
              </g>
            )}

            {/* TOP: Wolf Head / Spirit */}
            {(styleConfig.ornament === 'wolf' || styleConfig.ornament === 'kurt') && (
              <g id="wolf-head">
                {/* Wolf Ears */}
                <polygon points="76,46 64,16 88,32" fill={`url(#grad-${uniqueId})`} stroke="#ffffff" strokeWidth="1" />
                <polygon points="76,42 68,22 84,32" fill={styleConfig.secondaryColor} />
                <polygon points="124,46 136,16 112,32" fill={`url(#grad-${uniqueId})`} stroke="#ffffff" strokeWidth="1" />
                <polygon points="124,42 132,22 116,32" fill={styleConfig.secondaryColor} />
                {/* Central Crest & Piercing Eyes */}
                <polygon points="100,24 108,38 100,46 92,38" fill={`url(#grad-${uniqueId})`} />
                <circle cx="94" cy="38" r="2.5" fill="#38bdf8" />
                <circle cx="106" cy="38" r="2.5" fill="#38bdf8" />
              </g>
            )}

            {/* TOP: Fluffy Kawaii Neko Cat Ears with Bell & Ribbons */}
            {(styleConfig.ornament === 'cat_ears' || styleConfig.ornament === 'kedi' || styleConfig.ornament === 'neko') && (
              <g id="kawaii-cat-ears">
                {/* Left Fluffy Ear */}
                <polygon points="66,52 50,18 84,36" fill={styleConfig.primaryColor} stroke="#ffffff" strokeWidth="1.2" />
                <polygon points="68,48 56,26 80,36" fill="#fbcfe8" />
                {/* Left Ear Bell */}
                <circle cx="58" cy="46" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
                {/* Right Fluffy Ear */}
                <polygon points="134,52 150,18 116,36" fill={styleConfig.primaryColor} stroke="#ffffff" strokeWidth="1.2" />
                <polygon points="132,48 144,26 120,36" fill="#fbcfe8" />
                {/* Right Ear Bell */}
                <circle cx="142" cy="46" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
              </g>
            )}

            {/* TOP: Kitsune Fox Mask / Ears */}
            {(styleConfig.ornament === 'kitsune' || styleConfig.ornament === 'tilki') && (
              <g id="kitsune-mask">
                <polygon points="72,48 58,16 88,34" fill="#ffffff" stroke="#ef4444" strokeWidth="1.2" />
                <polygon points="72,44 64,22 84,34" fill="#fca5a5" />
                <polygon points="128,48 142,16 112,34" fill="#ffffff" stroke="#ef4444" strokeWidth="1.2" />
                <polygon points="128,44 136,22 116,34" fill="#fca5a5" />
                {/* Sacred Red Mark */}
                <path d="M100 22 C96 30 96 36 100 42 C104 36 104 30 100 22 Z" fill="#ef4444" />
              </g>
            )}

            {/* TOP: Demon / Succubus Horns */}
            {(styleConfig.ornament === 'horns' || styleConfig.ornament === 'seytan' || styleConfig.ornament === 'demon') && (
              <g id="demon-horns">
                {/* Left Horn */}
                <path d="M72 54 C62 35 50 18 36 12 C48 24 60 34 76 48 Z" fill={`url(#grad-${uniqueId})`} stroke="#000000" strokeWidth="0.8" />
                {/* Right Horn */}
                <path d="M128 54 C138 35 150 18 164 12 C152 24 140 34 124 48 Z" fill={`url(#grad-${uniqueId})`} stroke="#000000" strokeWidth="0.8" />
                {/* Crimson Horn Tips */}
                <circle cx="36" cy="12" r="2.5" fill="#ef4444" />
                <circle cx="164" cy="12" r="2.5" fill="#ef4444" />
              </g>
            )}

            {/* TOP: Ornate Imperial Crown */}
            {(styleConfig.ornament === 'crown' || styleConfig.ornament === 'tac' || styleConfig.ornament === 'kral') && (
              <g id="imperial-crown" fill={`url(#goldGrad-${uniqueId})`} stroke="#ffffff" strokeWidth="0.8">
                <polygon points="72,44 78,24 88,38 100,16 112,38 122,24 128,44" />
                <circle cx="100" cy="14" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.6" />
                <circle cx="78" cy="22" r="2.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />
                <circle cx="122" cy="22" r="2.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />
                {/* Base Band with Gems */}
                <rect x="74" y="42" width="52" height="6" rx="2" fill="#d97706" />
                <circle cx="86" cy="45" r="1.5" fill="#ffffff" />
                <circle cx="100" cy="45" r="2" fill="#ef4444" />
                <circle cx="114" cy="45" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* TOP: Celestial Angel Halo */}
            {(styleConfig.ornament === 'halo' || styleConfig.ornament === 'melek' || styleConfig.ornament === 'angel') && (
              <g id="angel-halo">
                <ellipse cx="100" cy="28" rx="30" ry="8" fill="none" stroke={`url(#goldGrad-${uniqueId})`} strokeWidth="3.5" style={{ filter: 'drop-shadow(0 0 8px #fef08a)' }} />
                <ellipse cx="100" cy="28" rx="30" ry="8" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" />
                {/* Sparkles around halo */}
                <circle cx="68" cy="28" r="2" fill="#ffffff" />
                <circle cx="132" cy="28" r="2" fill="#ffffff" />
                <circle cx="100" cy="18" r="2.5" fill="#fef08a" />
              </g>
            )}

            {/* TOP: Gothic Grim Reaper Skull */}
            {(styleConfig.ornament === 'skull' || styleConfig.ornament === 'kurukafa' || styleConfig.ornament === 'reaper') && (
              <g id="gothic-skull">
                {/* Hood / Cowl */}
                <path d="M84 46 C80 24 100 16 100 16 C100 16 120 24 116 46 Z" fill="#0f172a" stroke={`url(#grad-${uniqueId})`} strokeWidth="1.2" />
                {/* Skull Face */}
                <circle cx="100" cy="34" r="8.5" fill="#e2e8f0" stroke="#000000" strokeWidth="0.6" />
                <rect x="96" y="38" width="8" height="6" rx="1.5" fill="#cbd5e1" stroke="#000000" strokeWidth="0.5" />
                {/* Glowing Sockets */}
                <circle cx="97" cy="33" r="2" fill="#22c55e" />
                <circle cx="103" cy="33" r="2" fill="#22c55e" />
              </g>
            )}

            {/* TOP: Cyber Visor & HUD Display */}
            {(styleConfig.ornament === 'cyber' || styleConfig.ornament === 'visor' || styleConfig.borderType === 'cyber') && (
              <g id="cyber-visor">
                <path d="M72 44 L100 38 L128 44 L120 50 L100 46 L80 50 Z" fill={`url(#grad-${uniqueId})`} stroke="#06b6d4" strokeWidth="1" />
                <line x1="84" y1="46" x2="116" y2="46" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="100" cy="38" r="2" fill="#a855f7" />
              </g>
            )}

            {/* TOP: Crimson Velvet Rose Blossom */}
            {(styleConfig.ornament === 'rose' || styleConfig.ornament === 'gul') && (
              <g id="crimson-rose">
                <circle cx="100" cy="36" r="9" fill="#991b1b" stroke="#f43f5e" strokeWidth="1" />
                <path d="M96 34 C98 30 102 30 104 34 C104 38 96 38 96 34 Z" fill="#e11d48" />
                <path d="M94 38 C97 42 103 42 106 38" stroke="#ffffff" strokeWidth="0.8" fill="none" />
                {/* Green Leaves */}
                <polygon points="90,40 82,36 86,44" fill="#15803d" />
                <polygon points="110,40 118,36 114,44" fill="#15803d" />
              </g>
            )}

            {/* TOP: Japanese Cherry Blossom (Sakura) */}
            {(styleConfig.ornament === 'sakura' || styleConfig.ornament === 'cicek') && (
              <g id="sakura-top" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="0.8">
                {[0, 72, 144, 216, 288].map((deg) => (
                  <circle key={deg} cx="100" cy="32" r="4.5" transform={`rotate(${deg} 100 36)`} />
                ))}
                <circle cx="100" cy="36" r="2.5" fill="#f43f5e" />
              </g>
            )}

            {/* TOP: Stained-Glass Butterfly */}
            {(styleConfig.ornament === 'butterfly' || styleConfig.ornament === 'kelebek') && (
              <g id="butterfly-top" fill={`url(#grad-${uniqueId})`} stroke="#ffffff" strokeWidth="0.8">
                {/* Left Upper Wing */}
                <path d="M100 38 C88 24 74 28 80 44 C86 52 100 48 100 48 Z" />
                {/* Right Upper Wing */}
                <path d="M100 38 C112 24 126 28 120 44 C114 52 100 48 100 48 Z" />
                <circle cx="100" cy="42" r="2" fill="#ffffff" />
              </g>
            )}

            {/* TOP: Floating Love Hearts */}
            {(styleConfig.ornament === 'hearts' || styleConfig.ornament === 'kalp') && (
              <g id="hearts-top" fill={styleConfig.primaryColor} stroke="#ffffff" strokeWidth="0.8">
                <path d="M100 34 C94 24 82 26 82 36 C82 46 100 58 100 58 C100 58 118 46 118 36 C118 26 106 24 100 34 Z" />
                <circle cx="95" cy="32" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* TOP: Constellation Stars */}
            {(styleConfig.ornament === 'stars' || styleConfig.ornament === 'yildiz') && (
              <g id="stars-top" fill={styleConfig.accentColor || '#ffffff'}>
                {[0, 72, 144, 216, 288].map((deg) => (
                  <polygon
                    key={deg}
                    points="100,24 102,32 108,32 103,36 105,42 100,38 95,42 97,36 92,32 98,32"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
              </g>
            )}

            {/* ================= BOTTOM ORNAMENTS ================= */}

            {/* BOTTOM: Adorable Kitten Paws hanging over avatar rim */}
            {(styleConfig.bottomOrnament === 'paws' ||
              styleConfig.ornament === 'cat_ears' ||
              styleConfig.ornament === 'kedi' ||
              styleConfig.ornament === 'neko') && (
              <g id="kitten-paws">
                {/* Left Paw */}
                <ellipse cx="78" cy="144" rx="8" ry="6" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
                {/* Pink Toe Beans */}
                <ellipse cx="78" cy="145" rx="3.5" ry="2.5" fill="#f472b6" />
                <circle cx="73" cy="141" r="1.2" fill="#f472b6" />
                <circle cx="78" cy="140" r="1.2" fill="#f472b6" />
                <circle cx="83" cy="141" r="1.2" fill="#f472b6" />

                {/* Right Paw */}
                <ellipse cx="122" cy="144" rx="8" ry="6" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
                {/* Pink Toe Beans */}
                <ellipse cx="122" cy="145" rx="3.5" ry="2.5" fill="#f472b6" />
                <circle cx="117" cy="141" r="1.2" fill="#f472b6" />
                <circle cx="122" cy="140" r="1.2" fill="#f472b6" />
                <circle cx="127" cy="141" r="1.2" fill="#f472b6" />
              </g>
            )}

            {/* BOTTOM: Iconic Spider Emblem with Legs & Hanging Web */}
            {(styleConfig.bottomOrnament === 'spider_emblem' ||
              styleConfig.bottomOrnament === 'spider' ||
              styleConfig.ornament === 'spiderman' ||
              styleConfig.ornament === 'spider' ||
              styleConfig.ornament === 'orumcek' ||
              styleConfig.ornament === 'venom') && (
              <g id="spider-emblem-bottom">
                {/* Spider Body */}
                <ellipse cx="100" cy="158" rx="4.5" ry="6.5" fill="#dc2626" stroke="#ffffff" strokeWidth="0.8" />
                <circle cx="100" cy="150" r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="0.8" />
                {/* 4 Left Spider Legs */}
                <path d="M96 149 L88 143 L80 149" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M96 153 L84 151 L78 159" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M96 157 L86 162 L80 170" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M96 161 L90 168 L86 176" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                {/* 4 Right Spider Legs */}
                <path d="M104 149 L112 143 L120 149" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M104 153 L116 151 L122 159" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M104 157 L114 162 L120 170" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M104 161 L110 168 L114 176" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
                {/* Hanging Silk Line */}
                <line x1="100" y1="165" x2="100" y2="178" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="2 2" />
                <circle cx="100" cy="179" r="1.8" fill="#ffffff" />
              </g>
            )}

            {/* BOTTOM: Dark Knight Batarang */}
            {(styleConfig.bottomOrnament === 'batarang' ||
              styleConfig.ornament === 'batman' ||
              styleConfig.ornament === 'yarasa') && (
              <g id="batarang-bottom" fill="#0f172a" stroke="#facc15" strokeWidth="1.2">
                <path d="M100 152 C90 146 76 142 70 148 C80 154 90 162 100 168 C110 162 120 154 130 148 C124 142 110 146 100 152 Z" />
                <circle cx="100" cy="158" r="2" fill="#facc15" />
              </g>
            )}

            {/* BOTTOM: Arc Reactor Core */}
            {(styleConfig.bottomOrnament === 'arc_reactor' ||
              styleConfig.ornament === 'ironman' ||
              styleConfig.ornament === 'demir_adam') && (
              <g id="arc-reactor-bottom">
                <circle cx="100" cy="156" r="10" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
                <circle cx="100" cy="156" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                <circle cx="100" cy="156" r="2.5" fill="#ffffff" />
              </g>
            )}

            {/* BOTTOM: Dual Crossed Katanas */}
            {(styleConfig.bottomOrnament === 'katana_crossed' ||
              styleConfig.ornament === 'katana' ||
              styleConfig.ornament === 'kilic' ||
              styleConfig.ornament === 'samuray') && (
              <g id="crossed-katanas">
                {/* Katana 1 (Left to Right) */}
                <line x1="60" y1="168" x2="140" y2="138" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <line x1="60" y1="168" x2="75" y2="162" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="76" cy="162" r="3" fill="#facc15" />

                {/* Katana 2 (Right to Left) */}
                <line x1="140" y1="168" x2="60" y2="138" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <line x1="140" y1="168" x2="125" y2="162" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="124" cy="162" r="3" fill="#facc15" />
              </g>
            )}

            {/* BOTTOM: Dragon Claws Gripping Rim */}
            {(styleConfig.bottomOrnament === 'dragon_claws' ||
              styleConfig.ornament === 'dragon' ||
              styleConfig.ornament === 'ejderha') && (
              <g id="dragon-claws" fill={`url(#grad-${uniqueId})`} stroke="#000000" strokeWidth="0.8">
                {/* Left Talon Trio */}
                <polygon points="72,148 70,140 76,145" />
                <polygon points="78,150 78,141 82,146" />
                <polygon points="84,149 86,141 88,146" />
                {/* Right Talon Trio */}
                <polygon points="128,148 130,140 124,145" />
                <polygon points="122,150 122,141 118,146" />
                <polygon points="116,149 114,141 112,146" />
              </g>
            )}

            {/* BOTTOM: Rose Bed / Floral Bouquet */}
            {(styleConfig.bottomOrnament === 'roses' ||
              styleConfig.ornament === 'rose' ||
              styleConfig.ornament === 'gul') && (
              <g id="rose-bed">
                <circle cx="100" cy="154" r="9" fill="#991b1b" stroke="#f43f5e" strokeWidth="0.8" />
                <circle cx="84" cy="150" r="7" fill="#be123c" stroke="#f43f5e" strokeWidth="0.6" />
                <circle cx="116" cy="150" r="7" fill="#be123c" stroke="#f43f5e" strokeWidth="0.6" />
                <polygon points="74,152 66,150 70,156" fill="#15803d" />
                <polygon points="126,152 134,150 130,156" fill="#15803d" />
              </g>
            )}

            {/* BOTTOM: Silk Ribbon Bow */}
            {(styleConfig.bottomOrnament === 'ribbon' ||
              styleConfig.ornament === 'hearts' ||
              styleConfig.ornament === 'ribbon') && (
              <g id="silk-ribbon" fill={styleConfig.primaryColor} stroke="#ffffff" strokeWidth="0.8">
                <polygon points="100,154 82,146 84,162" />
                <polygon points="100,154 118,146 116,162" />
                <circle cx="100" cy="154" r="4.5" fill="#ffffff" />
                {/* Ribbon tails */}
                <path d="M96 156 Q92 168 86 174" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" />
                <path d="M104 156 Q108 168 114 174" stroke={styleConfig.primaryColor} strokeWidth="3" fill="none" />
              </g>
            )}

            {/* BOTTOM: Roaring Fire Embers */}
            {(styleConfig.bottomOrnament === 'flames' ||
              styleConfig.ornament === 'flames' ||
              styleConfig.animationEffect === 'flame') && (
              <g id="flames-bottom" fill={`url(#fireGrad-${uniqueId})`}>
                <path d="M100 168 C94 150 106 144 100 132 C90 146 86 156 100 168 Z" />
                <path d="M82 162 C78 150 88 144 82 136 C74 146 72 152 82 162 Z" />
                <path d="M118 162 C122 150 112 144 118 136 C126 146 128 152 118 162 Z" />
              </g>
            )}

            {/* ================= FLOATING PARTICLES LAYER ================= */}
            {isAnimated && (
              <g id="particles-overlay" opacity="0.85">
                {/* Sparkles / Stardust */}
                <circle cx="50" cy="50" r="1.5" fill="#ffffff" className="animate-pulse" />
                <circle cx="150" cy="50" r="1.5" fill="#ffffff" className="animate-pulse" />
                <circle cx="45" cy="140" r="1.2" fill="#fef08a" className="animate-pulse" />
                <circle cx="155" cy="140" r="1.2" fill="#fef08a" className="animate-pulse" />
                <circle cx="100" cy="20" r="2" fill={styleConfig.accentColor || '#ffffff'} className="animate-ping" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. OPTIONAL FRAME IMAGE / GIF OVERLAY (If provided)          */}
      {/* ============================================================ */}
      {styleConfig?.frameImage && (
        <img
          src={styleConfig.frameImage}
          alt="Avatar decoration frame"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 select-none"
        />
      )}

      {/* Legacy Frame Fallbacks if no styleConfig provided */}
      {!styleConfig && frameType === 'gothic_black' && (
        <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center ${isAnimated ? 'animate-gothic-pulse' : ''}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}>
            <circle cx="100" cy="100" r="54" fill="none" stroke="#222736" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.6" />
            <path d="M100 24 C104 36 114 42 126 42 C114 48 108 58 106 70 C94 58 86 48 74 42 C86 42 96 36 100 24 Z" fill="#0e1118" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="100" cy="38" r="2.5" fill="#ffffff" />
          </svg>
        </div>
      )}
    </div>
  );
};
