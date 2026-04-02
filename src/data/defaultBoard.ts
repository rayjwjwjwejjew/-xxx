import type { BoardConfig, BoardTile, CompetencyColor, PropertyLevel } from '@/types';

const createPropertyTile = (
  index: number,
  competencyColor: CompetencyColor,
  propertyLevel: PropertyLevel,
  sequence: number,
  name: string,
  description: string,
  points: number,
): BoardTile => ({
  id: `tile-${index}`,
  index,
  type: 'property',
  name,
  description,
  points,
  competencyColor,
  propertyLevel,
  icon: propertyLevel === 'FC' ? 'Circle' : 'Star',
});

const createSpecialTile = (
  index: number,
  type: Exclude<BoardTile['type'], 'property'>,
  name: string,
  description: string,
  points: number,
  icon: string,
): BoardTile => ({
  id: `tile-${index}`,
  index,
  type,
  name,
  description,
  points,
  icon,
});

export const defaultBoardConfig: BoardConfig = {
  size: 28,
  tiles: [
    createSpecialTile(0, 'start', '起点格', '所有玩家从此出发，起步即拥有 100 凌云积分。', 100, 'Flag'),
    createPropertyTile(1, 'orange', 'FC', 1, '目标启航 FC', '建立清晰目标与阶段性成长计划。', 15),
    createPropertyTile(2, 'orange', 'FC', 2, '自我管理 FC', '通过时间规划与自我反思获得基础素养。', 15),
    createPropertyTile(3, 'orange', 'AC', 1, '自性表达 AC', '在真实任务中展现自驱力与持续行动。', 30),
    createPropertyTile(4, 'yellow', 'FC', 1, '团队互助 FC', '在小组任务中承担责任并积极协作。', 15),
    createPropertyTile(5, 'yellow', 'FC', 2, '共创执行 FC', '与同伴协同推进任务与成果交付。', 15),
    createPropertyTile(6, 'yellow', 'AC', 1, '协同领导 AC', '在团队中进行资源协调与共识建立。', 30),
    createSpecialTile(7, 'event', '事件格', '抽取 PA 任务或随机结果；有 T 记录时可解锁消 T 活动。', 15, 'Sparkles'),
    createPropertyTile(8, 'green', 'FC', 1, '表达训练 FC', '通过课堂表达与日常沟通获得加分。', 15),
    createPropertyTile(9, 'green', 'FC', 2, '倾听反馈 FC', '练习倾听、反馈与双向沟通能力。', 15),
    createPropertyTile(10, 'green', 'AC', 1, '沟通影响 AC', '在展示、主持与协调中形成影响力。', 30),
    createPropertyTile(11, 'blue', 'FC', 1, '全球视野 FC', '认识多元文化与全球议题。', 15),
    createPropertyTile(12, 'blue', 'FC', 2, '跨文化理解 FC', '在真实议题中理解差异与共通点。', 15),
    createPropertyTile(13, 'blue', 'AC', 1, '全球行动 AC', '结合本地与全球情境开展行动。', 30),
    createSpecialTile(14, 'cafeteria', '食堂格', '严重违规时进入，需暂停行动并等待恢复。', 0, 'Utensils'),
    createPropertyTile(15, 'indigo', 'FC', 1, '证据分析 FC', '以事实与证据支持自己的判断。', 15),
    createPropertyTile(16, 'indigo', 'FC', 2, '系统连接 FC', '看见问题之间的结构与关联。', 15),
    createPropertyTile(17, 'indigo', 'AC', 1, '策略思辨 AC', '能从多视角拆解复杂问题并提出策略。', 30),
    createSpecialTile(18, 'penalty', '惩罚格', '触发 T 记录或扣分事件，提醒及时修复。', -10, 'AlertTriangle'),
    createPropertyTile(19, 'purple', 'FC', 1, '灵感探索 FC', '从观察与尝试中产生创意。', 15),
    createPropertyTile(20, 'purple', 'FC', 2, '创意迭代 FC', '通过反馈不断优化想法与作品。', 15),
    createSpecialTile(21, 'study', '自习室格', 'A1 等级或身上有未清除 T 记录时停留 1 回合。', 0, 'BookOpen'),
    createPropertyTile(22, 'purple', 'AC', 1, '创新实践 AC', '将创意落地为可执行成果。', 30),
    createPropertyTile(23, 'gray', 'FC', 1, '机会识别 FC', '主动发现校园情境中的改进与服务机会。', 15),
    createPropertyTile(24, 'gray', 'FC', 2, '资源整合 FC', '整合时间、人力与工具推动方案实现。', 15),
    createPropertyTile(25, 'gray', 'AC', 1, '创业行动 AC', '从想法到执行形成价值创造闭环。', 30),
    createSpecialTile(26, 'publicService', '公益格', '完成志愿服务、公益活动可获得额外积分。', 20, 'HeartHandshake'),
    createSpecialTile(27, 'event', '事件格', '抽取 PA 任务卡或消 T 活动，推动正向修复。', 15, 'Sparkles'),
  ],
};

export const defaultBoardTiles = defaultBoardConfig.tiles;
