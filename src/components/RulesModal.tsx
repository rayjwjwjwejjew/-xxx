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
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/28 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div className="clean-panel max-h-[82vh] w-full max-w-[820px] overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-sky-50 text-sky-500 shadow-sm">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="panel-kicker">规则手册</div>
              <h2 className="panel-heading">凌云大富翁游玩说明</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/70 bg-white/75 p-2 text-slate-400 transition hover:bg-white hover:text-slate-700">
            <X size={18} />
          </button>
        </div>
        <div className="soft-divider mx-6" />
        <div className="max-h-[calc(82vh-96px)] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard label="起始积分" value={`${startingPoints} 分`} />
            <InfoCard label="推荐棋盘格数" value={`${boardTileCountOptions.recommended} 格`} />
          </div>

          <div className="mt-5 space-y-5">
            {ruleSummarySections.map((section) => (
              <article key={section.title} className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800">等级区间</h3>
                <div className="mt-4 space-y-3">
                  {levelRanges.map((level) => (
                    <InfoRow key={level.tier} title={level.tier} description={level.max === null ? `${level.min} 分及以上` : `${level.min}-${level.max} 分`} />
                  ))}
                </div>
              </article>
              <article className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800">素养地产规则</h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p><span className="font-semibold text-slate-800">常规路径：</span>{propertyPurchaseRules.standardPath}</p>
                  <p><span className="font-semibold text-slate-800">特殊路径：</span>{propertyPurchaseRules.shortcutPath}</p>
                </div>
              </article>
            </div>

            <article className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800">特殊格一览</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {specialTileDefinitions.map((tile) => (
                  <InfoRow key={tile.type} title={tile.name} description={`${tile.description}（${tile.defaultPoints > 0 ? `+${tile.defaultPoints}` : tile.defaultPoints} 分）`} />
                ))}
              </div>
            </article>

            <article className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800">T 记录与服务修复</h3>
              <div className="mt-4 space-y-3">
                {tierPenalties.map((penalty) => (
                  <InfoRow
                    key={penalty.tier}
                    title={penalty.tier}
                    description={`扣分 ${Math.abs(penalty.points)} 分 · 消 T ${penalty.clearRequirement} 次 · 服务 ${serviceClearWeeks[penalty.tier]} 周`}
                  />
                ))}
                <p className="text-sm text-slate-500">服务内容示例：{serviceOptions.join('、')}</p>
              </div>
            </article>

            <article className="rounded-[18px] border border-white/75 bg-white/72 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800">PA 任务来源</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {paTaskCategories.map((category) => (
                  <InfoRow key={category.id} title={category.name} description={category.description} />
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/75 bg-white/72 px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 font-mono text-lg font-bold text-sky-600">{value}</p>
    </div>
  );
}

function InfoRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[14px] border border-white/70 bg-slate-50/90 px-4 py-3">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
