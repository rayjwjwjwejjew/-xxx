import type {
  LevelRange,
  PaTaskCategory,
  SpecialTileDefinition,
  TierPenalty,
} from '@/types';

export const gameMeta = {
  title: '云谷高中·凌云大富翁地图编辑器',
  englishTitle: 'Yungu Lingyun Monopoly Map Maker',
  scoreName: '凌云积分',
} as const;

export const startingPoints = 100;

export const boardTileCountOptions = {
  min: 28,
  recommended: 28,
  max: 32,
} as const;

export const levelRanges: LevelRange[] = [
  { tier: 'A1', min: 100, max: 199 },
  { tier: 'A2', min: 200, max: 299 },
  { tier: 'A3', min: 300, max: null },
];

export const specialTileDefinitions: SpecialTileDefinition[] = [
  {
    type: 'start',
    name: '起点格',
    description: '所有玩家从此出发，开局拥有 100 凌云积分。',
    defaultPoints: 100,
    icon: 'Flag',
  },
  {
    type: 'event',
    name: '事件格',
    description: '抽取 PA 任务或随机事件；若玩家有未清除 T 记录，可额外解锁消 T 活动。',
    defaultPoints: 15,
    icon: 'Sparkles',
  },
  {
    type: 'penalty',
    name: '惩罚格',
    description: '直接触发惩罚，可能获得 T 记录或被扣除凌云积分。',
    defaultPoints: -10,
    icon: 'AlertTriangle',
  },
  {
    type: 'study',
    name: '自习室格',
    description: 'A1 等级或持有未清除 T 记录的玩家需要停留 1 回合自习。',
    defaultPoints: 0,
    icon: 'BookOpen',
  },
  {
    type: 'publicService',
    name: '公益格',
    description: '触发公益与志愿服务奖励，获得额外凌云积分。',
    defaultPoints: 20,
    icon: 'HeartHandshake',
  },
  {
    type: 'cafeteria',
    name: '食堂格',
    description: '对应大富翁中的监狱，严重违规时进入并限制行动。',
    defaultPoints: 0,
    icon: 'Utensils',
  },
];

export const tileCountsByType = {
  start: 1,
  event: 2,
  penalty: 1,
  study: 1,
  publicService: 1,
  cafeteria: 1,
} as const;

export const propertyPurchaseRules = {
  standardPath: '先集齐同色全部 FC，再解锁购买 AC。',
  shortcutPath: '可直接购买 AC，但会自动同时获得对应同名 FC。',
} as const;

export const tierPenalties: TierPenalty[] = [
  { tier: 'T1', points: -5, clearRequirement: 1 },
  { tier: 'T2', points: -10, clearRequirement: 2 },
  { tier: 'T3', points: -15, clearRequirement: 3 },
];

export const serviceClearWeeks = {
  T1: 1,
  T2: 2,
  T3: 3,
} as const;

export const serviceOptions = [
  '公共区域保洁',
  '校园环保服务',
  '时间管理助手',
] as const;

export const paTaskCategories: PaTaskCategory[] = [
  {
    id: 'academic-performance',
    name: '学术课堂表现',
    description: '通过课堂参与、作业质量与学术投入获得 PA 积分。',
  },
  {
    id: 'class-contribution',
    name: '班级贡献',
    description: '通过班级事务协助、组织与支持行为获得奖励。',
  },
  {
    id: 'dorm-contribution',
    name: '宿舍贡献',
    description: '通过宿舍自治、互助与公共秩序维护完成 PA 任务。',
  },
  {
    id: 'campus-service',
    name: '校园志愿服务',
    description: '参与志愿服务、公益活动与校园支持项目获得加分。',
  },
  {
    id: 'honor-and-activity',
    name: '校内外活动荣誉',
    description: '通过竞赛、展示与活动荣誉获取额外凌云积分。',
  },
];

export const ruleSummarySections = [
  {
    title: '基本规则',
    bullets: [
      '每位玩家起步 100 凌云积分。',
      '玩家通过掷骰子在方形棋盘上移动。',
      '游戏结束时，凌云积分最高者获胜。',
    ],
  },
  {
    title: '棋盘构成',
    bullets: [
      '棋盘采用经典方形大富翁布局，包含 1 个起点格、2 个事件格、1 个惩罚格、1 个自习室格、1 个公益格、1 个食堂格。',
      '沿棋盘外圈分布七种颜色的素养地产格，每种颜色包含 FC 与 AC。',
      '中央区域用于展示七维素养雷达图。',
    ],
  },
  {
    title: '积分与等级',
    bullets: [
      'A1：100-199 分；A2：200-299 分；A3：300 分及以上。',
      'A1 等级或身上有 T 记录时，走到自习室格需要停留 1 回合。',
      '最终胜负只看凌云积分总分，不看等级。',
    ],
  },
  {
    title: '事件与惩罚',
    bullets: [
      '事件格抽取 PA 任务卡，可获得学术课堂表现、班级贡献、宿舍贡献、校园志愿服务、校内外活动荣誉等加分机会。',
      'T1 / T2 / T3 对应扣 5 / 10 / 15 分。',
      '严重违规可能进入食堂格并限制行动。',
    ],
  },
  {
    title: '消 T 机制',
    bullets: [
      '事件格消 T：T1 需完成 1 次消 T 活动，T2 需完成 2 次消 T 活动。',
      '服务撤销：T1 / T2 / T3 分别对应 1 / 2 / 3 周服务。',
      '服务内容包含公共区域保洁、校园环保、时间管理助手等。',
    ],
  },
] as const;
