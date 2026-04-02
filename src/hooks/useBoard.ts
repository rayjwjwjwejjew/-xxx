import { useMemo, useState } from 'react';

import { defaultBoardConfig } from '@/data/defaultBoard';
import type { BoardConfig, BoardTile, TileTemplate } from '@/types';

const cloneBoardConfig = (board: BoardConfig): BoardConfig => ({
  size: board.size,
  tiles: board.tiles.map((tile) => ({ ...tile })),
});

const createEmptyBoard = (size: number): BoardConfig => ({
  size,
  tiles: [],
});

const sortTiles = (tiles: BoardTile[]) => [...tiles].sort((left, right) => left.index - right.index);

export function useBoard(initialBoard: BoardConfig = defaultBoardConfig) {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(() => cloneBoardConfig(initialBoard));
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  const selectedTile = useMemo(
    () => boardConfig.tiles.find((tile) => tile.index === selectedTileIndex) ?? null,
    [boardConfig.tiles, selectedTileIndex],
  );

  const selectTile = (index: number | null) => {
    setSelectedTileIndex(index);
  };

  const resetBoard = () => {
    setBoardConfig(cloneBoardConfig(initialBoard));
    setSelectedTileIndex(null);
  };

  const clearBoard = () => {
    setBoardConfig(createEmptyBoard(initialBoard.size));
    setSelectedTileIndex(null);
  };

  const replaceBoard = (nextBoard: BoardConfig) => {
    setBoardConfig(cloneBoardConfig(nextBoard));
    setSelectedTileIndex(null);
  };

  const placeTile = (index: number, template: TileTemplate) => {
    const nextTile: BoardTile = {
      id: `tile-${index}`,
      index,
      type: template.type,
      name: template.name,
      description: template.description,
      points: template.points,
      competencyColor: template.competencyColor,
      propertyLevel: template.propertyLevel,
      icon: template.icon,
    };

    setBoardConfig((currentBoard) => ({
      ...currentBoard,
      tiles: sortTiles([...currentBoard.tiles.filter((tile) => tile.index !== index), nextTile]),
    }));
    setSelectedTileIndex(index);
  };

  const updateTile = (index: number, patch: Partial<Omit<BoardTile, 'id' | 'index'>>) => {
    setBoardConfig((currentBoard) => ({
      ...currentBoard,
      tiles: currentBoard.tiles.map((tile) =>
        tile.index === index
          ? {
              ...tile,
              ...patch,
            }
          : tile,
      ),
    }));
  };

  const removeTile = (index: number) => {
    setBoardConfig((currentBoard) => ({
      ...currentBoard,
      tiles: currentBoard.tiles.filter((tile) => tile.index !== index),
    }));
    setSelectedTileIndex(index);
  };

  return {
    boardConfig,
    selectedTile,
    selectedTileIndex,
    clearBoard,
    placeTile,
    removeTile,
    replaceBoard,
    resetBoard,
    selectTile,
    updateTile,
  };
}
