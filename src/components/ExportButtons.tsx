import { Download, FileImage, FileJson, FileText, Puzzle, Upload } from 'lucide-react';

interface ExportButtonsProps {
  activeAction: string | null;
  isBusy: boolean;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  onExportPuzzlePDF: () => void;
  onImportJSON: () => void;
}

export function ExportButtons({
  activeAction,
  isBusy,
  onExportJSON,
  onExportPDF,
  onExportPNG,
  onExportPuzzlePDF,
  onImportJSON,
}: ExportButtonsProps) {
  return (
    <div className="clean-panel flex flex-wrap items-center justify-center gap-3 px-4 py-4">
      <ToolButton icon={FileImage} label="导出 PNG" onClick={onExportPNG} active={activeAction === 'png'} disabled={isBusy} primary />
      <ToolButton icon={FileText} label="导出 PDF" onClick={onExportPDF} active={activeAction === 'pdf'} disabled={isBusy} primary />
      <ToolButton icon={Puzzle} label="拼图版 PDF" onClick={onExportPuzzlePDF} active={activeAction === 'puzzle'} disabled={isBusy} />
      <ToolButton icon={FileJson} label="导出 JSON" onClick={onExportJSON} active={activeAction === 'save'} disabled={isBusy} />
      <ToolButton icon={Upload} label="导入 JSON" onClick={onImportJSON} active={activeAction === 'import'} disabled={isBusy} />
    </div>
  );
}

function ToolButton({
  active,
  disabled,
  icon: Icon,
  label,
  onClick,
  primary = false,
}: {
  active: boolean;
  disabled: boolean;
  icon: typeof Download;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200',
        primary
          ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_12px_24px_rgba(91,141,239,0.24)] hover:-translate-y-0.5'
          : 'border border-white/75 bg-white/80 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-white',
        active ? 'ring-2 ring-sky-200' : '',
        disabled ? 'cursor-not-allowed opacity-60' : '',
      ].join(' ')}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}
