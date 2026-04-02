import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPDF(element: HTMLElement, filename = 'lingyun-board.pdf') {
  await document.fonts.ready;

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: Math.max(window.devicePixelRatio || 1, 2.5),
    useCORS: true,
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a3',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const headerHeight = 12;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2 - headerHeight;

  const imageWidth = canvas.width;
  const imageHeight = canvas.height;
  const imageRatio = imageWidth / imageHeight;
  const maxRatio = maxWidth / maxHeight;

  const renderWidth = imageRatio > maxRatio ? maxWidth : maxHeight * imageRatio;
  const renderHeight = imageRatio > maxRatio ? maxWidth / imageRatio : maxHeight;
  const offsetX = (pageWidth - renderWidth) / 2;
  const offsetY = margin + headerHeight + (maxHeight - renderHeight) / 2;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Yungu Lingyun Monopoly Board', margin, margin + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('导出尺寸：A3 横向 | 适合打印展示', margin, margin + 11);

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
  pdf.save(filename);
}
