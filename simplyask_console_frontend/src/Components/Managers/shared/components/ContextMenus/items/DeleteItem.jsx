import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import DeleteIcon from '../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';

const DeleteItem = ({ label = 'Delete Step', onClick, ...rest }) => {
  return (
    <ContextMenuItem startIcon={<DeleteIcon />} onClick={onClick} {...rest}>
      <StyledText size={16} lh={16}>
        {label}
      </StyledText>
    </ContextMenuItem>
  );
};

export default DeleteItem;
