import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import CopyIcon from '../../../../../../Assets/icons/copy.svg?component';

const CopyItem = ({ label = 'Copy', onClick, ...rest }) => {
  return (
    <ContextMenuItem startIcon={<CopyIcon />} onClick={onClick} {...rest}>
      <StyledText lh={15}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default CopyItem;
