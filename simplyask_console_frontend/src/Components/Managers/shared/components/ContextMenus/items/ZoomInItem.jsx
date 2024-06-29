import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import ZoomInIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ZoomInIcon';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const ZoomInItem = ({ label='Zoom In', onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<ZoomInIcon />}
      endIcon={<AddRoundedIcon />}
      onClick={onClick}
      {...rest}
    >
      <StyledText lh={20}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default ZoomInItem;
