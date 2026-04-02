import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { Canvas } from '@/components/Canvas';
import { ExportButtons } from '@/components/ExportButtons';
import { Navbar } from '@/components/Navbar';
import { PropertyPanel } from '@/components/PropertyPanel';
import { RulesModal } from '@/components/RulesModal';
import { Sidebar } from '@/components/Sidebar';
import { DicePanel } from '@/components/play/DicePanel';
import { GameHUD } from '@/components/play/GameHUD';
import { GameLog } from '@/components/play/GameLog';
import { GameModal } from '@/components/play/GameModal';
import { PlayerSidebar } from '@/components/play/PlayerSidebar';
import { SetupPanel } from '@/components/play/SetupPanel';
import { competencies } from '@/data/competencies';
import { theme } from '@/styles/theme';
import { useBoard } from '@/hooks/useBoard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useExport } from '@/hooks/useExport';
import { useGameState } from '@/hooks/useGameState';
import type { BoardConfig, BoardTile, CompetencyColor, PlayerSetupInput, PropertyLevel, TileTemplate, TileType } from '@/types';
import { exportJSON } from '@/utils/exportJSON';
import { exportPDF } from '@/utils/exportPDF';
import { exportPNG } from '@/utils/exportPNG';
import { exportPuzzlePDF } from '@/utils/exportPuzzle';

const tileTypes: TileType[] = ['start', 'event', 'penalty', 'study', 'publicService', 'cafeteria', 'property'];
const propertyLevels: PropertyLevel[] = ['FC', 'AC'];
const competencyColors: CompetencyColor[] = competencies.map((item) => item.color);

const defaultPlayerInputs = (): PlayerSetupInput[] => [
  { id: 'player-1', name: '林汐', color: theme.colors.playerTokens[0] },
  { id: 'player-2', name: '周越', color: theme.colors.playerTokens[1] },
];

const particles = Array.from({ length: 18 }).map((_, index) => ({
  left: `${6 + ((index * 5) % 88)}%`,
  top: `${8 + ((index * 7) % 80)}%`,
  size: `${3 + (index % 4)}px`,
  duration: `${6 + (index % 5)}s`,
  delay: `${(index % 4) * 0.8}s`,
}));

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isTileType = (value: unknown): value is TileType => typeof value === 'string' && tileTypes.includes(value as TileType);
const isPropertyLevel = (value: unknown): value is PropertyLevel => typeof value === 'string' && propertyLevels.includes(value as PropertyLevel);
const isCompetencyColor = (value: unknown): value is CompetencyColor => typeof value === 'string' && competencyColors.includes(value as CompetencyColor);

const isBoardTile = (value: unknown): value is BoardTile => {
  if (!isObject(value)) return false;
  const { id, index, type, name, description, points, competencyColor, propertyLevel, icon } = value;
  if (typeof id !== 'string' || typeof index !== 'number' || !isTileType(type) || typeof name !== 'string' || typeof description !== 'string' || typeof points !== 'number') {
    return false;
  }
  if (competencyColor !== undefined && !isCompetencyColor(competencyColor)) return false;
  if (propertyLevel !== undefined && !isPropertyLevel(propertyLevel)) return false;
  if (icon !== undefined && typeof icon !== 'string') return false;
  return true;
};

const parseBoardConfig = (value: unknown): BoardConfig => {
  if (!isObject(value)) throw new Error('导入失败：JSON 顶层结构不正确。');
  const { size, tiles } = value;
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 28 || size > 32 || size % 4 !== 0) {
    throw new Error('导入失败：棋盘 size 必须是 28 到 32 之间、且可被 4 整除的整数。');
  }
  if (!Array.isArray(tiles) || !tiles.every(isBoardTile)) {
    throw new Error('导入失败：tiles 字段不合法。');
  }
  return { size, tiles: [...tiles].sort((left, right) => left.index - right.index) };
};

export function Layout() {
  const boardRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [setupInputs, setSetupInputs] = useState<PlayerSetupInput[]>(defaultPlayerInputs);

  const {
    boardConfig,
    clearBoard,
    selectedTile,
    selectedTileIndex,
    placeTile,
    removeTile,
    replaceBoard,
    resetBoard,
    selectTile,
    updateTile,
  } = useBoard();
  const { draggingTemplate, dropTargetIndex, endDragging, setDropTargetIndex, startDragging } = useDragAndDrop();
  const { activeAction, isBusy, runAction, setStatusMessage, statusMessage } = useExport();
  const { currentPlayer, gameState, rollDice, setMode, resetPlayground, startGame, choosePendingAction } = useGameState(boardConfig);

  const boardStats = useMemo(
    () => ({ filledTiles: boardConfig.tiles.length, emptyTiles: boardConfig.size - boardConfig.tiles.length }),
    [boardConfig.size, boardConfig.tiles.length],
  );

  const handleDropTemplate = (index: number, template: TileTemplate) => {
    placeTile(index, template);
    endDragging();
    setStatusMessage({ tone: 'success', text: `已将「${template.name}」放置到第 ${index + 1} 格。` });
  };

  const ensureBoardElement = () => {
    const element = boardRef.current;
    if (!element) throw new Error('暂时无法读取棋盘区域，请刷新页面后重试。');
    return element;
  };

  const openImportDialog = () => importInputRef.current?.click();

  const handleImportJSON = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await runAction('import', async () => {
      const parsed = parseBoardConfig(JSON.parse(await file.text()));
      replaceBoard(parsed);
    }, `已成功导入 ${file.name}。`);
    event.target.value = '';
  };

  const handleClearBoard = () => {
    clearBoard();
    setStatusMessage({ tone: 'success', text: '已创建新地图，棋盘已清空。' });
  };

  const handleSwitchMode = (mode: 'editor' | 'play') => {
    setMode(mode);
    if (mode === 'editor') {
      selectTile(null);
    }
  };

  const handleAddPlayer = () => {
    if (setupInputs.length >= 4) return;
    const nextIndex = setupInputs.length;
    setSetupInputs((current) => [
      ...current,
      {
        id: `player-${Date.now()}-${nextIndex}`,
        name: `玩家${nextIndex + 1}`,
        color: theme.colors.playerTokens[nextIndex % theme.colors.playerTokens.length] ?? theme.colors.playerTokens[0],
      },
    ]);
  };

  const handleStartGame = () => {
    const validPlayers = setupInputs.map((input) => ({ ...input, name: input.name.trim() })).filter((input) => input.name.length > 0);
    if (validPlayers.length < 2) {
      setStatusMessage({ tone: 'error', text: '至少需要 2 名玩家才能开始。' });
      return;
    }
    startGame(validPlayers);
    setStatusMessage({ tone: 'success', text: '本地热座模式已开始，祝你们玩得开心。' });
  };

  const handleResetPlay = () => {
    resetPlayground();
    setSetupInputs(defaultPlayerInputs());
    setStatusMessage({ tone: 'info', text: '已回到玩家设置界面。' });
  };

  return (
    <div className="app-shell min-h-screen text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="particle"
            style={{ left: particle.left, top: particle.top, ['--size' as string]: particle.size, ['--duration' as string]: particle.duration, ['--delay' as string]: particle.delay }}
          />
        ))}
      </div>

      <Navbar
        mode={gameState.mode}
        activeAction={activeAction}
        isBusy={isBusy}
        onImportJSON={openImportDialog}
        onNewMap={handleClearBoard}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetPlay={handleResetPlay}
        onSaveJSON={() => void runAction('save', async () => exportJSON(boardConfig), '棋盘配置已保存为 lingyun-board.json。')}
        onSwitchMode={handleSwitchMode}
      />

      {statusMessage ? (
        <div className="mx-auto mt-4 max-w-[1600px] px-4 lg:px-6">
          <div className={[
            'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur-sm',
            statusMessage.tone === 'success' ? 'border-emerald-100 bg-emerald-50/90 text-emerald-600' : statusMessage.tone === 'error' ? 'border-rose-100 bg-rose-50/90 text-rose-600' : 'border-sky-100 bg-sky-50/90 text-sky-600',
          ].join(' ')}>
            {statusMessage.tone === 'success' ? <CheckCircle2 size={16} /> : statusMessage.tone === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 mx-auto flex max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 lg:px-6 lg:py-6">
        {gameState.mode === 'editor' ? (
          <>
            <section className="clean-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div>
                <div className="panel-kicker">编辑模式</div>
                <h2 className="panel-heading">继续完善棋盘配置，再随时切到游玩模式体验</h2>
              </div>
              <div className="grid gap-3 text-center text-xs sm:grid-cols-4">
                <MetricPill label="已放置" value={`${boardStats.filledTiles} 格`} />
                <MetricPill label="空位" value={`${boardStats.emptyTiles} 格`} />
                <MetricPill label="总格数" value={`${boardConfig.size} 格`} />
                <MetricPill label="当前状态" value={selectedTileIndex === null ? '未选中' : `第 ${selectedTileIndex + 1} 格`} />
              </div>
            </section>

            <div className="flex flex-1 flex-col gap-4 xl:flex-row">
              <Sidebar draggingTemplateId={draggingTemplate?.templateId ?? null} onDragStartTemplate={startDragging} onDragEndTemplate={endDragging} />
              <Canvas
                boardConfig={boardConfig}
                boardRef={boardRef}
                selectedTileIndex={selectedTileIndex}
                dropTargetIndex={dropTargetIndex}
                mode="editor"
                onSelectTile={selectTile}
                onDropTemplate={handleDropTemplate}
                onHoverDropTarget={setDropTargetIndex}
              />
              <PropertyPanel
                selectedTile={selectedTile}
                selectedTileIndex={selectedTileIndex}
                onRemoveTile={removeTile}
                onUpdateTile={updateTile}
              />
            </div>

            <ExportButtons
              activeAction={activeAction}
              isBusy={isBusy}
              onExportJSON={() => void runAction('save', async () => exportJSON(boardConfig), '棋盘配置已保存为 lingyun-board.json。')}
              onExportPDF={() => void runAction('pdf', async () => exportPDF(ensureBoardElement()), '棋盘 PDF 已导出。')}
              onExportPNG={() => void runAction('png', async () => exportPNG(ensureBoardElement()), '棋盘 PNG 已导出。')}
              onExportPuzzlePDF={() => void runAction('puzzle', async () => exportPuzzlePDF(ensureBoardElement()), '拼图版 PDF 已导出。')}
              onImportJSON={openImportDialog}
            />
          </>
        ) : gameState.status === 'setup' || gameState.players.length === 0 ? (
          <SetupPanel
            inputs={setupInputs}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={(id) => setSetupInputs((current) => current.filter((item) => item.id !== id))}
            onUpdatePlayer={(id, patch) => setSetupInputs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))}
            onStart={handleStartGame}
          />
        ) : (
          <>
            <GameHUD currentPlayer={currentPlayer} gameState={gameState} />
            <div className="flex flex-1 flex-col gap-4 xl:flex-row">
              <PlayerSidebar currentPlayerId={currentPlayer?.id ?? null} players={gameState.players} />
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <Canvas
                  boardConfig={boardConfig}
                  boardRef={boardRef}
                  selectedTileIndex={null}
                  dropTargetIndex={null}
                  mode="play"
                  highlightedTileIndex={gameState.highlightedTileIndex}
                  players={gameState.players}
                  currentPlayerId={currentPlayer?.id ?? null}
                  gameStatus={gameState.status}
                  feedbackBursts={gameState.feedbackBursts}
                />
                <DicePanel canRoll={gameState.status === 'idle'} gameState={gameState} onRollDice={() => void rollDice()} />
              </div>
            </div>
            <GameLog logs={gameState.logs} />
          </>
        )}
      </main>

      <GameModal choice={gameState.pendingChoice} onChoose={(optionId) => void choosePendingAction(optionId)} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportJSON} />
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-white/70 bg-white/70 px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 font-mono text-base font-semibold text-slate-700">{value}</p>
    </div>
  );
}
