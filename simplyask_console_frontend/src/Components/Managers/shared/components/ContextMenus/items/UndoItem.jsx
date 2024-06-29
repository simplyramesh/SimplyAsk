import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import UndoIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/UndoIcon';

const UndoItem = ({ label = 'Undo', onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<UndoIcon />}
      onClick={onClick}
      {...rest}
    >
      <StyledText lh={15}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default UndoItem;
