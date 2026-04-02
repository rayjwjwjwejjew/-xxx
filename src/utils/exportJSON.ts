import type { BoardConfig } from '@/types';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export async function exportJSON(boardConfig: BoardConfig, filename = 'lingyun-board.json') {
  const blob = new Blob([JSON.stringify(boardConfig, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  downloadBlob(blob, filename);
}
