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
import type { BoardTile as BoardTileType, GameStatus, TileTemplate } from '@/types';

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

interface PlayerTokenInfo {
  id: string;
  name: string;
  color: string;
  isCurrent: boolean;
}

interface BoardTileProps {
  index: number;
  tile: BoardTileType | null;
  isCorner: boolean;
  isDropTarget: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  mode: 'editor' | 'play';
  gameStatus?: GameStatus;
  playerTokens: PlayerTokenInfo[];
  onDropTemplate?: (index: number, template: TileTemplate) => void;
  onHoverDropTarget?: (index: number | null) => void;
  onSelectTile?: (index: number) => void;
}

export function BoardTile({
  index,
  tile,
  isCorner,
  isDropTarget,
  isHighlighted,
  isSelected,
  mode,
  gameStatus = 'idle',
  playerTokens,
  onDropTemplate,
  onHoverDropTarget,
  onSelectTile,
}: BoardTileProps) {
  const Icon = iconMap[tile?.icon ?? 'Circle'] ?? Circle;
  const competencyColor = tile?.competencyColor ? theme.colors.competency[tile.competencyColor] : undefined;
  const tileTone = getTileTone(tile, competencyColor);

  return (
    <button
      type="button"
      onClick={() => onSelectTile?.(index)}
      onDragOver={(event) => handleDragOver(event, index, onHoverDropTarget, mode)}
      onDragLeave={() => onHoverDropTarget?.(null)}
      onDrop={(event) => handleDrop(event, index, onDropTemplate, onHoverDropTarget, mode)}
      className={[
        'relative overflow-hidden rounded-[18px] border p-2 text-left transition duration-200',
        isCorner ? 'min-h-[118px]' : 'min-h-[92px]',
        tile ? 'board-tile-filled' : 'board-tile-empty',
        isSelected ? 'board-tile-selected' : '',
        isDropTarget ? 'board-tile-drop-target' : '',
        isHighlighted ? 'board-tile-highlighted board-tile-landed' : '',
      ].join(' ')}
      style={tileTone}
    >
      <div className="absolute right-2 top-2 rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-400">
        #{index + 1}
      </div>

      {tile ? (
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="flex items-start gap-2">
            <div
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-white/70 bg-white/70"
              style={{ color: competencyColor ?? tileTone.color ?? theme.colors.accentBlue }}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <p className="line-clamp-2 text-[13px] font-semibold text-slate-800">{tile.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{tile.description}</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {tile.type === 'property' && tile.propertyLevel ? (
                <span className="rounded-full bg-white/80 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600 shadow-sm">
                  {tile.propertyLevel}
                </span>
              ) : null}
              {tile.type === 'property' && tile.competencyColor ? (
                <span className="rounded-full px-2 py-1 text-[10px] font-semibold text-white shadow-sm" style={{ backgroundColor: competencyColor }}>
                  {competencyMap[tile.competencyColor].name}
                </span>
              ) : null}
            </div>
            <span className="font-mono text-xs font-semibold text-amber-500">{tile.points > 0 ? `+${tile.points}` : tile.points}</span>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
          <span className="text-lg">✦</span>
          <p className="mt-1 text-xs font-medium">空白格</p>
          <p className="mt-1 text-[11px] text-slate-400">拖入组件或点击查看索引</p>
        </div>
      )}

      {playerTokens.length > 0 ? (
        <div className="absolute bottom-2 right-2 flex flex-wrap justify-end gap-1">
          {playerTokens.map((token) => (
            <span
              key={token.id}
              title={token.name}
              className={[
                'player-chip flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm',
                token.isCurrent ? 'ring-2 ring-amber-300 ring-offset-1 ring-offset-white/60' : '',
                token.isCurrent && (gameStatus === 'moving' || gameStatus === 'rolling') ? 'player-chip-moving' : '',
              ].join(' ')}
              style={{ backgroundColor: token.color }}
            >
              {token.name.slice(0, 1)}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

function getTileTone(tile: BoardTileType | null, competencyColor?: string): Record<string, string> {
  if (!tile) {
    return {};
  }

  if (tile.type === 'property') {
    return {
      background: `linear-gradient(180deg, ${competencyColor ?? '#dbeafe'}22, rgba(255,255,255,0.92))`,
      borderColor: `${competencyColor ?? '#cbd5e1'}66`,
      color: competencyColor ?? theme.colors.accentBlue,
      boxShadow: `0 10px 24px ${competencyColor ?? '#5b8def'}18`,
    };
  }

  const backgrounds: Record<Exclude<BoardTileType['type'], 'property'>, { background: string; borderColor: string; color: string }> = {
    start: { background: 'linear-gradient(180deg, rgba(245,158,11,0.16), rgba(255,255,255,0.94))', borderColor: 'rgba(245,158,11,0.34)', color: '#d97706' },
    event: { background: 'linear-gradient(180deg, rgba(139,92,246,0.14), rgba(255,255,255,0.94))', borderColor: 'rgba(139,92,246,0.28)', color: '#7c3aed' },
    penalty: { background: 'linear-gradient(180deg, rgba(239,68,68,0.12), rgba(255,255,255,0.94))', borderColor: 'rgba(239,68,68,0.28)', color: '#dc2626' },
    study: { background: 'linear-gradient(180deg, rgba(100,116,139,0.14), rgba(255,255,255,0.94))', borderColor: 'rgba(100,116,139,0.26)', color: '#475569' },
    publicService: { background: 'linear-gradient(180deg, rgba(34,197,94,0.14), rgba(255,255,255,0.94))', borderColor: 'rgba(34,197,94,0.26)', color: '#16a34a' },
    cafeteria: { background: 'linear-gradient(180deg, rgba(180,83,9,0.14), rgba(255,255,255,0.94))', borderColor: 'rgba(180,83,9,0.26)', color: '#b45309' },
  };

  return backgrounds[tile.type];
}

function handleDragOver(
  event: DragEvent<HTMLButtonElement>,
  index: number,
  onHoverDropTarget: ((index: number | null) => void) | undefined,
  mode: 'editor' | 'play',
) {
  if (mode !== 'editor') {
    return;
  }
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  onHoverDropTarget?.(index);
}

function handleDrop(
  event: DragEvent<HTMLButtonElement>,
  index: number,
  onDropTemplate: ((index: number, template: TileTemplate) => void) | undefined,
  onHoverDropTarget: ((index: number | null) => void) | undefined,
  mode: 'editor' | 'play',
) {
  if (mode !== 'editor') {
    return;
  }
  event.preventDefault();
  const payload = event.dataTransfer.getData('application/lingyun-tile-template');
  if (!payload || !onDropTemplate) {
    onHoverDropTarget?.(null);
    return;
  }

  try {
    const template = JSON.parse(payload) as TileTemplate;
    onDropTemplate(index, template);
  } finally {
    onHoverDropTarget?.(null);
  }
}
