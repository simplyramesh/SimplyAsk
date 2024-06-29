import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { TEST_RUN_COLUMN_KEYS } from '../../utils/helpers';

const TextFieldCell = ({ cell, table }) => {
  const [cellValue, setCellValue] = useState(cell.row.original?.[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT]);

  const [selectionStartEnd, setSelectionStartEnd] = useState({ position: [0, 0], enterPressed: false });

  const {
    options: { muiTableBodyCellEditTextFieldProps },
    refs: { editInputRefs },
    setEditingCell,
  } = table;

  const tableBodyCellEditProps = muiTableBodyCellEditTextFieldProps({
    cell,
    column: cell.column,
    row: cell.row,
    table,
  });

  const props = {
    multiline: true,
    autoFocus: true,
    fullWidth: true,
    margin: 'none',
    variant: 'standard',
    id: cell.row.id,
    name: cell.column.id,
    value: cellValue,
    sx: ({ colors }) => ({
      border: 'none',
      outline: 'none',

      '& .MuiInputBase-root': {
        '&::before': { display: 'none' },
        '&::after': { display: 'none' },

        '& .MuiInputBase-input': {
          backgroundColor: colors.background,
          fontFamily: 'Montserrat',
          fontSize: '16px',
          lineHeight: '22px',
          color: colors.primary,
        },
      },
    }),
  };

  const textFieldCellProps = {
    ...props,
    ...tableBodyCellEditProps,
  };

  const onSave = ({ isError }) => {
    if (isError) {
      setCellValue(cell.getValue());
      setEditingCell(null);
    }

    if (!isError) setEditingCell(null);
  };

  return (
    <TextField
      {...textFieldCellProps}
      onClick={(e) => {
        e.stopPropagation();

        textFieldCellProps?.onClick?.(e);
      }}
      onBlur={(e) => {
        textFieldCellProps?.onBlur?.(e, onSave);
      }}
      onChange={(e) => {
        textFieldCellProps?.onChange?.(e);

        if (selectionStartEnd.enterPressed) {
          setSelectionStartEnd({ position: [e.target.selectionStart, e.target.selectionEnd], enterPressed: false });
        }

        setCellValue(e.target.value);
      }}
      onKeyDown={(e) => {
        textFieldCellProps?.onKeyDown?.(e);

        if (e.key !== 'Enter' && e.key !== 'Shift') { setSelectionStartEnd({ position: [0, 0], enterPressed: false }); return; }

        if (e.key === 'Enter' && e.shiftKey) {
          const cursorPosition = e.target.selectionStart;

          const value = e.target.value;
          const beforeCursor = value.substring(0, cursorPosition);
          const afterCursor = value.substring(cursorPosition, value.length);

          setSelectionStartEnd({ position: [cursorPosition, cursorPosition], enterPressed: true });

          setCellValue(`${beforeCursor}${afterCursor}`); // split into two in case a different implementation is needed
          return;
        }

        if (e.key === 'Enter') editInputRefs.current[cell.column.id]?.blur();
      }}
      inputRef={(inputRef) => {
        if (inputRef) {
          editInputRefs.current[cell.column.id] = inputRef;

          if (selectionStartEnd.enterPressed) {
            editInputRefs.current[cell.column.id].selectionStart = selectionStartEnd.position[0];
            editInputRefs.current[cell.column.id].selectionEnd = selectionStartEnd.position[1];
          }

          if (textFieldCellProps?.inputRef) textFieldCellProps.inputRef.current = inputRef;
        }
      }}
    />
  );
};

export default TextFieldCell;

TextFieldCell.propTypes = {
  cell: PropTypes.object,
  table: PropTypes.shape({
    options: PropTypes.shape({
      muiTableBodyCellEditTextFieldProps: PropTypes.func,
    }),
    refs: PropTypes.shape({
      editInputRefs: PropTypes.object,
    }),
    setEditingCell: PropTypes.func,
  }),
};
