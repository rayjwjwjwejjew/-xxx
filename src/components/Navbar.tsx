import { BookOpen, FileDown, FolderUp, Gamepad2, PenSquare, Plus, RotateCcw, Save } from 'lucide-react';

import type { AppMode } from '@/types';

interface NavbarProps {
  mode: AppMode;
  activeAction: string | null;
  isBusy: boolean;
  onImportJSON: () => void;
  onNewMap: () => void;
  onOpenRules: () => void;
  onResetPlay: () => void;
  onSaveJSON: () => void;
  onSwitchMode: (mode: AppMode) => void;
}

export function Navbar({
  mode,
  activeAction,
  isBusy,
  onImportJSON,
  onNewMap,
  onOpenRules,
  onResetPlay,
  onSaveJSON,
  onSwitchMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/45 bg-white/58 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-500">Yungu High School</p>
          <h1 className="truncate font-title text-[22px] font-semibold tracking-[0.08em] text-slate-800 md:text-[26px]">
            云谷高中·凌云大富翁
          </h1>
          <p className="mt-1 text-xs text-slate-500">地图编辑 + 本地热座游玩模式</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="glass-panel flex items-center gap-1 rounded-full p-1 shadow-sm">
            <ModeButton active={mode === 'editor'} icon={PenSquare} label="编辑模式" onClick={() => onSwitchMode('editor')} />
            <ModeButton active={mode === 'play'} icon={Gamepad2} label="游玩模式" onClick={() => onSwitchMode('play')} />
          </div>

          <div className="hidden h-8 w-px bg-white/70 lg:block" />

          <div className="flex flex-wrap items-center justify-end gap-2">
            {mode === 'editor' ? (
              <>
                <ActionButton icon={Plus} label="新建地图" onClick={onNewMap} disabled={isBusy} active={activeAction === 'new'} />
                <ActionButton icon={FolderUp} label="导入 JSON" onClick={onImportJSON} disabled={isBusy} active={activeAction === 'import'} />
                <ActionButton icon={Save} label="保存 JSON" onClick={onSaveJSON} disabled={isBusy} active={activeAction === 'save'} />
              </>
            ) : (
              <>
                <ActionButton icon={RotateCcw} label="重新开局" onClick={onResetPlay} disabled={isBusy} active={false} />
                <ActionButton icon={FileDown} label="回到编辑" onClick={() => onSwitchMode('editor')} disabled={false} active={false} />
              </>
            )}
            <ActionButton icon={BookOpen} label="规则说明" onClick={onOpenRules} disabled={false} active={activeAction === 'rules'} />
          </div>
        </div>
      </div>
      <div className="mx-auto h-px max-w-[1600px] bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
    </header>
  );
}

function ModeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof PenSquare;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200',
        active
          ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_10px_24px_rgba(91,141,239,0.28)]'
          : 'text-slate-600 hover:bg-white/70 hover:text-slate-800',
      ].join(' ')}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function ActionButton({
  active,
  disabled,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: typeof Plus;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm transition duration-200',
        'hover:-translate-y-0.5 hover:bg-white hover:text-slate-800 hover:shadow-[0_10px_20px_rgba(91,141,239,0.14)]',
        active ? 'ring-2 ring-sky-200' : '',
        disabled ? 'cursor-not-allowed opacity-60' : '',
      ].join(' ')}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}
