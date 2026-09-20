import React from 'react';
import { Gamepad2, ArrowUpRight, Code2, Users } from 'lucide-react';
import { GameItem } from '../types';

interface GamesViewProps {
  games: GameItem[];
  onSelectGame: (gameId: string) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ games, onSelectGame }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => (
          <div
            key={game.id}
            id={`game-card-${game.id}`}
            onClick={() => onSelectGame(game.id)}
            className="group cursor-pointer rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-indigo-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-[#151824]">
                <img
                  src={game.image}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent" />
                
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 border border-white/10 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-400" />
                  {game.activePlayers}
                </span>

                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-semibold text-slate-300">
                  {game.genre}
                </span>
              </div>

              {/* Title & Dev */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors font-heading">
                  {game.name}
                </h3>
                <span className="text-[11px] text-slate-500">{game.developer}</span>
              </div>

              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {game.desc}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>{game.scriptCount} Script Mevcut</span>
              </div>

              <a
                href={game.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Roblox Sayfasını Aç"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
