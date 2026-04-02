import {
  AlertTriangle,
  BookOpen,
  Circle,
  Flag,
  HeartHandshake,
  Sparkles,
  Star,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { DragEvent } from 'react';

import { competencies } from '@/data/competencies';
import { specialTileDefinitions } from '@/data/rules';
import { theme } from '@/styles/theme';
import type { TileTemplate } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  BookOpen,
  Circle,
  Flag,
  HeartHandshake,
  Sparkles,
  Star,
  Utensils,
};

interface SidebarProps {
  draggingTemplateId: string | null;
  onDragStartTemplate: (template: TileTemplate) => void;
  onDragEndTemplate: () => void;
}

const specialTemplates: TileTemplate[] = specialTileDefinitions.map((tile) => ({
  templateId: tile.type,
  type: tile.type,
  name: tile.name,
  description: tile.description,
  points: tile.defaultPoints,
  icon: tile.icon,
}));

const propertyTemplatesByCompetency = competencies.map((competency) => ({
  competency,
  items: [
    {
      templateId: `${competency.color}-FC`,
      type: 'property' as const,
      name: `${competency.name} FC`,
      description: `基础素养路径：${competency.description}`,
      points: 15,
      competencyColor: competency.color,
      propertyLevel: 'FC' as const,
      icon: 'Circle',
    },
    {
      templateId: `${competency.color}-AC`,
      type: 'property' as const,
      name: `${competency.name} AC`,
      description: `进阶素养路径：${competency.description}`,
      points: 30,
      competencyColor: competency.color,
      propertyLevel: 'AC' as const,
      icon: 'Star',
    },
  ],
}));

export function Sidebar({ draggingTemplateId, onDragStartTemplate, onDragEndTemplate }: SidebarProps) {
  return (
    <aside className="clean-panel flex h-full w-full flex-col overflow-hidden xl:w-[300px] xl:min-w-[300px]">
      <div className="px-5 py-4">
        <div className="panel-kicker">地图组件库</div>
        <h2 className="panel-heading">拖入棋盘的校园规则卡</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          把特殊格和七维素养卡放到外圈路径上，编辑一张适合课堂体验的校园桌游地图。
        </p>
      </div>

      <div className="soft-divider mx-5" />

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <section>
          <SectionTitle title="特殊格子" />
          <div className="space-y-3">
            {specialTemplates.map((template) => (
              <LibraryCard
                key={template.templateId}
                template={template}
                draggingTemplateId={draggingTemplateId}
                onDragStartTemplate={onDragStartTemplate}
                onDragEndTemplate={onDragEndTemplate}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="七维素养地产格" />
          <div className="space-y-4">
            {propertyTemplatesByCompetency.map(({ competency, items }) => (
              <div key={competency.color} className="rounded-[16px] border border-white/70 bg-white/55 p-3 shadow-[0_8px_22px_rgba(91,141,239,0.08)]">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: theme.colors.competency[competency.color],
                      boxShadow: `0 0 10px ${theme.colors.competency[competency.color]}55`,
                    }}
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{competency.name}</p>
                    <p className="text-[11px] leading-5 text-slate-500">{competency.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {items.map((template) => (
                    <LibraryCard
                      key={template.templateId}
                      template={template}
                      draggingTemplateId={draggingTemplateId}
                      onDragStartTemplate={onDragStartTemplate}
                      onDragEndTemplate={onDragEndTemplate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
      <h3 className="text-sm font-semibold tracking-[0.08em] text-slate-700">{title}</h3>
    </div>
  );
}

function LibraryCard({
  template,
  draggingTemplateId,
  onDragStartTemplate,
  onDragEndTemplate,
}: {
  template: TileTemplate;
  draggingTemplateId: string | null;
  onDragStartTemplate: (template: TileTemplate) => void;
  onDragEndTemplate: () => void;
}) {
  const Icon = iconMap[template.icon] ?? Circle;
  const color = template.competencyColor ? theme.colors.competency[template.competencyColor] : theme.colors.accentBlue;
  const isDragging = draggingTemplateId === template.templateId;

  return (
    <div
      draggable
      onDragStart={(event) => handleDragStart(event, template, onDragStartTemplate)}
      onDragEnd={onDragEndTemplate}
      className={[
        'relative overflow-hidden rounded-[14px] border border-white/70 bg-white/80 p-3 transition duration-200 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(91,141,239,0.12)]',
        isDragging ? 'scale-[1.02] opacity-70 shadow-[0_14px_32px_rgba(91,141,239,0.18)]' : 'shadow-[0_8px_18px_rgba(36,50,74,0.06)]',
      ].join(' ')}
    >
      <span className="absolute inset-y-3 left-0 w-1 rounded-r-full" style={{ backgroundColor: color }} />
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-slate-50 text-slate-700 shadow-inner" style={{ color }}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-slate-800">{template.name}</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
              {template.type === 'property' ? template.propertyLevel : '特殊'}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{template.description}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{template.type === 'property' ? '拖到棋盘外圈' : '拖到关键节点'}</span>
            <span className="font-mono font-semibold text-amber-500">{template.points > 0 ? `+${template.points}` : template.points}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function handleDragStart(
  event: DragEvent<HTMLDivElement>,
  template: TileTemplate,
  onDragStartTemplate: (template: TileTemplate) => void,
) {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/lingyun-tile-template', JSON.stringify(template));
  onDragStartTemplate(template);
}
