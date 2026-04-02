import type { RefObject } from 'react';

import { BoardTile } from '@/components/BoardTile';
import { RadarChart } from '@/components/RadarChart';
import type { BoardConfig, TileTemplate } from '@/types';

interface CanvasProps {
  boardConfig: BoardConfig;
  boardRef: RefObject<HTMLDivElement>;
  selectedTileIndex: number | null;
  dropTargetIndex: number | null;
  onSelectTile: (index: number) => void;
  onDropTemplate: (index: number, template: TileTemplate) => void;
  onHoverDropTarget: (index: number | null) => void;
}

interface GridPosition {
  row: number;
  column: number;
}

const getBoardSideLength = (tileCount: number) => tileCount / 4 + 1;

const getGridPosition = (index: number, tileCount: number): GridPosition => {
  const sideLength = getBoardSideLength(tileCount);
  const edgeCount = sideLength - 2;

  if (index === 0) {
    return { row: sideLength, column: 1 };
  }

  if (index <= edgeCount) {
    return { row: sideLength, column: index + 1 };
  }

  if (index === edgeCount + 1) {
    return { row: sideLength, column: sideLength };
  }

  if (index <= edgeCount * 2 + 1) {
    const offset = index - (edgeCount + 1);
    return { row: sideLength - offset, column: sideLength };
  }

  if (index === edgeCount * 2 + 2) {
    return { row: 1, column: sideLength };
  }

  if (index <= edgeCount * 3 + 2) {
    const offset = index - (edgeCount * 2 + 2);
    return { row: 1, column: sideLength - offset };
  }

  if (index === edgeCount * 3 + 3) {
    return { row: 1, column: 1 };
  }

  const offset = index - (edgeCount * 3 + 3);
  return { row: 1 + offset, column: 1 };
};

export function Canvas({
  boardConfig,
  boardRef,
  selectedTileIndex,
  dropTargetIndex,
  onSelectTile,
  onDropTemplate,
  onHoverDropTarget,
}: CanvasProps) {
  const sideLength = getBoardSideLength(boardConfig.size);
  const edgeCount = sideLength - 2;
  const cornerIndices = [0, edgeCount + 1, edgeCount * 2 + 2, edgeCount * 3 + 3];

  return (
    <section className="panel-shell relative flex min-h-[720px] flex-1 flex-col overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="panel-title">棋盘画布</h2>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              棋盘中心保留为七维素养魔法阵视图。拖拽卡牌到外圈路径，即可构建一张带校园冒险感的大富翁地图。
            </p>
          </div>
          <div className="rounded-full border border-galgame-border bg-black/10 px-3 py-1.5 text-xs tracking-[0.14em] text-galgame-gold-light">
            {selectedTileIndex === null ? '未选中格子' : `当前选中第 ${selectedTileIndex + 1} 格`}
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto bg-grid-soft bg-grid p-4 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_35%),radial-gradient(circle_at_50%_25%,rgba(232,212,139,0.06),transparent_28%)]" />

        <div
          ref={boardRef}
          className="board-container relative mx-auto flex w-full max-w-[980px] items-center justify-center rounded-[28px] p-4 md:p-8"
        >
          <div className="pointer-events-none absolute inset-4 rounded-[24px] border border-galgame-border opacity-60" />
          <div className="pointer-events-none absolute inset-[18%] rounded-full border border-[rgba(201,168,76,0.10)] shadow-[0_0_45px_rgba(99,102,241,0.10)]" />

          <div
            className="relative grid aspect-square w-full max-w-[720px] gap-2 rounded-[24px] border border-galgame-border bg-[rgba(255,255,255,0.02)] p-3 backdrop-blur-sm md:gap-3 md:p-4"
            style={{
              gridTemplateColumns: `repeat(${sideLength}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${sideLength}, minmax(0, 1fr))`,
            }}
          >
            <div
              className="radar-chart-container relative overflow-hidden rounded-[24px] border border-galgame-border bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%),rgba(12,20,40,0.45)] p-2 md:p-4"
              style={{
                gridColumn: `2 / ${sideLength}`,
                gridRow: `2 / ${sideLength}`,
              }}
            >
              <RadarChart />
            </div>

            {Array.from({ length: boardConfig.size }, (_, index) => {
              const tile = boardConfig.tiles.find((item) => item.index === index) ?? null;
              const position = getGridPosition(index, boardConfig.size);
              return (
                <BoardTile
                  key={`board-position-${index}`}
                  tile={tile}
                  index={index}
                  isCorner={cornerIndices.includes(index)}
                  isSelected={selectedTileIndex === index}
                  isDropTarget={dropTargetIndex === index}
                  gridColumn={position.column}
                  gridRow={position.row}
                  onSelect={onSelectTile}
                  onDropTemplate={onDropTemplate}
                  onHoverDropTarget={onHoverDropTarget}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
