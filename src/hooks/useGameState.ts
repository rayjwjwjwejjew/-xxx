import { useMemo, useRef, useState } from 'react';

import { clampLogEntries, createLogEntry, refreshPlayerDerivedState, sleep } from '@/game/helpers';
import { advanceTurn, applyPendingChoice, createInitialGameState, getWinner, resolveTileLanding } from '@/game/engine';
import { getRandomDiceValue } from '@/game/rules';
import { createPlayersFromSetup, defaultGameConfig } from '@/game/setup';
import type { BoardConfig, FloatingFeedback, GameLogEntry, PlayerSetupInput } from '@/types';

export function useGameState(boardConfig: BoardConfig) {
  const [gameState, setGameState] = useState(createInitialGameState);
  const feedbackTimerRef = useRef<number | null>(null);

  const currentPlayer = useMemo(
    () => gameState.players[gameState.currentPlayerIndex] ?? null,
    [gameState.currentPlayerIndex, gameState.players],
  );

  const appendLogs = (entries: GameLogEntry[]) => {
    setGameState((current) => ({
      ...current,
      logs: clampLogEntries([...entries.reverse(), ...current.logs]),
    }));
  };

  const pushFeedbacks = (bursts: FloatingFeedback[]) => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setGameState((current) => ({
      ...current,
      feedbackBursts: bursts,
    }));

    feedbackTimerRef.current = window.setTimeout(() => {
      setGameState((current) => ({ ...current, feedbackBursts: [] }));
    }, 1800);
  };

  const setMode = (mode: 'editor' | 'play') => {
    setGameState((current) => ({ ...current, mode }));
  };

  const startGame = (inputs: PlayerSetupInput[]) => {
    const players = createPlayersFromSetup(inputs).map((player) => refreshPlayerDerivedState(player));
    setGameState({
      mode: 'play',
      players,
      currentPlayerIndex: 0,
      round: 1,
      diceValue: null,
      status: 'idle',
      logs: clampLogEntries([createLogEntry(`游戏开始！本局共 ${players.length} 名玩家，先手是 ${players[0]?.name ?? '—'}。`, 'positive')]),
      highlightedTileIndex: 0,
      pendingChoice: null,
      pendingTileIndex: null,
      config: defaultGameConfig,
      lastActionSummary: '等待掷骰。',
      feedbackBursts: [],
    });
  };

  const resetPlayground = () => {
    setGameState((current) => ({
      ...createInitialGameState(),
      mode: current.mode,
      config: current.config,
      feedbackBursts: [],
    }));
  };

  const rollDice = async () => {
    if (!currentPlayer || gameState.status !== 'idle') {
      return;
    }

    const diceValue = getRandomDiceValue();
    setGameState((current) => ({
      ...current,
      status: 'rolling',
      diceValue,
      lastActionSummary: `${currentPlayer.name} 正在掷骰…`,
      feedbackBursts: [{ id: `rolling-${Date.now()}`, text: '骰子滚动中', tone: 'event' }],
    }));
    await sleep(900);

    pushFeedbacks([{ id: `dice-${Date.now()}`, text: `${diceValue} 点`, tone: 'event' }]);
    setGameState((current) => ({
      ...current,
      status: 'moving',
      lastActionSummary: `${currentPlayer.name} 掷出了 ${diceValue} 点。`,
    }));

    let passedStartCount = 0;
    for (let step = 0; step < diceValue; step += 1) {
      await sleep(280);
      setGameState((current) => {
        const player = current.players[current.currentPlayerIndex];
        if (!player) {
          return current;
        }
        const nextPosition = (player.position + 1) % boardConfig.size;
        const didPassStart = nextPosition === 0;
        if (didPassStart) {
          passedStartCount += 1;
        }
        const nextPlayers = current.players.map((item, index) =>
          index === current.currentPlayerIndex
            ? refreshPlayerDerivedState({
                ...item,
                position: nextPosition,
                points: didPassStart ? item.points + current.config.passStartBonus : item.points,
              })
            : item,
        );
        return {
          ...current,
          players: nextPlayers,
          highlightedTileIndex: nextPosition,
        };
      });
    }

    const latestPlayer = gameState.players[gameState.currentPlayerIndex];
    const resolvedPlayer = latestPlayer ? { ...latestPlayer, position: (latestPlayer.position + diceValue) % boardConfig.size } : null;
    const finalPlayers = resolvedPlayer
      ? gameState.players.map((player, index) =>
          index === gameState.currentPlayerIndex
            ? refreshPlayerDerivedState({
                ...player,
                position: resolvedPlayer.position,
                points: player.points + passedStartCount * gameState.config.passStartBonus,
              })
            : player,
        )
      : gameState.players;

    const actingPlayer = finalPlayers[gameState.currentPlayerIndex];
    if (!actingPlayer) {
      return;
    }

    const resolution = resolveTileLanding(finalPlayers, actingPlayer, boardConfig);
    setGameState((current) => ({
      ...current,
      players: resolution.nextPlayers,
      status: resolution.pendingChoice ? 'choice' : 'resolving',
      pendingChoice: resolution.pendingChoice,
      pendingTileIndex: actingPlayer.position,
      highlightedTileIndex: actingPlayer.position,
      lastActionSummary: resolution.summary,
      feedbackBursts: resolution.feedbackBursts,
    }));

    const passLog = passedStartCount > 0
      ? [createLogEntry(`${actingPlayer.name} 经过起点，额外获得 +${passedStartCount * gameState.config.passStartBonus} 分。`, 'positive')]
      : [];
    appendLogs([...passLog, ...resolution.logs]);
    pushFeedbacks([
      ...(passedStartCount > 0 ? [{ id: `pass-start-${Date.now()}`, text: `+${passedStartCount * gameState.config.passStartBonus} 起点奖励`, tone: 'positive' as const }] : []),
      ...resolution.feedbackBursts,
    ]);

    if (!resolution.pendingChoice) {
      await sleep(520);
      await finishTurn(resolution.nextPlayers);
    }
  };

  const finishTurn = async (playersOverride?: typeof gameState.players) => {
    const players = playersOverride ?? gameState.players;
    const advanced = advanceTurn(players, gameState.currentPlayerIndex, gameState.round, gameState.config.maxRounds);

    if (advanced.logs.length > 0) {
      appendLogs(advanced.logs);
      pushFeedbacks(advanced.logs.map((entry, index) => ({
        id: `advance-${Date.now()}-${index}`,
        text: entry.text.includes('跳过') ? '跳过 1 回合' : '进入下一位玩家',
        tone: entry.tone === 'warning' ? 'warning' : 'info',
      })));
    }

    if (advanced.finished) {
      const winner = getWinner(advanced.players);
      setGameState((current) => ({
        ...current,
        players: advanced.players,
        currentPlayerIndex: advanced.currentPlayerIndex,
        round: advanced.round,
        status: 'finished',
        pendingChoice: {
          type: 'info',
          title: '本局已结束',
          description: winner
            ? `经过 ${current.config.maxRounds} 轮较量，${winner.name} 以 ${winner.points} 分暂列第一，成为本局冠军。`
            : '本局结束。',
          presentation: {
            tone: 'positive',
            kicker: '胜负结算',
            highlight: winner ? `${winner.name} · ${winner.points} 分` : '本局结束',
            flavor: winner ? '成长并不是一次冲刺，而是持续做出更好的选择。' : '感谢参与本局体验。',
            icon: 'star',
          },
          options: [{ id: 'restart-play', label: '重新开局', description: '回到玩家设置界面', badge: '重新体验', variant: 'primary' }],
        },
        winnerId: winner?.id,
        lastActionSummary: winner ? `${winner.name} 获胜。` : '本局结束。',
        feedbackBursts: winner ? [{ id: `winner-${Date.now()}`, text: `${winner.name} 获胜`, tone: 'positive' }] : [],
      }));
      appendLogs([createLogEntry(winner ? `${winner.name} 以 ${winner.points} 分赢得本局。` : '本局结束。', 'positive')]);
      return;
    }

    setGameState((current) => ({
      ...current,
      players: advanced.players,
      currentPlayerIndex: advanced.currentPlayerIndex,
      round: advanced.round,
      diceValue: null,
      status: 'idle',
      pendingChoice: null,
      pendingTileIndex: null,
      lastActionSummary: `轮到 ${advanced.players[advanced.currentPlayerIndex]?.name ?? '下一位玩家'}。`,
      feedbackBursts: current.feedbackBursts,
    }));
  };

  const choosePendingAction = async (optionId: string) => {
    if (!currentPlayer || !gameState.pendingChoice) {
      return;
    }

    if (optionId === 'restart-play') {
      resetPlayground();
      return;
    }

    setGameState((current) => ({ ...current, status: 'resolving' }));
    const resolution = applyPendingChoice(optionId, gameState.players, currentPlayer, boardConfig);
    setGameState((current) => ({
      ...current,
      players: resolution.nextPlayers,
      pendingChoice: null,
      pendingTileIndex: null,
      lastActionSummary: resolution.summary,
      feedbackBursts: resolution.feedbackBursts,
    }));
    appendLogs(resolution.logs);
    pushFeedbacks(resolution.feedbackBursts);
    await sleep(460);
    await finishTurn(resolution.nextPlayers);
  };

  return {
    currentPlayer,
    gameState,
    rollDice,
    setMode,
    resetPlayground,
    startGame,
    choosePendingAction,
  };
}
