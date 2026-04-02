import { useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';

import {
  boardTileCountOptions,
  levelRanges,
  paTaskCategories,
  propertyPurchaseRules,
  ruleSummarySections,
  serviceClearWeeks,
  serviceOptions,
  specialTileDefinitions,
  startingPoints,
  tierPenalties,
} from '@/data/rules';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div
        className="modal-content panel-shell max-h-[80vh] w-full max-w-[720px] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-galgame-border bg-[rgba(201,168,76,0.08)] text-galgame-gold-light shadow-[0_0_16px_rgba(201,168,76,0.12)]">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="font-title text-xl tracking-[0.16em] text-galgame-gold-light">规则说明</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  将真实凌云积分制度，转化为一张兼具成长路径与校园冒险氛围的桌游地图。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-galgame-border bg-[rgba(255,255,255,0.04)] text-galgame-gold-light transition hover:shadow-[0_0_12px_rgba(201,168,76,0.18)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="decorative-divider mx-6" />

        <div className="max-h-[calc(80vh-110px)] overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="起始积分" value={`${startingPoints} 分`} />
              <StatCard label="推荐棋盘格数" value={`${boardTileCountOptions.recommended} 格`} />
            </div>

            {ruleSummarySections.map((section) => (
              <article key={section.title} className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
                <h3 className="font-title text-base text-galgame-gold-light">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-galgame-gold-orange shadow-[0_0_8px_rgba(240,160,48,0.45)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <article className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
              <h3 className="font-title text-base text-galgame-gold-light">特殊格功能一览</h3>
              <div className="mt-4 space-y-3">
                {specialTileDefinitions.map((tile) => (
                  <div key={tile.type} className="rounded-xl border border-galgame-border bg-[rgba(15,25,50,0.36)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-text-primary">{tile.name}</p>
                      <span className="font-mono text-sm text-galgame-gold-orange">
                        {tile.defaultPoints > 0 ? `+${tile.defaultPoints}` : tile.defaultPoints} 分
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{tile.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
                <h3 className="font-title text-base text-galgame-gold-light">等级区间</h3>
                <div className="mt-4 space-y-3">
                  {levelRanges.map((level) => (
                    <div key={level.tier} className="rounded-xl border border-galgame-border bg-[rgba(15,25,50,0.36)] px-4 py-3">
                      <p className="text-sm font-semibold text-text-primary">{level.tier}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {level.max === null ? `${level.min} 分及以上` : `${level.min}-${level.max} 分`}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
                <h3 className="font-title text-base text-galgame-gold-light">房产购买规则</h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
                  <p><span className="font-semibold text-text-primary">常规路径：</span>{propertyPurchaseRules.standardPath}</p>
                  <p><span className="font-semibold text-text-primary">特殊路径：</span>{propertyPurchaseRules.shortcutPath}</p>
                </div>
              </article>
            </div>

            <article className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
              <h3 className="font-title text-base text-galgame-gold-light">T 记录惩罚与撤销</h3>
              <div className="mt-4 space-y-3">
                {tierPenalties.map((penalty) => (
                  <div key={penalty.tier} className="rounded-xl border border-red-400/25 bg-[rgba(239,68,68,0.08)] px-4 py-3">
                    <p className="text-sm font-semibold text-red-200">{penalty.tier}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      扣分：{penalty.points} 分 ｜ 消 T 次数：{penalty.clearRequirement} 次 ｜ 服务撤销：{serviceClearWeeks[penalty.tier]} 周
                    </p>
                  </div>
                ))}
                <div className="rounded-xl border border-galgame-border bg-[rgba(15,25,50,0.36)] px-4 py-3 text-sm text-text-secondary">
                  服务内容：{serviceOptions.join('、')}
                </div>
              </div>
            </article>

            <article className="rounded-panel border border-galgame-border bg-[rgba(255,255,255,0.03)] p-5 shadow-card">
              <h3 className="font-title text-base text-galgame-gold-light">PA 任务来源</h3>
              <div className="mt-4 space-y-3">
                {paTaskCategories.map((category) => (
                  <div key={category.id} className="rounded-xl border border-galgame-border bg-[rgba(15,25,50,0.36)] px-4 py-3">
                    <p className="text-sm font-semibold text-text-primary">{category.name}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{category.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-galgame-border bg-[rgba(15,25,50,0.36)] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-secondary">{label}</p>
      <p className="mt-2 font-mono text-lg font-bold text-galgame-gold-orange">{value}</p>
    </div>
  );
}
