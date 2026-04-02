import { BookOpen, FolderUp, Plus, Save } from 'lucide-react';

interface NavbarProps {
  activeAction: string | null;
  isBusy: boolean;
  onImportJSON: () => void;
  onNewMap: () => void;
  onOpenRules: () => void;
  onSaveJSON: () => void;
}

interface NavbarAction {
  label: string;
  icon: typeof Plus;
  actionKey: 'new' | 'import' | 'rules' | 'save';
  primary?: boolean;
  onClick: () => void;
}

export function Navbar({
  activeAction,
  isBusy,
  onImportJSON,
  onNewMap,
  onOpenRules,
  onSaveJSON,
}: NavbarProps) {
  const actions: NavbarAction[] = [
    { label: '新建地图', icon: Plus, actionKey: 'new', onClick: onNewMap },
    { label: '导入 JSON', icon: FolderUp, actionKey: 'import', onClick: onImportJSON },
    { label: '规则说明', icon: BookOpen, actionKey: 'rules', onClick: onOpenRules },
    { label: '保存', icon: Save, actionKey: 'save', onClick: onSaveJSON, primary: true },
  ];

  return (
    <header className="relative z-10 border-b border-galgame-border bg-[rgba(10,16,32,0.85)] px-5 py-4 backdrop-blur-[20px]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.55),transparent)]" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-galgame-border bg-[rgba(201,168,76,0.08)] font-title text-lg text-galgame-gold-light shadow-[0_0_18px_rgba(201,168,76,0.15)]">
            凌
          </div>
          <div>
            <h1 className="font-title text-[22px] font-bold tracking-[0.24em] text-galgame-gold-light [text-shadow:0_0_15px_rgba(232,212,139,0.4)]">
              云谷高中·凌云大富翁
            </h1>
            <p className="mt-1 text-xs tracking-[0.14em] text-text-secondary">
              Yungu Lingyun Monopoly Map Maker · Galgame Edition
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actions.map(({ label, icon: Icon, primary, onClick, actionKey }) => {
            const isActive = activeAction === actionKey;
            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={isBusy && actionKey !== 'rules'}
                className={[
                  'navbar-btn',
                  primary ? 'border-galgame-gold-light text-galgame-gold-light' : '',
                  isActive ? 'shadow-[0_0_18px_rgba(201,168,76,0.18)]' : '',
                ].join(' ')}
              >
                <Icon size={16} />
                <span>{isActive ? '处理中…' : label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
