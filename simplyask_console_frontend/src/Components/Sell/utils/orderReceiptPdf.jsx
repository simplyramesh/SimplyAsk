import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { getInFormattedUserTimezone } from '../../../utils/timeUtil';

export const generateMultipleElPdf = async (elementsData, timezone, title) => {
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const padding = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const usablePageWidth = pageWidth - 2 * padding;
  const usablePageHeight = pageHeight - 2 * padding;
  const getParsedFloatPercentage = (value) => parseFloat(value) / 100;

  const canvasPromises = elementsData.map(async ({
    id, width, height, x, y,
  }) => {
    const element = document.getElementById(id);

    const canvas = await html2canvas(element, { scale: pageWidth / pageHeight });

    const elementWidth = typeof width === 'string' && width.endsWith('%')
      ? getParsedFloatPercentage(width) * usablePageWidth
      : width || (element.height / (canvas.height / canvas.width));

    const elementHeight = typeof height === 'string' && height.endsWith('%')
      ? getParsedFloatPercentage(height) * usablePageHeight
      : height || (elementWidth / (canvas.width / canvas.height));

    const elementX = typeof x === 'string' && x.endsWith('%')
      ? getParsedFloatPercentage(x) * usablePageWidth
      : x || padding;

    const elementY = typeof y === 'string' && y.endsWith('%')
      ? getParsedFloatPercentage(y) * usablePageHeight
      : y || padding;

    return {
      canvas,
      width: elementWidth,
      height: elementHeight,
      x: elementX,
      y: elementY,
    };
  });

  const elements = await Promise.all(canvasPromises);

  elements.forEach(({
    canvas, width, height, x, y,
  }) => {
    const aspectRatio = canvas.width / canvas.height;
    const calculatedWidth = width ?? (height * aspectRatio);
    const calculatedHeight = height ?? (calculatedWidth / aspectRatio);
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', x || padding, y || padding, calculatedWidth, calculatedHeight);
  });

  pdf.save(`${getInFormattedUserTimezone(new Date(), timezone, 'MM-dd-yyyy')}_${title}.pdf`);
};
