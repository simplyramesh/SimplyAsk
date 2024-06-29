import React from 'react';

import EditIcon from '../../../../../../Assets/icons/cellEditIcon.svg?component';
import { StyledEditableCell, StyledEditableCellControl, StyledEditableCellIcon } from './StyledEditableCell';

const EditableCell = ({ children, table, cell, justify, textAlign, width, onClick }) => {
  return (
    <StyledEditableCell
      onClick={() => {
        onClick?.();
        table.setEditingCell(cell);
      }}
      width={width}
    >
      <StyledEditableCellControl justify={justify} textAlign={textAlign}>
        {children}
      </StyledEditableCellControl>
      <StyledEditableCellIcon className="edit-icon showOnRowHover">
        <EditIcon />
      </StyledEditableCellIcon>
    </StyledEditableCell>
  );
};

export default EditableCell;
