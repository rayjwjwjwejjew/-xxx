import { paTaskCategories, serviceOptions } from '@/data/rules';
import type {
  BoardConfig,
  BoardTile,
  GameActionOption,
  PendingChoice,
  PenaltyRecord,
  PenaltyTier,
  PlayerState,
} from '@/types';
import { getColorFamilyTiles, getPenaltyMeta, playerHasUnlockedAC } from '@/game/helpers';

const penaltySequence: PenaltyTier[] = ['T1', 'T1', 'T2', 'T2', 'T3'];

const eventDeck = [
  {
    title: '晨会分享被点名表扬',
    kicker: 'PA 任务卡',
    narrative: '你在晨会中分享了高效复盘方法，老师和同学都给出了积极反馈。',
    flavor: '一次公开表达，让你的影响力自然扩散。',
    min: 12,
    max: 22,
    icon: 'sparkles' as const,
  },
  {
    title: '班级协作任务提前完成',
    kicker: 'PA 任务卡',
    narrative: '你主动协调分工，让原本容易拖延的小组工作顺利推进。',
    flavor: '协作不是分配任务，而是帮助彼此更快进入状态。',
    min: 10,
    max: 20,
    icon: 'flag' as const,
  },
  {
    title: '校园活动组织获得认可',
    kicker: 'PA 任务卡',
    narrative: '你在活动筹备中承担关键工作，流程井然有序，收获了老师认可。',
    flavor: '一次可靠的组织力，会被很多人默默记住。',
    min: 14,
    max: 24,
    icon: 'star' as const,
  },
  {
    title: '宿舍互助氛围加分',
    kicker: 'PA 任务卡',
    narrative: '你主动帮助同学整理时间安排，让宿舍生活更有节奏感。',
    flavor: '真正的成长，常常发生在别人看不见的日常里。',
    min: 9,
    max: 18,
    icon: 'heart' as const,
  },
] as const;

export const getRandomDiceValue = () => Math.floor(Math.random() * 6) + 1;

export const drawRandomPenaltyTier = () => penaltySequence[Math.floor(Math.random() * penaltySequence.length)] ?? 'T1';

export const createPenaltyRecord = (tier: PenaltyTier): PenaltyRecord => {
  const meta = getPenaltyMeta(tier);
  return {
    id: `${tier}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tier,
    remainingClearCount: meta.clearRequirement,
  };
};

export const createEventReward = () => {
  const category = paTaskCategories[Math.floor(Math.random() * paTaskCategories.length)] ?? paTaskCategories[0];
  const eventCard = eventDeck[Math.floor(Math.random() * eventDeck.length)] ?? eventDeck[0];
  if (!category || !eventCard) {
    throw new Error('未配置事件卡或 PA 任务分类。');
  }
  const reward = eventCard.min + Math.floor(Math.random() * (eventCard.max - eventCard.min + 1));
  return {
    category,
    reward,
    title: eventCard.title,
    kicker: eventCard.kicker,
    narrative: eventCard.narrative,
    flavor: eventCard.flavor,
    icon: eventCard.icon,
    text: `你完成了一项「${category.name}」任务，获得 +${reward} 凌云积分。`,
    rewardLabel: `+${reward} 凌云积分`,
  };
};

export const createPublicServiceReward = () => {
  const label = serviceOptions[Math.floor(Math.random() * serviceOptions.length)] ?? serviceOptions[0];
  const reward = 12 + Math.floor(Math.random() * 12);
  return {
    reward,
    text: `你参与了「${label}」，获得 +${reward} 凌云积分。`,
    rewardLabel: `+${reward} 公益积分`,
  };
};

export const getFirstClearablePenalty = (player: PlayerState) =>
  player.penalties.find((penalty) => penalty.tier === 'T1' || penalty.tier === 'T2');

export const buildPropertyChoice = (
  tile: BoardTile,
  player: PlayerState,
  boardConfig: BoardConfig,
): PendingChoice | null => {
  if (tile.type !== 'property' || !tile.competencyColor || !tile.propertyLevel) {
    return null;
  }

  const colorTiles = getColorFamilyTiles(boardConfig, tile.competencyColor);
  const missingIds = colorTiles
    .filter((item) => item.propertyLevel === 'FC' && !player.ownedProperties.includes(item.id))
    .map((item) => item.id);

  const ownedNames = colorTiles
    .filter((item) => player.ownedProperties.includes(item.id))
    .map((item) => item.name);

  if (tile.propertyLevel === 'FC') {
    return {
      type: 'property',
      title: `认领 ${tile.name}`,
      description: `这是一个基础素养格。认领后可获得 +${tile.points} 积分，并为同色 AC 解锁做准备。${ownedNames.length ? ` 你当前已拥有：${ownedNames.join('、')}。` : ''}`,
      tileIndex: tile.index,
      presentation: {
        tone: 'property',
        kicker: '素养认领',
        highlight: `+${tile.points} 成长积分`,
        flavor: '每一次认领，都会让你的成长路径更完整。',
        icon: tile.propertyLevel === 'FC' ? 'flag' : 'star',
      },
      options: [
        { id: 'claim-fc', label: '认领 FC', description: `获得 +${tile.points} 积分`, badge: '基础素养', variant: 'primary' },
        { id: 'skip-property', label: '暂不认领', description: '本回合跳过这张素养卡', variant: 'secondary' },
      ],
    };
  }

  const unlocked = playerHasUnlockedAC(player, boardConfig, tile.competencyColor);
  const shortcutTiles = colorTiles.filter((item) => (item.propertyLevel === 'FC' || item.id === tile.id) && !player.ownedProperties.includes(item.id));
  const shortcutGain = shortcutTiles.reduce((total, item) => total + item.points, 0);

  const options: GameActionOption[] = unlocked
    ? [
        { id: 'claim-ac', label: '解锁 AC', description: `获得 +${tile.points} 积分`, badge: '进阶素养', variant: 'primary' },
        { id: 'skip-property', label: '暂不认领', description: '本回合跳过这张素养卡', variant: 'secondary' },
      ]
    : [
        {
          id: 'shortcut-ac',
          label: '直升 AC',
          description: `自动补齐同色 FC，并一次获得 +${shortcutGain} 积分`,
          badge: '特殊路径',
          variant: 'primary',
        },
        { id: 'skip-property', label: '暂不认领', description: '保留到以后再解锁', variant: 'secondary' },
      ];

  return {
    type: 'property',
    title: `认领 ${tile.name}`,
    description: unlocked
      ? '你已经集齐同色 FC，可以直接认领这张进阶素养卡。'
      : `你还未集齐同色 FC。可以使用特殊路径直升 AC，系统会自动补齐当前颜色下所有缺失的 FC。当前缺失 ${missingIds.length} 张。`,
    tileIndex: tile.index,
    presentation: {
      tone: 'property',
      kicker: '素养认领',
      highlight: unlocked ? `+${tile.points} 成长积分` : `直升可得 +${shortcutGain}`,
      flavor: unlocked ? '完整的前置积累，终于迎来进阶回报。' : '也可以选择一次跨越，但代价是更早作出判断。',
      icon: 'star',
    },
    options,
  };
};

export const buildEventChoice = (player: PlayerState): PendingChoice | null => {
  const penalty = getFirstClearablePenalty(player);
  if (!penalty) {
    return null;
  }

  return {
    type: 'event',
    title: '事件格 · 成长选择',
    description: `你当前有一条可修复的 ${penalty.tier} 记录。你可以继续完成 PA 任务拿分，也可以参与一次消 T 活动。`,
    presentation: {
      tone: 'event',
      kicker: '校园事件卡',
      highlight: `当前可修复：${penalty.tier}`,
      flavor: '事件格不仅带来奖励，也可能成为一次修复成长轨迹的机会。',
      icon: 'sparkles',
    },
    options: [
      { id: 'event-pa', label: '完成 PA 任务', description: '抽取一张校园任务卡并获得随机积分', badge: '正向成长', variant: 'primary' },
      { id: 'event-clear-penalty', label: '参与消 T 活动', description: `减少 1 次 ${penalty.tier} 清除进度，并获得少量积分`, badge: '修复路线', variant: 'secondary' },
    ],
  };
};

export const getPenaltyLoss = (tier: PenaltyTier) => getPenaltyMeta(tier).points;
