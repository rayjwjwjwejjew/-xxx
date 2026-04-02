import type { GameLogEntry } from '@/types';

export function GameLog({ logs }: { logs: GameLogEntry[] }) {
  return (
    <section className="clean-panel flex min-h-[260px] flex-col overflow-hidden">
      <div className="px-5 py-4">
        <div className="panel-kicker">系统日志</div>
        <h2 className="panel-heading">最近发生的事件与回合记录</h2>
      </div>
      <div className="soft-divider mx-5" />
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {logs.map((entry) => (
          <div key={entry.id} className="rounded-[16px] border border-white/75 bg-white/72 px-4 py-3 shadow-sm">
            <span
              className={[
                'mb-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                entry.tone === 'positive'
                  ? 'bg-emerald-50 text-emerald-600'
                  : entry.tone === 'warning'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {entry.tone === 'positive' ? '成长收益' : entry.tone === 'warning' ? '状态提醒' : '系统记录'}
            </span>
            <p className="text-sm leading-6 text-slate-600">{entry.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
