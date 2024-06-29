import React from 'react';

import FullScreenModal from '../FullScreenModal/FullScreenModal';
import Spreadsheet from './components/Spreadsheet/Spreadsheet';

const SpreadsheetBuilder = ({
  open, onClose, param, onSave, step,
}) => {
  return (
    <FullScreenModal open={open} onClose={onClose}>
      <Spreadsheet onSave={onSave} param={param} onClose={onClose} step={step} />
    </FullScreenModal>
  );
};

export default SpreadsheetBuilder;
