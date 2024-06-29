import React from 'react';
import DuplicateIcon from '../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';

const DuplicateItem = ({ label = 'Duplicate', onClick, ...rest }) => {
  return (
    <ContextMenuItem startIcon={<DuplicateIcon />} onClick={onClick} {...rest}>
      <StyledText size={16} lh={16}>
        {label}
      </StyledText>
    </ContextMenuItem>
  );
};

export default DuplicateItem;
