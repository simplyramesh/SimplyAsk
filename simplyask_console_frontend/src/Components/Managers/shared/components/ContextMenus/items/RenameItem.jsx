import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import EditIcon from '../../../../../../Assets/icons/agent/contextMenu/edit.svg?component';

const RenameItem = ({ label = 'Rename', onClick, ...rest }) => {
  return (
    <ContextMenuItem startIcon={<EditIcon />} onClick={onClick} {...rest}>
      <StyledText size={16} lh={16}>
        {label}
      </StyledText>
    </ContextMenuItem>
  );
};

export default RenameItem;
