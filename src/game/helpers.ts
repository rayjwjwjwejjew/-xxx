import { levelRanges, tierPenalties } from '@/data/rules';
import type { BoardConfig, BoardTile, CompetencyColor, GameLogEntry, PenaltyTier, PlayerLevel, PlayerState } from '@/types';

export const sleep = (ms: number) => new Promise<void>((resolve) => {
  window.setTimeout(resolve, ms);
});

export const clampLogEntries = (entries: GameLogEntry[], max = 12) => entries.slice(0, max);

export const getPlayerLevel = (points: number): PlayerLevel => {
  const matched = levelRanges.find((range) => points >= range.min && (range.max === null || points <= range.max));
  return matched?.tier ?? 'A1';
};

export const refreshPlayerDerivedState = (player: PlayerState): PlayerState => ({
  ...player,
  level: getPlayerLevel(player.points),
  inCafeteria: player.inCafeteria && player.skipTurns > 0,
});

export const updatePlayer = (players: PlayerState[], playerId: string, updater: (player: PlayerState) => PlayerState) =>
  players.map((player) => (player.id === playerId ? refreshPlayerDerivedState(updater(player)) : player));

export const getTileByIndex = (boardConfig: BoardConfig, index: number): BoardTile | undefined =>
  boardConfig.tiles.find((tile) => tile.index === index);

export const getPropertyOwner = (players: PlayerState[], tileId: string): PlayerState | undefined =>
  players.find((player) => player.ownedProperties.includes(tileId));

export const getColorFamilyTiles = (boardConfig: BoardConfig, color: CompetencyColor) =>
  boardConfig.tiles.filter((tile) => tile.type === 'property' && tile.competencyColor === color);

export const getColorFamilyFCIds = (boardConfig: BoardConfig, color: CompetencyColor) =>
  getColorFamilyTiles(boardConfig, color)
    .filter((tile) => tile.propertyLevel === 'FC')
    .map((tile) => tile.id);

export const playerHasUnlockedAC = (player: PlayerState, boardConfig: BoardConfig, color: CompetencyColor) => {
  const fcIds = getColorFamilyFCIds(boardConfig, color);
  return fcIds.every((id) => player.ownedProperties.includes(id));
};

export const getPenaltyMeta = (tier: PenaltyTier) => {
  const matched = tierPenalties.find((item) => item.tier === tier);
  if (matched) {
    return matched;
  }
  const fallback = tierPenalties[0];
  if (!fallback) {
    throw new Error('未配置 T 记录规则。');
  }
  return fallback;
};

export const createLogEntry = (text: string, tone: GameLogEntry['tone'] = 'neutral'): GameLogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text,
  tone,
});
