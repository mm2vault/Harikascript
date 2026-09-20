import React from 'react';
import { CheckCircle2, Gift, Coins, Sparkles } from 'lucide-react';
import { DailyTask } from '../types';

interface DailyTasksWidgetProps {
  tasks: DailyTask[];
  onClaimTask: (task: DailyTask) => void;
  onClaimAll: () => void;
}

export const DailyTasksWidget: React.FC<DailyTasksWidgetProps> = ({
  tasks,
  onClaimTask,
  onClaimAll
}) => {
  const allCompleted = tasks.every((t) => t.isCompleted);
  const hasUnclaimed = tasks.some((t) => t.isCompleted && !t.isClaimed);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#121124] via-[#0f111e] to-[#0c0e17] border border-indigo-500/25 p-4 sm:p-5 shadow-lg relative overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Günlük Görevler & Ücretsiz Coinler
            </h3>
            <p className="text-[11px] text-slate-400">
              Görevleri tamamla, anında ücretsiz coinleri hesabına ekle!
            </p>
          </div>
        </div>

        {hasUnclaimed && (
          <button
            onClick={onClaimAll}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tümünü Topla</span>
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tasks.map((task) => {
          const isDone = task.isCompleted;
          const isClaimed = task.isClaimed;

          return (
            <div
              key={task.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                isClaimed
                  ? 'bg-white/[0.02] border-white/5 opacity-60'
                  : isDone
                  ? 'bg-amber-500/[0.06] border-amber-500/30'
                  : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Coins className="w-3 h-3" />
                    +{task.reward}
                  </span>
                  <span>•</span>
                  <span>
                    {task.progress}/{task.target}
                  </span>
                </div>
              </div>

              <div>
                {isClaimed ? (
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-1 rounded-md bg-white/5">
                    Alındı
                  </span>
                ) : isDone ? (
                  <button
                    onClick={() => onClaimTask(task)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-[11px] transition-transform active:scale-95"
                  >
                    Topla
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium px-2 py-1">
                    Devam
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
