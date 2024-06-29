import React from 'react';
import { ContentPasteRounded } from '@mui/icons-material';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';

const PasteItem = ({ label = 'Paste', disabled, onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<ContentPasteRounded />}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <StyledText lh={15}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default PasteItem;
