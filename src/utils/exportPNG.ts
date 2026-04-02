import html2canvas from 'html2canvas';

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

export async function exportPNG(element: HTMLElement, filename = 'lingyun-board.png') {
  await document.fonts.ready;

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: Math.max(window.devicePixelRatio || 1, 2.5),
    useCORS: true,
  });

  downloadDataUrl(canvas.toDataURL('image/png'), filename);
}
