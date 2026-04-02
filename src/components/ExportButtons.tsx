import { Download, FileImage, FileJson2, FileStack, FileText, FolderUp } from 'lucide-react';

interface ExportButtonsProps {
  activeAction: string | null;
  isBusy: boolean;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onExportPuzzlePDF: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
}

interface ActionButton {
  key: string;
  label: string;
  icon: typeof Download;
  onClick: () => void;
  primary?: boolean;
}

export function ExportButtons({
  activeAction,
  isBusy,
  onExportPNG,
  onExportPDF,
  onExportPuzzlePDF,
  onExportJSON,
  onImportJSON,
}: ExportButtonsProps) {
  const actions: ActionButton[] = [
    { key: 'png', label: '导出 PNG', icon: FileImage, onClick: onExportPNG, primary: true },
    { key: 'pdf', label: '导出 PDF', icon: FileText, onClick: onExportPDF },
    { key: 'puzzle', label: '拼图版 PDF', icon: FileStack, onClick: onExportPuzzlePDF },
    { key: 'json', label: '导出 JSON', icon: FileJson2, onClick: onExportJSON },
    { key: 'import', label: '导入 JSON', icon: FolderUp, onClick: onImportJSON },
  ];

  return (
    <div className="panel-shell flex min-h-14 flex-wrap items-center justify-center gap-3 px-4 py-3">
      {actions.map(({ key, label, icon: Icon, onClick, primary }) => {
        const isActive = activeAction === key;
        return (
          <button
            key={key}
            type="button"
            onClick={onClick}
            disabled={isBusy}
            className={[
              primary ? 'toolbar-button toolbar-button-primary' : 'toolbar-button',
              isBusy ? 'opacity-60' : '',
            ].join(' ')}
          >
            <Icon size={16} />
            <span>{isActive ? '处理中…' : label}</span>
          </button>
        );
      })}
    </div>
  );
}
