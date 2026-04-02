import { createLogEntry, getPropertyOwner, getTileByIndex, refreshPlayerDerivedState, updatePlayer } from '@/game/helpers';
import { buildEventChoice, buildPropertyChoice, createEventReward, createPenaltyRecord, createPublicServiceReward, drawRandomPenaltyTier, getPenaltyLoss } from '@/game/rules';
import type { BoardConfig, FloatingFeedback, GameState, PendingChoice, PlayerState } from '@/types';

export interface ResolutionResult {
  nextPlayers: PlayerState[];
  logs: ReturnType<typeof createLogEntry>[];
  pendingChoice: PendingChoice | null;
  summary: string;
  feedbackBursts: FloatingFeedback[];
}

export const createInitialGameState = (): GameState => ({
  mode: 'play',
  players: [],
  currentPlayerIndex: 0,
  round: 1,
  diceValue: null,
  status: 'setup',
  logs: [createLogEntry('欢迎来到凌云大富翁。先创建 2 至 4 名玩家，再开始游玩。')],
  highlightedTileIndex: 0,
  pendingChoice: null,
  pendingTileIndex: null,
  config: {
    maxRounds: 12,
    passStartBonus: 10,
  },
  feedbackBursts: [],
});

export const resolveTileLanding = (players: PlayerState[], currentPlayer: PlayerState, boardConfig: BoardConfig): ResolutionResult => {
  const tile = getTileByIndex(boardConfig, currentPlayer.position);
  if (!tile) {
    return {
      nextPlayers: players,
      logs: [createLogEntry(`${currentPlayer.name} 落在空白格，本回合平稳结束。`)],
      pendingChoice: null,
      summary: '落在空白格。',
      feedbackBursts: [{ id: `empty-${Date.now()}`, text: '平稳经过', tone: 'info' }],
    };
  }

  const tilePrefix = `${currentPlayer.name} 来到了「${tile.name}」`;

  if (tile.type === 'start') {
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({ ...player, points: player.points + 10 }));
    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，获得起点鼓励 +10 分。`, 'positive')],
      pendingChoice: null,
      summary: '起点鼓励 +10 分。',
      feedbackBursts: [{ id: `start-${Date.now()}`, text: '+10 起点鼓励', tone: 'positive' }],
    };
  }

  if (tile.type === 'event') {
    const choice = buildEventChoice(currentPlayer);
    if (choice) {
      return {
        nextPlayers: players,
        logs: [createLogEntry(`${tilePrefix}，可以选择完成 PA 任务，或参与一次消 T 活动。`, 'positive')],
        pendingChoice: choice,
        summary: '触发事件选择。',
        feedbackBursts: [{ id: `event-${Date.now()}`, text: '事件卡已翻开', tone: 'event' }],
      };
    }

    const reward = createEventReward();
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({ ...player, points: player.points + reward.reward }));
    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，${reward.text}`, 'positive')],
      pendingChoice: null,
      summary: reward.text,
      feedbackBursts: [
        { id: `event-auto-${Date.now()}`, text: reward.rewardLabel, tone: 'event' },
        { id: `event-title-${Date.now() + 1}`, text: reward.title, tone: 'positive' },
      ],
    };
  }

  if (tile.type === 'penalty') {
    const tier = drawRandomPenaltyTier();
    const loss = getPenaltyLoss(tier);
    const penaltyRecord = createPenaltyRecord(tier);
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({
      ...player,
      points: player.points + loss,
      penalties: [...player.penalties, penaltyRecord],
      skipTurns: tier === 'T3' ? Math.max(player.skipTurns, 1) : player.skipTurns,
      inCafeteria: tier === 'T3' ? true : player.inCafeteria,
    }));

    const severeText = tier === 'T3' ? ' 严重违规，额外进入食堂停留 1 回合。' : '';
    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，触发 ${tier}，扣除 ${Math.abs(loss)} 分。${severeText}`, 'warning')],
      pendingChoice: null,
      summary: `触发 ${tier}，扣除 ${Math.abs(loss)} 分。`,
      feedbackBursts: [
        { id: `penalty-tier-${Date.now()}`, text: `${tier} 记录`, tone: 'warning' },
        { id: `penalty-loss-${Date.now() + 1}`, text: `${loss} 分`, tone: 'warning' },
      ],
    };
  }

  if (tile.type === 'study') {
    const shouldStudy = currentPlayer.level === 'A1' || currentPlayer.penalties.length > 0;
    if (!shouldStudy) {
      return {
        nextPlayers: players,
        logs: [createLogEntry(`${tilePrefix}，当前状态良好，无需停留。`)],
        pendingChoice: null,
        summary: '无需停留。',
        feedbackBursts: [{ id: `study-pass-${Date.now()}`, text: '状态良好', tone: 'info' }],
      };
    }

    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({
      ...player,
      skipTurns: Math.max(player.skipTurns, 1),
    }));

    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，由于当前为 A1 或仍有 T 记录，需要在自习室停留 1 回合。`, 'warning')],
      pendingChoice: null,
      summary: '需停留 1 回合。',
      feedbackBursts: [{ id: `study-stop-${Date.now()}`, text: '停留 1 回合', tone: 'warning' }],
    };
  }

  if (tile.type === 'publicService') {
    const reward = createPublicServiceReward();
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({ ...player, points: player.points + reward.reward }));
    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，${reward.text}`, 'positive')],
      pendingChoice: null,
      summary: reward.text,
      feedbackBursts: [{ id: `service-${Date.now()}`, text: reward.rewardLabel, tone: 'positive' }],
    };
  }

  if (tile.type === 'cafeteria') {
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({
      ...player,
      skipTurns: Math.max(player.skipTurns, 1),
      inCafeteria: true,
    }));
    return {
      nextPlayers,
      logs: [createLogEntry(`${tilePrefix}，本回合进入食堂区域整理状态，下回合暂停行动。`, 'warning')],
      pendingChoice: null,
      summary: '进入食堂停留。',
      feedbackBursts: [{ id: `cafeteria-${Date.now()}`, text: '食堂停留', tone: 'warning' }],
    };
  }

  if (tile.type === 'property') {
    const owner = getPropertyOwner(players, tile.id);
    if (owner) {
      if (owner.id === currentPlayer.id) {
        return {
          nextPlayers: players,
          logs: [createLogEntry(`${tilePrefix}，这里已经是你的素养成果点位。`, 'positive')],
          pendingChoice: null,
          summary: '回到自己的素养格。',
          feedbackBursts: [{ id: `own-property-${Date.now()}`, text: '回到自己的格子', tone: 'positive' }],
        };
      }

      return {
        nextPlayers: players,
        logs: [createLogEntry(`${tilePrefix}，该素养格已由 ${owner.name} 率先认领。`, 'neutral')],
        pendingChoice: null,
        summary: `该素养格已由 ${owner.name} 认领。`,
        feedbackBursts: [{ id: `owner-${Date.now()}`, text: `${owner.name} 已认领`, tone: 'info' }],
      };
    }

    const choice = buildPropertyChoice(tile, currentPlayer, boardConfig);
    return {
      nextPlayers: players,
      logs: [createLogEntry(`${tilePrefix}，你可以选择认领这张素养卡。`, 'positive')],
      pendingChoice: choice,
      summary: '触发素养认领选择。',
      feedbackBursts: [{ id: `property-${Date.now()}`, text: '可认领素养格', tone: 'event' }],
    };
  }

  return {
    nextPlayers: players,
    logs: [createLogEntry(`${tilePrefix}，本回合结束。`)],
    pendingChoice: null,
    summary: '本回合结束。',
    feedbackBursts: [{ id: `turn-end-${Date.now()}`, text: '回合结束', tone: 'neutral' }],
  };
};

export const applyPendingChoice = (
  optionId: string,
  players: PlayerState[],
  currentPlayer: PlayerState,
  boardConfig: BoardConfig,
): ResolutionResult => {
  const tile = getTileByIndex(boardConfig, currentPlayer.position);
  if (!tile) {
    return {
      nextPlayers: players,
      logs: [createLogEntry('没有找到当前格子，系统已跳过结算。')],
      pendingChoice: null,
      summary: '跳过结算。',
      feedbackBursts: [{ id: `skip-${Date.now()}`, text: '系统跳过结算', tone: 'info' }],
    };
  }

  if (optionId === 'event-pa') {
    const reward = createEventReward();
    return {
      nextPlayers: updatePlayer(players, currentPlayer.id, (player) => ({ ...player, points: player.points + reward.reward })),
      logs: [createLogEntry(`${currentPlayer.name} 选择了继续挑战，${reward.text}`, 'positive')],
      pendingChoice: null,
      summary: reward.text,
      feedbackBursts: [
        { id: `pa-title-${Date.now()}`, text: reward.title, tone: 'event' },
        { id: `pa-reward-${Date.now() + 1}`, text: reward.rewardLabel, tone: 'positive' },
      ],
    };
  }

  if (optionId === 'event-clear-penalty') {
    let clearedTier = 'T1';
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({
      ...player,
      points: player.points + 8,
      penalties: player.penalties
        .map((penalty, index) => {
          if (index !== 0 && !player.penalties.slice(0, index).some((item) => (item.tier === 'T1' || item.tier === 'T2') && item.remainingClearCount > 0)) {
            return penalty;
          }
          if ((penalty.tier === 'T1' || penalty.tier === 'T2') && penalty.remainingClearCount > 0) {
            clearedTier = penalty.tier;
            return {
              ...penalty,
              remainingClearCount: penalty.remainingClearCount - 1,
            };
          }
          return penalty;
        })
        .filter((penalty) => penalty.remainingClearCount > 0),
    }));

    return {
      nextPlayers,
      logs: [createLogEntry(`${currentPlayer.name} 参与了一次消 T 活动，${clearedTier} 清除进度 -1，并获得 +8 分。`, 'positive')],
      pendingChoice: null,
      summary: `完成一次消 T 活动，${clearedTier} 清除进度 -1。`,
      feedbackBursts: [
        { id: `clear-tier-${Date.now()}`, text: `${clearedTier} 进度 -1`, tone: 'event' },
        { id: `clear-bonus-${Date.now() + 1}`, text: '+8 修复奖励', tone: 'positive' },
      ],
    };
  }

  if (tile.type === 'property' && optionId !== 'skip-property') {
    const colorTiles = tile.competencyColor
      ? boardConfig.tiles.filter((item) => item.type === 'property' && item.competencyColor === tile.competencyColor)
      : [];

    const targetTiles = optionId === 'shortcut-ac'
      ? colorTiles.filter((item) => !currentPlayer.ownedProperties.includes(item.id))
      : [tile];

    const totalGain = targetTiles.reduce((sum, item) => sum + item.points, 0);
    const targetIds = targetTiles.map((item) => item.id);
    const nextPlayers = updatePlayer(players, currentPlayer.id, (player) => ({
      ...player,
      points: player.points + totalGain,
      ownedProperties: [...new Set([...player.ownedProperties, ...targetIds])],
    }));

    const targetNames = targetTiles.map((item) => item.name).join('、');
    const actionText = optionId === 'shortcut-ac' ? '使用特殊路径直升' : '成功认领';
    return {
      nextPlayers,
      logs: [createLogEntry(`${currentPlayer.name}${actionText}「${targetNames}」，获得 +${totalGain} 分。`, 'positive')],
      pendingChoice: null,
      summary: `${actionText} ${targetNames}，获得 +${totalGain} 分。`,
      feedbackBursts: [
        { id: `property-name-${Date.now()}`, text: targetNames, tone: 'event' },
        { id: `property-gain-${Date.now() + 1}`, text: `+${totalGain} 成长积分`, tone: 'positive' },
      ],
    };
  }

  return {
    nextPlayers: players,
    logs: [createLogEntry(`${currentPlayer.name} 暂时放弃了当前选择。`)],
    pendingChoice: null,
    summary: '已跳过当前选择。',
    feedbackBursts: [{ id: `skip-choice-${Date.now()}`, text: '已跳过当前选择', tone: 'info' }],
  };
};

export const advanceTurn = (players: PlayerState[], currentPlayerIndex: number, currentRound: number, maxRounds: number) => {
  const nextPlayers = [...players].map((player) => refreshPlayerDerivedState(player));
  const logs: ReturnType<typeof createLogEntry>[] = [];

  if (nextPlayers.length === 0) {
    return {
      players: nextPlayers,
      currentPlayerIndex: 0,
      round: currentRound,
      logs,
      finished: false,
    };
  }

  let index = currentPlayerIndex;
  let round = currentRound;
  let safety = 0;

  while (safety < nextPlayers.length) {
    index = (index + 1) % nextPlayers.length;
    if (index === 0) {
      round += 1;
    }

    const candidate = nextPlayers[index];
    if (!candidate) {
      break;
    }
    if (candidate.skipTurns > 0) {
      candidate.skipTurns -= 1;
      const area = candidate.inCafeteria ? '食堂' : '自习室';
      logs.push(createLogEntry(`${candidate.name} 因为仍在${area}停留，跳过本回合。`, 'warning'));
      candidate.inCafeteria = candidate.inCafeteria && candidate.skipTurns > 0;
      safety += 1;
      continue;
    }

    return {
      players: nextPlayers.map((player) => refreshPlayerDerivedState(player)),
      currentPlayerIndex: index,
      round,
      logs,
      finished: round > maxRounds,
    };
  }

  return {
    players: nextPlayers.map((player) => refreshPlayerDerivedState(player)),
    currentPlayerIndex: index,
    round,
    logs,
    finished: round > maxRounds,
  };
};

export const getWinner = (players: PlayerState[]) =>
  [...players].sort((left, right) => right.points - left.points)[0];
