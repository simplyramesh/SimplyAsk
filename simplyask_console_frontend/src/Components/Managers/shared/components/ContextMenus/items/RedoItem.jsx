import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import RedoIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/RedoIcon';

const RedoItem = ({ label = 'Redo', onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<RedoIcon />}
      onClick={onClick}
      {...rest}
    >
      <StyledText lh={15}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default RedoItem;
