import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

const ZoomFitToScreenItem = ({ label='Zoom to Fit Screen', onClick, ...rest }) => {
  return (
    <ContextMenuItem
      startIcon={<CropFreeRoundedIcon />}
      onClick={onClick}
      endIcon={(
        <>
          <ArrowUpwardRoundedIcon />
          <StyledText as="span" display="inline" lh={20}>1</StyledText>
        </>
      )}
      {...rest}
    >
      <StyledText lh={20}>{label}</StyledText>
    </ContextMenuItem>
  );
};

export default ZoomFitToScreenItem;
