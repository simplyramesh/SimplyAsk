import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import ZoomOutIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ZoomOutIcon';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

const ZoomOutItem = ({ label='Zoom Out', onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<ZoomOutIcon />}
      endIcon={<RemoveRoundedIcon />}
      onClick={onClick}
      {...rest}
    >
      <StyledText lh={20}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default ZoomOutItem;
