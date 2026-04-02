import { AlertTriangle, BookOpen, Medal, Star } from 'lucide-react';
import type { ReactNode } from 'react';

import { PlayerToken } from '@/components/play/PlayerToken';
import type { PlayerState } from '@/types';

interface PlayerSidebarProps {
  currentPlayerId: string | null;
  players: PlayerState[];
}

export function PlayerSidebar({ currentPlayerId, players }: PlayerSidebarProps) {
  return (
    <aside className="clean-panel flex h-full w-full flex-col overflow-hidden xl:w-[290px] xl:min-w-[290px]">
      <div className="px-5 py-4">
        <div className="panel-kicker">玩家状态</div>
        <h2 className="panel-heading">积分、等级与成长修复情况</h2>
      </div>
      <div className="soft-divider mx-5" />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {players.map((player) => {
          const penaltyCount = player.penalties.reduce((total, item) => total + item.remainingClearCount, 0);
          return (
            <div
              key={player.id}
              className={[
                'rounded-[18px] border border-white/80 bg-white/72 p-4 shadow-sm transition',
                player.id === currentPlayerId ? 'ring-2 ring-sky-200 shadow-[0_12px_22px_rgba(91,141,239,0.16)]' : '',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PlayerToken color={player.color} label={player.name} active={player.id === currentPlayerId} />
                  <div>
                    <p className="font-semibold text-slate-800">{player.name}</p>
                    <p className="text-xs text-slate-500">位置 #{player.position + 1}</p>
                  </div>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">{player.level}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <StatPill icon={<Medal size={13} />} label="积分" value={`${player.points}`} tone="sky" />
                <StatPill icon={<Star size={13} />} label="地产" value={`${player.ownedProperties.length}`} tone="amber" />
                <StatPill icon={<AlertTriangle size={13} />} label="T 状态" value={penaltyCount > 0 ? `${penaltyCount}` : '无'} tone={penaltyCount > 0 ? 'rose' : 'emerald'} />
                <StatPill icon={<BookOpen size={13} />} label="停留" value={player.skipTurns > 0 ? `${player.skipTurns} 回合` : '正常'} tone={player.skipTurns > 0 ? 'violet' : 'emerald'} />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function StatPill({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'sky' | 'amber' | 'rose' | 'emerald' | 'violet';
}) {
  const toneClass = {
    sky: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  }[tone];

  return (
    <div className="rounded-[14px] border border-white/70 bg-slate-50/90 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={['mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold', toneClass].join(' ')}>
        {icon}
        {value}
      </p>
    </div>
  );
}
