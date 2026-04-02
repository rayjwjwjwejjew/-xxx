import {
  AlertTriangle,
  BookOpen,
  Flag,
  Heart,
  Shield,
  Sparkles,
  Star,
  X,
  type LucideIcon,
} from 'lucide-react';

import type { ChoicePresentation, PendingChoice } from '@/types';

interface GameModalProps {
  choice: PendingChoice | null;
  onChoose: (optionId: string) => void;
}

const iconMap: Record<NonNullable<ChoicePresentation['icon']>, LucideIcon> = {
  sparkles: Sparkles,
  shield: Shield,
  flag: Flag,
  book: BookOpen,
  heart: Heart,
  alert: AlertTriangle,
  star: Star,
};

export function GameModal({ choice, onChoose }: GameModalProps) {
  if (!choice) {
    return null;
  }

  const tone = choice.presentation?.tone ?? (choice.type === 'event' ? 'event' : choice.type === 'property' ? 'property' : 'info');
  const Icon = iconMap[choice.presentation?.icon ?? (tone === 'event' ? 'sparkles' : tone === 'property' ? 'star' : 'shield')];
  const toneClass = {
    event: 'from-violet-100/85 via-fuchsia-50/85 to-white text-violet-600 ring-violet-100',
    property: 'from-sky-100/85 via-cyan-50/85 to-white text-sky-600 ring-sky-100',
    warning: 'from-rose-100/85 via-orange-50/85 to-white text-rose-600 ring-rose-100',
    info: 'from-slate-100/85 via-white to-white text-slate-600 ring-slate-100',
    positive: 'from-emerald-100/85 via-lime-50/85 to-white text-emerald-600 ring-emerald-100',
  }[tone];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/28 px-4 py-6 backdrop-blur-sm">
      <div className="clean-panel modal-pop w-full max-w-[720px] overflow-hidden px-6 py-5 shadow-[0_24px_50px_rgba(91,141,239,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={[ 'flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br shadow-sm ring-4', toneClass ].join(' ')}>
              <Icon size={24} />
            </div>
            <div>
              <div className="panel-kicker">{choice.presentation?.kicker ?? '回合结算'}</div>
              <h2 className="panel-heading text-[1.2rem]">{choice.title}</h2>
              {choice.presentation?.highlight ? (
                <div className="mt-2 inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  {choice.presentation.highlight}
                </div>
              ) : null}
            </div>
          </div>
          {choice.type !== 'info' ? (
            <button
              type="button"
              onClick={() => onChoose('skip-property')}
              className="rounded-full border border-white/70 bg-white/70 p-2 text-slate-400 transition hover:bg-white"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <div className={[ 'mt-5 rounded-[24px] bg-gradient-to-br p-5 ring-1', toneClass ].join(' ')}>
          <p className="text-sm leading-7 text-slate-700">{choice.description}</p>
          {choice.presentation?.flavor ? (
            <p className="mt-4 rounded-[18px] border border-white/70 bg-white/72 px-4 py-3 text-sm italic leading-6 text-slate-500">
              “{choice.presentation.flavor}”
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {choice.options.map((option) => {
            const variantClass = option.variant === 'primary'
              ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-white text-sky-700 hover:border-sky-300 hover:shadow-[0_14px_30px_rgba(91,141,239,0.18)]'
              : option.variant === 'danger'
                ? 'border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-700 hover:border-rose-300 hover:shadow-[0_14px_30px_rgba(244,63,94,0.16)]'
                : 'border-white/80 bg-white/78 text-slate-600 hover:border-slate-200 hover:shadow-[0_12px_24px_rgba(148,163,184,0.12)]';

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChoose(option.id)}
                className={[
                  'group rounded-[20px] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5',
                  variantClass,
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{option.label}</span>
                      {option.badge ? (
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
                          {option.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                  </div>
                  <div className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-slate-400 transition group-hover:text-slate-600">
                    选择
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
