import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';

import { competencies } from '@/data/competencies';
import { theme } from '@/styles/theme';
import type { BoardTile } from '@/types';

interface PropertyPanelProps {
  selectedTile: BoardTile | null;
  selectedTileIndex: number | null;
  onUpdateTile: (index: number, patch: Partial<Omit<BoardTile, 'id' | 'index'>>) => void;
  onRemoveTile: (index: number) => void;
}

const tileTypeLabels: Record<BoardTile['type'], string> = {
  start: '起点格',
  event: '事件格',
  penalty: '惩罚格',
  study: '自习室格',
  publicService: '公益格',
  cafeteria: '食堂格',
  property: '素养地产格',
};

export function PropertyPanel({
  selectedTile,
  selectedTileIndex,
  onUpdateTile,
  onRemoveTile,
}: PropertyPanelProps) {
  return (
    <aside className="panel-shell flex h-full w-full flex-col overflow-hidden xl:w-[320px] xl:min-w-[320px]">
      <div className="px-5 py-4">
        <h2 className="panel-title">属性面板</h2>
        <p className="mt-4 text-xs leading-6 text-text-secondary">
          编辑当前格子的剧情文案、积分数值与素养属性，让每一步都更像一张视觉小说里的命运分歧点。
        </p>
      </div>

      <div className="decorative-divider mx-5" />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {selectedTileIndex === null ? (
          <EmptyPanelMessage />
        ) : !selectedTile ? (
          <div className="rounded-2xl border border-dashed border-galgame-border bg-[rgba(240,160,48,0.05)] px-5 py-6 text-center">
            <p className="font-title text-sm text-galgame-gold-light">第 {selectedTileIndex + 1} 格尚未安放内容</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              把左侧组件拖到棋盘上，或导入已有 JSON 配置后，这里会显示详细属性。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-galgame-border bg-[rgba(255,255,255,0.03)] p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <ReadOnlyField label="格子索引" value={`#${selectedTile.index + 1}`} />
                <ReadOnlyField label="格子类型" value={tileTypeLabels[selectedTile.type]} />
              </div>
            </div>

            <EditableField label="名称">
              <input
                value={selectedTile.name}
                onChange={(event) => onUpdateTile(selectedTile.index, { name: event.target.value })}
                className="property-input"
                placeholder="输入格子名称"
              />
            </EditableField>

            <EditableField label="描述">
              <textarea
                value={selectedTile.description}
                onChange={(event) => onUpdateTile(selectedTile.index, { description: event.target.value })}
                className="property-input min-h-[108px] leading-6"
                placeholder="输入格子描述"
              />
            </EditableField>

            <EditableField label="凌云积分数值">
              <input
                type="number"
                value={selectedTile.points}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  onUpdateTile(selectedTile.index, { points: Number.isNaN(nextValue) ? 0 : nextValue });
                }}
                className="property-input font-mono"
              />
            </EditableField>

            {selectedTile.type === 'property' ? (
              <>
                <EditableField label="素养颜色">
                  <div className="grid grid-cols-2 gap-2">
                    {competencies.map((competency) => {
                      const isSelected = selectedTile.competencyColor === competency.color;
                      return (
                        <button
                          key={competency.color}
                          type="button"
                          onClick={() => onUpdateTile(selectedTile.index, { competencyColor: competency.color })}
                          className={[
                            'rounded-input border px-3 py-2 text-left text-[11px] font-medium transition',
                            'bg-[rgba(15,25,50,0.55)]',
                            isSelected ? 'border-galgame-gold-light shadow-[0_0_14px_rgba(232,212,139,0.12)]' : 'border-galgame-border hover:border-galgame-gold/60',
                          ].join(' ')}
                        >
                          <span className="mb-1 flex items-center gap-1.5">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: theme.colors.competency[competency.color],
                                boxShadow: `0 0 12px ${theme.colors.competency[competency.color]}66`,
                              }}
                            />
                            <span className="truncate text-text-primary">{competency.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </EditableField>

                <EditableField label="FC / AC 等级">
                  <div className="toggle-switch flex">
                    {(['FC', 'AC'] as const).map((level) => {
                      const isActive = selectedTile.propertyLevel === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            onUpdateTile(selectedTile.index, {
                              propertyLevel: level,
                              icon: level === 'FC' ? 'Circle' : 'Star',
                            })
                          }
                          className={[
                            'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition',
                            isActive ? 'toggle-switch-active text-galgame-gold-light' : 'text-text-secondary hover:text-text-primary',
                          ].join(' ')}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </EditableField>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => onRemoveTile(selectedTile.index)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-button border border-red-400/30 bg-[rgba(239,68,68,0.10)] px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:-translate-y-0.5 hover:bg-[rgba(239,68,68,0.16)] active:scale-[0.98]"
            >
              <Trash2 size={16} />
              删除该格内容
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="property-label">{label}</p>
      <p className="mt-2 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function EditableField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="property-label">{label}</span>
      {children}
    </label>
  );
}

function EmptyPanelMessage() {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div className="rounded-2xl border border-dashed border-galgame-border bg-[rgba(240,160,48,0.05)] px-5 py-6">
        <h3 className="font-title text-sm text-galgame-gold-light">请点击棋盘上的格子进行编辑</h3>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          选中后可查看格子索引、类型，并实时修改名称、描述、积分、颜色与 FC / AC 配置。
        </p>
      </div>
    </div>
  );
}
