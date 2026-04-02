import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

import { Canvas } from '@/components/Canvas';
import { ExportButtons } from '@/components/ExportButtons';
import { Navbar } from '@/components/Navbar';
import { PropertyPanel } from '@/components/PropertyPanel';
import { RulesModal } from '@/components/RulesModal';
import { Sidebar } from '@/components/Sidebar';
import { competencies } from '@/data/competencies';
import { useBoard } from '@/hooks/useBoard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useExport } from '@/hooks/useExport';
import type { BoardConfig, BoardTile, CompetencyColor, PropertyLevel, TileTemplate, TileType } from '@/types';
import { exportJSON } from '@/utils/exportJSON';
import { exportPDF } from '@/utils/exportPDF';
import { exportPNG } from '@/utils/exportPNG';
import { exportPuzzlePDF } from '@/utils/exportPuzzle';

const tileTypes: TileType[] = ['start', 'event', 'penalty', 'study', 'publicService', 'cafeteria', 'property'];
const propertyLevels: PropertyLevel[] = ['FC', 'AC'];
const competencyColors: CompetencyColor[] = competencies.map((item) => item.color);

const particleSeeds = [
  { left: '6%', top: '14%', size: '4px', duration: '8s', delay: '0s' },
  { left: '12%', top: '64%', size: '6px', duration: '10s', delay: '1s' },
  { left: '18%', top: '30%', size: '3px', duration: '7s', delay: '2s' },
  { left: '22%', top: '82%', size: '5px', duration: '11s', delay: '0.4s' },
  { left: '30%', top: '12%', size: '4px', duration: '8.5s', delay: '1.4s' },
  { left: '36%', top: '56%', size: '5px', duration: '9.2s', delay: '0.8s' },
  { left: '42%', top: '24%', size: '3px', duration: '6.5s', delay: '2.2s' },
  { left: '48%', top: '74%', size: '6px', duration: '12s', delay: '1.8s' },
  { left: '54%', top: '16%', size: '4px', duration: '7.5s', delay: '0.3s' },
  { left: '60%', top: '44%', size: '5px', duration: '10.5s', delay: '2.4s' },
  { left: '66%', top: '84%', size: '3px', duration: '7.8s', delay: '1.1s' },
  { left: '72%', top: '28%', size: '4px', duration: '9.8s', delay: '2.1s' },
  { left: '78%', top: '62%', size: '6px', duration: '11.5s', delay: '0.9s' },
  { left: '84%', top: '18%', size: '3px', duration: '6.8s', delay: '1.6s' },
  { left: '88%', top: '76%', size: '5px', duration: '10.8s', delay: '2.6s' },
  { left: '92%', top: '38%', size: '4px', duration: '8.2s', delay: '0.7s' },
];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTileType = (value: unknown): value is TileType =>
  typeof value === 'string' && tileTypes.includes(value as TileType);

const isPropertyLevel = (value: unknown): value is PropertyLevel =>
  typeof value === 'string' && propertyLevels.includes(value as PropertyLevel);

const isCompetencyColor = (value: unknown): value is CompetencyColor =>
  typeof value === 'string' && competencyColors.includes(value as CompetencyColor);

const isBoardTile = (value: unknown): value is BoardTile => {
  if (!isObject(value)) {
    return false;
  }

  const { id, index, type, name, description, points, competencyColor, propertyLevel, icon } = value;
  if (
    typeof id !== 'string' ||
    typeof index !== 'number' ||
    !isTileType(type) ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof points !== 'number'
  ) {
    return false;
  }

  if (competencyColor !== undefined && !isCompetencyColor(competencyColor)) {
    return false;
  }

  if (propertyLevel !== undefined && !isPropertyLevel(propertyLevel)) {
    return false;
  }

  if (icon !== undefined && typeof icon !== 'string') {
    return false;
  }

  return true;
};

const parseBoardConfig = (value: unknown): BoardConfig => {
  if (!isObject(value)) {
    throw new Error('导入失败：JSON 顶层结构不正确。');
  }

  const { size, tiles } = value;
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 28 || size > 32 || size % 4 !== 0) {
    throw new Error('导入失败：棋盘 size 必须是 28 到 32 之间、且可被 4 整除的整数。');
  }

  if (!Array.isArray(tiles)) {
    throw new Error('导入失败：tiles 字段必须是数组。');
  }

  if (!tiles.every(isBoardTile)) {
    throw new Error('导入失败：tiles 中存在不合法的格子数据。');
  }

  return {
    size,
    tiles: [...tiles].sort((left, right) => left.index - right.index),
  };
};

export function Layout() {
  const boardRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const {
    boardConfig,
    clearBoard,
    selectedTile,
    selectedTileIndex,
    placeTile,
    removeTile,
    replaceBoard,
    selectTile,
    updateTile,
  } = useBoard();
  const {
    draggingTemplate,
    dropTargetIndex,
    endDragging,
    setDropTargetIndex,
    startDragging,
  } = useDragAndDrop();
  const { activeAction, isBusy, runAction, setStatusMessage, statusMessage } = useExport();

  const boardStats = useMemo(
    () => ({
      filledTiles: boardConfig.tiles.length,
      emptyTiles: boardConfig.size - boardConfig.tiles.length,
    }),
    [boardConfig.size, boardConfig.tiles.length],
  );

  const handleDropTemplate = (index: number, template: TileTemplate) => {
    placeTile(index, template);
    endDragging();
    setStatusMessage({ tone: 'success', text: `已将「${template.name}」放置到第 ${index + 1} 格。` });
  };

  const ensureBoardElement = () => {
    const element = boardRef.current;
    if (!element) {
      throw new Error('暂时无法读取棋盘区域，请刷新页面后重试。');
    }
    return element;
  };

  const openImportDialog = () => {
    importInputRef.current?.click();
  };

  const handleImportJSON = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await runAction(
      'import',
      async () => {
        const rawContent = await file.text();
        const parsed = parseBoardConfig(JSON.parse(rawContent));
        replaceBoard(parsed);
      },
      `已成功导入 ${file.name}。`,
    );

    event.target.value = '';
  };

  const handleClearBoard = () => {
    clearBoard();
    setStatusMessage({ tone: 'success', text: '已创建新地图，棋盘已清空。' });
  };

  return (
    <div className="galgame-app relative flex min-h-screen flex-col overflow-hidden text-text-primary">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particleSeeds.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              ['--size' as string]: particle.size,
              ['--duration' as string]: particle.duration,
              ['--delay' as string]: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(232,212,139,0.12),transparent_55%)]" />

      <Navbar
        activeAction={activeAction}
        isBusy={isBusy}
        onImportJSON={openImportDialog}
        onNewMap={handleClearBoard}
        onOpenRules={() => setIsRulesOpen(true)}
        onSaveJSON={() =>
          void runAction('save', async () => exportJSON(boardConfig), '棋盘配置已保存为 lingyun-board.json。')
        }
      />

      {statusMessage ? (
        <div className="mx-4 mt-4">
          <div
            className={[
              'status-panel flex items-center gap-3',
              statusMessage.tone === 'success'
                ? 'border-green-400/30 text-green-200'
                : statusMessage.tone === 'error'
                  ? 'border-red-400/30 text-red-200'
                  : 'border-sky-400/30 text-sky-200',
            ].join(' ')}
          >
            {statusMessage.tone === 'success' ? (
              <CheckCircle2 size={16} />
            ) : statusMessage.tone === 'error' ? (
              <XCircle size={16} />
            ) : (
              <Info size={16} />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden p-4 xl:flex-row">
        <Sidebar
          draggingTemplateId={draggingTemplate?.templateId ?? null}
          onDragStartTemplate={startDragging}
          onDragEndTemplate={endDragging}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="panel-shell px-4 py-3 text-sm text-text-secondary">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-title text-sm tracking-[0.18em] text-galgame-gold-light">当前棋盘状态</p>
              <div className="rounded-full border border-galgame-border bg-black/10 px-3 py-1 text-xs text-galgame-gold-light">
                {selectedTileIndex === null ? '未选中格子' : `正在编辑第 ${selectedTileIndex + 1} 格`}
              </div>
            </div>
            <div className="decorative-divider mb-3" />
            <div className="grid gap-3 text-center text-xs sm:grid-cols-4">
              <StatusMetric label="已放置" value={`${boardStats.filledTiles} 格`} />
              <StatusMetric label="空位" value={`${boardStats.emptyTiles} 格`} />
              <StatusMetric label="拖拽模式" value="覆盖开启" />
              <StatusMetric label="导出区域" value="仅棋盘主体" />
            </div>
          </div>

          <Canvas
            boardConfig={boardConfig}
            boardRef={boardRef}
            selectedTileIndex={selectedTileIndex}
            dropTargetIndex={dropTargetIndex}
            onSelectTile={selectTile}
            onDropTemplate={handleDropTemplate}
            onHoverDropTarget={setDropTargetIndex}
          />

          <ExportButtons
            activeAction={activeAction}
            isBusy={isBusy}
            onExportPNG={() =>
              void runAction('png', async () => exportPNG(ensureBoardElement()), '棋盘 PNG 已导出。')
            }
            onExportPDF={() =>
              void runAction('pdf', async () => exportPDF(ensureBoardElement()), '棋盘 PDF 已导出。')
            }
            onExportPuzzlePDF={() =>
              void runAction('puzzle', async () => exportPuzzlePDF(ensureBoardElement()), '拼图版 PDF 已导出。')
            }
            onExportJSON={() =>
              void runAction('json', async () => exportJSON(boardConfig), '棋盘配置已导出为 lingyun-board.json。')
            }
            onImportJSON={openImportDialog}
          />
        </div>

        <PropertyPanel
          selectedTile={selectedTile}
          selectedTileIndex={selectedTileIndex}
          onUpdateTile={updateTile}
          onRemoveTile={removeTile}
        />
      </main>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          void handleImportJSON(event);
        }}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-galgame-border bg-black/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[11px] tracking-[0.18em] text-text-secondary">{label}</p>
      <p className="mt-2 font-mono text-lg font-bold text-galgame-gold-orange">{value}</p>
    </div>
  );
}
