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
    <aside className="panel-shell flex h-full w-full flex-col overflow-hidden xl:w-[300px] xl:min-w-[300px]">
      <div className="px-5 py-4">
        <h2 className="panel-title">组件召唤书</h2>
        <p className="mt-4 text-xs leading-6 text-text-secondary">
          拖拽下列规则卡牌到棋盘路径中，像编辑一部校园冒险视觉小说的地图分镜。
        </p>
      </div>

      <div className="decorative-divider mx-5" />

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-galgame-gold-orange shadow-[0_0_12px_rgba(240,160,48,0.45)]" />
            <h3 className="font-title text-sm tracking-[0.16em] text-galgame-gold-light">特殊格子</h3>
          </div>
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
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-galgame-gold-orange shadow-[0_0_12px_rgba(240,160,48,0.45)]" />
            <h3 className="font-title text-sm tracking-[0.16em] text-galgame-gold-light">七维素养地产格</h3>
          </div>

          <div className="space-y-4">
            {propertyTemplatesByCompetency.map(({ competency, items }) => (
              <div
                key={competency.color}
                className="rounded-card border border-galgame-border bg-[rgba(20,30,55,0.58)] p-3 shadow-[0_0_16px_rgba(0,0,0,0.12)]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: theme.colors.competency[competency.color],
                      boxShadow: `0 0 12px ${theme.colors.competency[competency.color]}66`,
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{competency.name}</p>
                    <p className="text-[11px] leading-5 text-text-secondary">{competency.description}</p>
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

interface LibraryCardProps {
  template: TileTemplate;
  draggingTemplateId: string | null;
  onDragStartTemplate: (template: TileTemplate) => void;
  onDragEndTemplate: () => void;
}

function LibraryCard({
  template,
  draggingTemplateId,
  onDragStartTemplate,
  onDragEndTemplate,
}: LibraryCardProps) {
  const Icon = iconMap[template.icon] ?? Circle;
  const color = template.competencyColor ? theme.colors.competency[template.competencyColor] : theme.colors.brandOrange;
  const isDragging = draggingTemplateId === template.templateId;

  return (
    <div
      draggable
      onDragStart={(event) => handleDragStart(event, template, onDragStartTemplate)}
      onDragEnd={onDragEndTemplate}
      className={[
        'relative cursor-grab overflow-hidden rounded-card border p-3 transition duration-300 ease-out',
        'bg-[rgba(20,30,55,0.8)] shadow-[0_0_12px_rgba(0,0,0,0.15)]',
        'hover:-translate-y-[3px] hover:border-galgame-border hover:shadow-[0_4px_16px_rgba(201,168,76,0.15)] active:cursor-grabbing',
        isDragging ? 'scale-[1.01] border-galgame-gold-light opacity-70 shadow-drag' : 'border-galgame-border',
      ].join(' ')}
    >
      <span
        className="absolute bottom-1 top-1 left-0 w-[3px] rounded-r-full"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
      />

      <div className="mb-2 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-galgame-border bg-[rgba(12,20,40,0.82)]"
          style={{ color, boxShadow: `0 0 16px ${color}33` }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-title text-sm text-text-primary">{template.name}</p>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
              style={{
                backgroundColor: `${color}22`,
                color,
                boxShadow: `0 0 10px ${color}22`,
              }}
            >
              {template.type === 'property' ? template.propertyLevel : '特殊格'}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-text-secondary">{template.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-secondary">
        <span>{template.type === 'property' ? '可拖拽素养格' : '可拖拽规则格'}</span>
        <span className="font-mono font-semibold text-galgame-gold-orange">
          {template.points > 0 ? `+${template.points}` : template.points} 分
        </span>
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
