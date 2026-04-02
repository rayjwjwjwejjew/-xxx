import type { CompetencyColor, CompetencyInfo } from '@/types';

export const competencies: CompetencyInfo[] = [
  {
    color: 'orange',
    name: '目标感与自性',
    description: '围绕个人成长目标、自我认知与持续反思建立稳定的成长路径。',
  },
  {
    color: 'yellow',
    name: '协作',
    description: '在团队任务中承担责任、协调分工，并以合作方式解决问题。',
  },
  {
    color: 'green',
    name: '沟通',
    description: '通过清晰表达、积极倾听与跨场景互动提升沟通影响力。',
  },
  {
    color: 'blue',
    name: '全球胜任力',
    description: '理解多元文化与全球议题，形成开放视野与行动意识。',
  },
  {
    color: 'indigo',
    name: '思辨力与系统思维',
    description: '从证据出发分析问题，并建立多要素联动的系统视角。',
  },
  {
    color: 'purple',
    name: '创造力',
    description: '在学习与实践中提出新想法，并通过迭代把创意落地。',
  },
  {
    color: 'gray',
    name: '企业家精神',
    description: '主动发现机会、整合资源并推动方案执行与价值创造。',
  },
];

export const competencyMap: Record<CompetencyColor, CompetencyInfo> = competencies.reduce(
  (accumulator, competency) => ({
    ...accumulator,
    [competency.color]: competency,
  }),
  {} as Record<CompetencyColor, CompetencyInfo>,
);
