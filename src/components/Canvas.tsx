import type { RefObject } from 'react';

import { BoardTile } from '@/components/BoardTile';
import { RadarChart } from '@/components/RadarChart';
import type { BoardConfig, FloatingFeedback, PlayerState, TileTemplate } from '@/types';

interface CanvasProps {
  boardConfig: BoardConfig;
  boardRef?: RefObject<HTMLDivElement>;
  selectedTileIndex: number | null;
  dropTargetIndex: number | null;
  mode: 'editor' | 'play';
  highlightedTileIndex?: number | null;
  players?: PlayerState[];
  currentPlayerId?: string | null;
  gameStatus?: 'setup' | 'idle' | 'rolling' | 'moving' | 'choice' | 'resolving' | 'finished';
  feedbackBursts?: FloatingFeedback[];
  onSelectTile?: (index: number) => void;
  onDropTemplate?: (index: number, template: TileTemplate) => void;
  onHoverDropTarget?: (index: number | null) => void;
}

interface GridPosition {
  row: number;
  column: number;
}

const getBoardSideLength = (tileCount: number) => tileCount / 4 + 1;

const getGridPosition = (index: number, tileCount: number): GridPosition => {
  const sideLength = getBoardSideLength(tileCount);
  const edgeCount = sideLength - 2;

  if (index === 0) return { row: sideLength, column: 1 };
  if (index <= edgeCount) return { row: sideLength, column: index + 1 };
  if (index === edgeCount + 1) return { row: sideLength, column: sideLength };
  if (index <= edgeCount * 2 + 1) {
    const offset = index - (edgeCount + 1);
    return { row: sideLength - offset, column: sideLength };
  }
  if (index === edgeCount * 2 + 2) return { row: 1, column: sideLength };
  if (index <= edgeCount * 3 + 2) {
    const offset = index - (edgeCount * 2 + 2);
    return { row: 1, column: sideLength - offset };
  }
  if (index === edgeCount * 3 + 3) return { row: 1, column: 1 };
  const offset = index - (edgeCount * 3 + 3);
  return { row: 1 + offset, column: 1 };
};

export function Canvas({
  boardConfig,
  boardRef,
  selectedTileIndex,
  dropTargetIndex,
  mode,
  highlightedTileIndex = null,
  players = [],
  currentPlayerId = null,
  gameStatus = 'idle',
  feedbackBursts = [],
  onSelectTile,
  onDropTemplate,
  onHoverDropTarget,
}: CanvasProps) {
  const sideLength = getBoardSideLength(boardConfig.size);
  const edgeCount = sideLength - 2;
  const cornerIndices = [0, edgeCount + 1, edgeCount * 2 + 2, edgeCount * 3 + 3];

  return (
    <section className="clean-panel flex flex-1 flex-col overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="panel-kicker">{mode === 'editor' ? '地图画布' : '游戏棋盘'}</div>
          <h2 className="panel-heading">{mode === 'editor' ? '编辑外圈路径与中央素养区' : '跟随棋子移动，完成成长任务'}</h2>
        </div>
        <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {boardConfig.size} 格 · {boardConfig.tiles.length} 已配置
        </div>
      </div>

      <div ref={boardRef} className="board-surface relative flex-1 overflow-hidden rounded-[24px] p-3 sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.4),transparent_36%)]" />

        {mode === 'play' && feedbackBursts.length > 0 ? (
          <div className="pointer-events-none absolute right-4 top-4 z-20 flex max-w-[260px] flex-col items-end gap-2">
            {feedbackBursts.map((feedback, index) => (
              <span
                key={feedback.id}
                className={[
                  'feedback-burst',
                  `feedback-burst-${feedback.tone}`,
                ].join(' ')}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {feedback.text}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="relative z-10 grid h-full min-h-[620px] gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${sideLength}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${sideLength}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: boardConfig.size }).map((_, index) => {
            const tile = boardConfig.tiles.find((item) => item.index === index) ?? null;
            const position = getGridPosition(index, boardConfig.size);
            const tokens = players
              .filter((player) => player.position === index)
              .map((player) => ({ id: player.id, name: player.name, color: player.color, isCurrent: player.id === currentPlayerId }));

            return (
              <div
                key={`board-position-${index}`}
                style={{ gridRow: position.row, gridColumn: position.column }}
                className="min-w-0 min-h-0"
              >
                <BoardTile
                  index={index}
                  tile={tile}
                  isCorner={cornerIndices.includes(index)}
                  isDropTarget={dropTargetIndex === index}
                  isHighlighted={highlightedTileIndex === index}
                  isSelected={selectedTileIndex === index}
                  mode={mode}
                  playerTokens={tokens}
                  gameStatus={gameStatus}
                  onDropTemplate={onDropTemplate}
                  onHoverDropTarget={onHoverDropTarget}
                  onSelectTile={onSelectTile}
                />
              </div>
            );
          })}

          <div
            className="radar-shell relative col-[2_/_-2] row-[2_/_-2] flex items-center justify-center overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          >
            <div className="absolute inset-5 rounded-full border border-sky-100/80" />
            <div className="absolute inset-10 rounded-full border border-indigo-100/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.26),transparent_60%)]" />
            <div className="relative z-10 w-full max-w-[420px]">
              <RadarChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
