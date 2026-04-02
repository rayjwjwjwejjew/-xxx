import { Sparkles, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

import type { GameState, PlayerState } from '@/types';

interface GameHUDProps {
  currentPlayer: PlayerState | null;
  gameState: GameState;
}

const statusLabelMap: Record<GameState['status'], string> = {
  setup: '等待创建玩家',
  idle: '等待掷骰',
  rolling: '骰子滚动中',
  moving: '棋子移动中',
  choice: '等待玩家选择',
  resolving: '正在结算',
  finished: '本局结束',
};

export function GameHUD({ currentPlayer, gameState }: GameHUDProps) {
  return (
    <section className="clean-panel flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="panel-kicker">当前回合</div>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-800">{currentPlayer?.name ?? '等待玩家设置'}</h2>
          {currentPlayer ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
              <Sparkles size={14} /> {currentPlayer.level} · {currentPlayer.points} 分
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-500">第 {gameState.round} 轮 / {gameState.config.maxRounds} 轮 · {statusLabelMap[gameState.status]}</p>
      </div>

      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <MetricCard label="当前骰子" value={gameState.diceValue === null ? '—' : `${gameState.diceValue}`} accent="amber" />
        <MetricCard label="当前状态" value={statusLabelMap[gameState.status]} accent="sky" />
        <MetricCard
          label="暂时领先"
          value={getLeaderLabel(gameState.players)}
          accent="violet"
          icon={<Trophy size={15} />}
        />
      </div>
    </section>
  );
}

function MetricCard({ label, value, accent, icon }: { label: string; value: string; accent: 'amber' | 'sky' | 'violet'; icon?: ReactNode }) {
  const accentClass = {
    amber: 'from-amber-100 to-orange-50 text-amber-600',
    sky: 'from-sky-100 to-blue-50 text-sky-600',
    violet: 'from-violet-100 to-fuchsia-50 text-violet-600',
  }[accent];

  return (
    <div className="rounded-[16px] border border-white/70 bg-white/72 px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={['mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold', accentClass].join(' ')}>
        {icon}
        {value}
      </p>
    </div>
  );
}

function getLeaderLabel(players: PlayerState[]) {
  const leader = [...players].sort((left, right) => right.points - left.points)[0];
  return leader ? `${leader.name} · ${leader.points} 分` : '暂无';
}
