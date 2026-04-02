import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const drawRegistrationMarks = (pdf: jsPDF, x: number, y: number, width: number, height: number) => {
  const mark = 6;
  pdf.setDrawColor(120, 120, 120);
  pdf.setLineWidth(0.25);

  const corners: Array<[number, number, number, number]> = [
    [x, y, x + mark, y],
    [x, y, x, y + mark],
    [x + width, y, x + width - mark, y],
    [x + width, y, x + width, y + mark],
    [x, y + height, x + mark, y + height],
    [x, y + height, x, y + height - mark],
    [x + width, y + height, x + width - mark, y + height],
    [x + width, y + height, x + width, y + height - mark],
  ];

  corners.forEach(([x1, y1, x2, y2]) => pdf.line(x1, y1, x2, y2));
};

const createSliceCanvas = (sourceCanvas: HTMLCanvasElement, sx: number, sy: number, sw: number, sh: number) => {
  const sliceCanvas = document.createElement('canvas');
  sliceCanvas.width = sw;
  sliceCanvas.height = sh;
  const context = sliceCanvas.getContext('2d');

  if (!context) {
    throw new Error('无法创建拼图切片画布。');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, sw, sh);
  context.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  return sliceCanvas;
};

export async function exportPuzzlePDF(element: HTMLElement, filename = 'lingyun-board-puzzle.pdf') {
  await document.fonts.ready;

  const sourceCanvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: Math.max(window.devicePixelRatio || 1, 3),
    useCORS: true,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const columns = 2;
  const rows = 2;
  const totalPages = columns * rows;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const headerHeight = 14;
  const footerHeight = 12;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2 - headerHeight - footerHeight;

  const sliceWidth = Math.floor(sourceCanvas.width / columns);
  const sliceHeight = Math.floor(sourceCanvas.height / rows);

  let pageIndex = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const sx = column * sliceWidth;
      const sy = row * sliceHeight;
      const sw = column === columns - 1 ? sourceCanvas.width - sx : sliceWidth;
      const sh = row === rows - 1 ? sourceCanvas.height - sy : sliceHeight;
      const sliceCanvas = createSliceCanvas(sourceCanvas, sx, sy, sw, sh);

      const sliceRatio = sw / sh;
      const printableRatio = printableWidth / printableHeight;
      const renderWidth = sliceRatio > printableRatio ? printableWidth : printableHeight * sliceRatio;
      const renderHeight = sliceRatio > printableRatio ? printableWidth / sliceRatio : printableHeight;
      const x = (pageWidth - renderWidth) / 2;
      const y = margin + headerHeight + (printableHeight - renderHeight) / 2;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('云谷高中·凌云大富翁地图拼图版', margin, margin + 6);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`第 ${pageIndex + 1} / ${totalPages} 页 | 行 ${row + 1} / ${rows} · 列 ${column + 1} / ${columns}`, margin, margin + 11);

      pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');

      pdf.setLineDashPattern([2, 2], 0);
      pdf.setDrawColor(170, 170, 170);
      pdf.rect(x, y, renderWidth, renderHeight);
      pdf.setLineDashPattern([], 0);
      drawRegistrationMarks(pdf, x, y, renderWidth, renderHeight);

      pdf.setFontSize(8.5);
      pdf.setTextColor(92, 111, 130);
      pdf.text('裁切时沿虚线边界处理，并依据四角对齐标记拼合。', margin, pageHeight - margin);

      pageIndex += 1;
    }
  }

  pdf.save(filename);
}
