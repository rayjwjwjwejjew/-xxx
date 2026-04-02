import { Dices, SkipForward, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { GameState } from '@/types';

interface DicePanelProps {
  canRoll: boolean;
  gameState: GameState;
  onRollDice: () => void;
}

export function DicePanel({ canRoll, gameState, onRollDice }: DicePanelProps) {
  const [displayValue, setDisplayValue] = useState<number>(1);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    if (gameState.status !== 'rolling') {
      setDisplayValue(gameState.diceValue ?? displayValue);
      setIsSettled(gameState.diceValue !== null && gameState.status !== 'idle');
      return undefined;
    }

    setIsSettled(false);
    const interval = window.setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 88);

    return () => window.clearInterval(interval);
  }, [displayValue, gameState.diceValue, gameState.status]);

  const statusCopy = useMemo(() => {
    if (gameState.status === 'rolling') return '骰子正在翻滚，系统将自动锁定本次结果。';
    if (gameState.status === 'moving') return '棋子正在按投掷结果逐格前进。';
    if (gameState.status === 'choice') return '当前已经落点，请完成本次事件或认领选择。';
    if (gameState.status === 'resolving') return '系统正在结算回合结果，请稍候。';
    return '点击按钮掷骰，系统会自动完成移动与结算。';
  }, [gameState.status]);

  return (
    <section className="clean-panel flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="panel-kicker">操作区</div>
        <h2 className="panel-heading">当前动作：{gameState.lastActionSummary ?? '等待操作'}</h2>
        <p className="mt-2 text-sm text-slate-500">{statusCopy}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <div className="dice-stage rounded-[22px] border border-white/80 bg-gradient-to-br from-sky-50/90 via-white to-indigo-50/90 px-4 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">掷骰结果</p>
          <div className="mt-3 flex items-center gap-4">
            <div className={[ 'dice-face', gameState.status === 'rolling' ? 'dice-face-rolling' : '', isSettled ? 'dice-face-landed' : '' ].join(' ')}>
              <DiePips value={displayValue} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">锁定点数</p>
              <p className="mt-1 font-mono text-3xl font-bold text-sky-600">{gameState.status === 'rolling' ? '…' : (gameState.diceValue ?? '—')}</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onRollDice}
          disabled={!canRoll}
          className={[
            'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition',
            canRoll
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_12px_24px_rgba(245,158,11,0.26)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(245,158,11,0.32)]'
              : 'cursor-not-allowed bg-slate-300',
          ].join(' ')}
        >
          <Dices size={18} />
          掷骰前进
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm text-slate-500">
          <SkipForward size={16} />
          <span>其余流程由系统自动推进</span>
        </div>
        {gameState.diceValue !== null && gameState.status !== 'rolling' ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
            <Sparkles size={15} /> 本次前进 {gameState.diceValue} 格
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DiePips({ value }: { value: number }) {
  const map: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-2">
      {Array.from({ length: 9 }).map((_, index) => {
        const cell = index + 1;
        const active = map[value]?.includes(cell) ?? false;
        return <span key={cell} className={[ 'dice-pip', active ? 'dice-pip-active' : '' ].join(' ')} />;
      })}
    </div>
  );
}
