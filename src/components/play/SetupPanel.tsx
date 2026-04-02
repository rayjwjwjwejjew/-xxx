import { Plus, Trash2 } from 'lucide-react';

import { theme } from '@/styles/theme';
import type { PlayerSetupInput } from '@/types';

interface SetupPanelProps {
  inputs: PlayerSetupInput[];
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onStart: () => void;
  onUpdatePlayer: (id: string, patch: Partial<PlayerSetupInput>) => void;
}

export function SetupPanel({ inputs, onAddPlayer, onRemovePlayer, onStart, onUpdatePlayer }: SetupPanelProps) {
  return (
    <section className="clean-panel mx-auto flex w-full max-w-[920px] flex-col overflow-hidden px-6 py-6">
      <div className="panel-kicker">本地热座开局</div>
      <h2 className="panel-heading">先设置 2 至 4 名玩家，再进入游玩模式</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        当前版本是同屏轮流操作。后续可继续扩展为房间制联机，但现在已经具备完整的一局流程、回合推进和日志结算。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {inputs.map((input, index) => (
          <div key={input.id} className="rounded-[20px] border border-white/80 bg-white/72 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">玩家 {index + 1}</p>
              {inputs.length > 2 ? (
                <button type="button" onClick={() => onRemovePlayer(input.id)} className="text-slate-400 transition hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="property-label">昵称</label>
                <input
                  className="property-input"
                  value={input.name}
                  maxLength={8}
                  onChange={(event) => onUpdatePlayer(input.id, { name: event.target.value })}
                />
              </div>
              <div>
                <label className="property-label">棋子颜色</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {theme.colors.playerTokens.map((color) => (
                    <button
                      key={`${input.id}-${color}`}
                      type="button"
                      onClick={() => onUpdatePlayer(input.id, { color })}
                      className={[
                        'h-9 w-9 rounded-full border-2 border-white shadow-sm transition',
                        input.color === color ? 'scale-110 ring-2 ring-sky-200' : 'hover:scale-105',
                      ].join(' ')}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAddPlayer}
          disabled={inputs.length >= 4}
          className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/78 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          添加玩家
        </button>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(91,141,239,0.22)] transition hover:-translate-y-0.5"
        >
          开始游玩
        </button>
      </div>
    </section>
  );
}
