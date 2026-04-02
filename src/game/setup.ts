import { startingPoints } from '@/data/rules';
import { getPlayerLevel } from '@/game/helpers';
import type { GameConfig, PlayerSetupInput, PlayerState } from '@/types';

export const defaultGameConfig: GameConfig = {
  maxRounds: 12,
  passStartBonus: 10,
};

export const createPlayersFromSetup = (inputs: PlayerSetupInput[]): PlayerState[] =>
  inputs.map((input) => ({
    id: input.id,
    name: input.name.trim() || '未命名玩家',
    color: input.color,
    position: 0,
    points: startingPoints,
    level: getPlayerLevel(startingPoints),
    penalties: [],
    ownedProperties: [],
    skipTurns: 0,
    inCafeteria: false,
  }));
