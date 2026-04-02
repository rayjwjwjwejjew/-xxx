import { Trash2 } from 'lucide-react';

import { competencies } from '@/data/competencies';
import { theme } from '@/styles/theme';
import type { BoardTile, CompetencyColor, PropertyLevel } from '@/types';

interface PropertyPanelProps {
  selectedTile: BoardTile | null;
  selectedTileIndex: number | null;
  onRemoveTile: (index: number) => void;
  onUpdateTile: (index: number, patch: Partial<Omit<BoardTile, 'id' | 'index'>>) => void;
}

const propertyLevels: PropertyLevel[] = ['FC', 'AC'];

export function PropertyPanel({ selectedTile, selectedTileIndex, onRemoveTile, onUpdateTile }: PropertyPanelProps) {
  return (
    <aside className="clean-panel flex h-full w-full flex-col overflow-hidden xl:w-[320px] xl:min-w-[320px]">
      <div className="px-5 py-4">
        <div className="panel-kicker">格子属性</div>
        <h2 className="panel-heading">编辑当前选中的棋盘节点</h2>
      </div>

      <div className="soft-divider mx-5" />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {!selectedTile || selectedTileIndex === null ? (
          <div className="rounded-[18px] border border-dashed border-slate-200 bg-white/60 p-5 text-sm leading-6 text-slate-500">
            请点击棋盘上的任意格子。这里会显示它的名称、描述、积分、素养颜色与 FC/AC 设置。
          </div>
        ) : (
          <div className="space-y-4">
            <ReadOnlyField label="格子索引" value={`第 ${selectedTileIndex + 1} 格`} />
            <ReadOnlyField label="格子类型" value={selectedTile.type} />

            <EditableField
              label="名称"
              value={selectedTile.name}
              onChange={(value) => onUpdateTile(selectedTileIndex, { name: value })}
            />
            <EditableTextArea
              label="描述"
              value={selectedTile.description}
              onChange={(value) => onUpdateTile(selectedTileIndex, { description: value })}
            />
            <EditableField
              label="凌云积分"
              type="number"
              value={String(selectedTile.points)}
              onChange={(value) => onUpdateTile(selectedTileIndex, { points: Number(value) || 0 })}
            />

            {selectedTile.type === 'property' ? (
              <>
                <div>
                  <label className="property-label">素养颜色</label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {competencies.map((competency) => (
                      <button
                        key={competency.color}
                        type="button"
                        onClick={() => onUpdateTile(selectedTileIndex, { competencyColor: competency.color as CompetencyColor })}
                        className={[
                          'flex flex-col items-center gap-2 rounded-[14px] border px-2 py-3 text-[11px] transition',
                          selectedTile.competencyColor === competency.color
                            ? 'border-sky-300 bg-sky-50/80 shadow-[0_10px_18px_rgba(91,141,239,0.12)]'
                            : 'border-white/70 bg-white/70 hover:bg-white',
                        ].join(' ')}
                      >
                        <span
                          className="h-5 w-5 rounded-full"
                          style={{ backgroundColor: theme.colors.competency[competency.color] }}
                        />
                        <span className="text-center text-slate-500">{competency.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="property-label">素养等级</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 rounded-full bg-slate-100/80 p-1">
                    {propertyLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onUpdateTile(selectedTileIndex, { propertyLevel: level })}
                        className={[
                          'rounded-full px-4 py-2 text-sm font-semibold transition',
                          selectedTile.propertyLevel === level
                            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_10px_18px_rgba(91,141,239,0.18)]'
                            : 'text-slate-500 hover:bg-white/80 hover:text-slate-700',
                        ].join(' ')}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => onRemoveTile(selectedTileIndex)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              <Trash2 size={16} />
              删除当前格子
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
      <label className="property-label">{label}</label>
      <div className="rounded-[14px] border border-white/70 bg-white/72 px-3 py-2.5 text-sm text-slate-700">{value}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  value: string;
  type?: 'text' | 'number';
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="property-label">{label}</label>
      <input type={type} className="property-input" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function EditableTextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="property-label">{label}</label>
      <textarea className="property-input min-h-[110px] resize-y" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
