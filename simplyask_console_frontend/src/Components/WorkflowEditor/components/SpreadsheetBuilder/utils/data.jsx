import { keyColumn, textColumn } from 'react-datasheet-grid';

const lettersString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lettersArr = lettersString.split('');
export const initialCols = lettersArr.map((l) => ({
  minWidth: 200,
  title: l,
  ...keyColumn(l, textColumn),
}));

export const initialRows = Array.from({ length: 40 }, () => ({}));

export const shortcuts = [
  { left: 'Move active cell around', right: 'Arrows', isHeading: false },
  { left: 'Go to next / previous cell', right: 'Tab or Shift+Tab', isHeading: false },
  { left: 'Select multiple cells', right: 'Shift+Arrows', isHeading: false },
  { left: 'Expand selection', right: 'Shift+Click', isHeading: false },
  { left: 'Select to first / last / top / bottom cell', right: 'Ctrl+Shift+Arrows', isHeading: false },
  { left: 'Blur', right: 'Esc', isHeading: false },
  { left: 'Enter or F2', right: 'Start / stop editing cell', isHeading: false },
  { left: 'Insert row below', right: 'Shift+Enter', isHeading: false },
  { left: 'Duplicate current row / selected rows', right: 'Ctrl+D', isHeading: false },
  { left: 'Clear cell / delete rows', right: 'Backspace or Del', isHeading: false },
  { left: 'Open context menu', right: 'Right click or Ctrl+Left click', isHeading: false },
];
