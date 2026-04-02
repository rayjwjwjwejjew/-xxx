import {
  AlertTriangle,
  BookOpen,
  Circle,
  Flag,
  HeartHandshake,
  Sparkles,
  Star,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { DragEvent } from 'react';

import { competencyMap } from '@/data/competencies';
import { theme } from '@/styles/theme';
import type { BoardTile as BoardTileType, TileTemplate } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  BookOpen,
  Circle,
  Flag,
  HeartHandshake,
  Sparkles,
  Star,
  Utensils,
};

const specialTileAppearance: Record<Exclude<BoardTileType['type'], 'property'>, { background: string; badge: string; border: string; glow: string }> = {
  start: {
    background: 'linear-gradient(135deg, rgba(240, 160, 48, 0.2), rgba(232, 212, 139, 0.08))',
    badge: '起点',
    border: 'rgba(232, 212, 139, 0.5)',
    glow: '0 0 20px rgba(240, 160, 48, 0.15)',
  },
  event: {
    background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15), rgba(99, 102, 241, 0.1))',
    badge: '事件',
    border: 'rgba(129, 140, 248, 0.4)',
    glow: '0 0 15px rgba(99, 102, 241, 0.15)',
  },
  penalty: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(185, 28, 28, 0.1))',
    badge: '惩罚',
    border: 'rgba(239, 68, 68, 0.4)',
    glow: '0 0 15px rgba(239, 68, 68, 0.15)',
  },
  study: {
    background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.15))',
    badge: '自习室',
    border: 'rgba(148, 163, 184, 0.3)',
    glow: '0 0 12px rgba(100, 116, 139, 0.1)',
  },
  publicService: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
    badge: '公益',
    border: 'rgba(34, 197, 94, 0.4)',
    glow: '0 0 15px rgba(34, 197, 94, 0.12)',
  },
  cafeteria: {
    background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.2), rgba(120, 53, 15, 0.15))',
    badge: '食堂',
    border: 'rgba(180, 130, 60, 0.4)',
    glow: '0 0 15px rgba(146, 64, 14, 0.12)',
  },
};

interface BoardTileProps {
  tile: BoardTileType | null;
  index: number;
  isCorner: boolean;
  isSelected: boolean;
  isDropTarget: boolean;
  gridColumn: number;
  gridRow: number;
  onSelect: (index: number) => void;
  onDropTemplate: (index: number, template: TileTemplate) => void;
  onHoverDropTarget: (index: number | null) => void;
}

const parseTemplatePayload = (event: DragEvent<HTMLButtonElement>) => {
  const rawTemplate = event.dataTransfer.getData('application/lingyun-tile-template');
  if (!rawTemplate) {
    return null;
  }

  try {
    return JSON.parse(rawTemplate) as TileTemplate;
  } catch {
    return null;
  }
};

export function BoardTile({
  tile,
  index,
  isCorner,
  isSelected,
  isDropTarget,
  gridColumn,
  gridRow,
  onSelect,
  onDropTemplate,
  onHoverDropTarget,
}: BoardTileProps) {
  const Icon = tile?.icon ? iconMap[tile.icon] : null;
  const competency = tile?.competencyColor ? competencyMap[tile.competencyColor] : null;
  const appearance = tile && tile.type !== 'property' ? specialTileAppearance[tile.type] : null;
  const propertyColor = competency ? theme.colors.competency[competency.color] : theme.colors.brandOrange;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      onDragOver={(event) => {
        event.preventDefault();
        onHoverDropTarget(index);
      }}
      onDragLeave={() => onHoverDropTarget(null)}
      onDrop={(event) => {
        event.preventDefault();
        const template = parseTemplatePayload(event);
        if (template) {
          onDropTemplate(index, template);
        }
        onHoverDropTarget(null);
      }}
      className={[
        'group relative flex h-full w-full min-h-[92px] flex-col overflow-hidden rounded-tile text-left transition duration-300 ease-out',
        'hover:-translate-y-[2px] active:scale-[0.98]',
        tile ? 'board-tile-filled border' : 'board-tile-empty border',
        isCorner ? 'min-h-[116px]' : '',
        isSelected ? 'board-tile-selected' : '',
        isDropTarget ? 'board-tile-drop-target' : '',
      ].join(' ')}
      style={{
        gridColumn,
        gridRow,
        background:
          tile?.type === 'property'
            ? `linear-gradient(135deg, ${propertyColor}24, rgba(12,20,40,0.82))`
            : appearance?.background,
        borderColor: tile?.type === 'property' ? `${propertyColor}80` : appearance?.border,
        boxShadow: tile?.type === 'property' ? `0 0 16px ${propertyColor}20` : appearance?.glow,
      }}
    >
      <div className="absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,212,139,0.5),transparent)]" />

      <div className="flex items-center justify-between border-b border-[rgba(201,168,76,0.16)] px-2.5 py-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">#{index + 1}</span>
        {tile ? (
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
            style={{
              backgroundColor: tile.type === 'property' ? `${propertyColor}20` : 'rgba(201,168,76,0.12)',
              color: tile.type === 'property' ? propertyColor : theme.colors.goldLight,
            }}
          >
            {tile.type === 'property' ? tile.propertyLevel : appearance?.badge}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-text-secondary">Empty</span>
        )}
      </div>

      {tile ? (
        <div className="flex flex-1 flex-col gap-2 px-2.5 py-2.5">
          <div className="flex items-start gap-2">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-[rgba(12,20,40,0.72)]"
              style={{
                color: tile.type === 'property' ? propertyColor : theme.colors.brandOrange,
                borderColor: 'rgba(201,168,76,0.16)',
                boxShadow: tile.type === 'property' ? `0 0 12px ${propertyColor}22` : '0 0 12px rgba(240,160,48,0.12)',
              }}
            >
              {Icon ? <Icon size={18} strokeWidth={2} /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-title text-[13px] leading-5 text-text-primary">{tile.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-text-secondary">{tile.description}</p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            {tile.type === 'property' && competency ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: propertyColor,
                    boxShadow: `0 0 12px ${propertyColor}66`,
                  }}
                />
                {competency.name}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-text-secondary">特殊格</span>
            )}
            <span className="font-mono text-[11px] font-bold text-galgame-gold-orange">
              {tile.points > 0 ? `+${tile.points}` : tile.points} 分
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2.5 py-2 text-center text-text-secondary">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-galgame-border bg-[rgba(255,255,255,0.02)] text-lg text-galgame-gold-light">
            ✦
          </div>
          <p className="text-[11px] font-medium">拖入组件到此格</p>
        </div>
      )}
    </button>
  );
}
