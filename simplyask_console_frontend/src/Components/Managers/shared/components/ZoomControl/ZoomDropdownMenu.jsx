import { useTheme } from "@mui/material/styles";
import { memo } from 'react';
import { DIAGRAM_ID } from "../../../../WorkflowEditor/constants/layout";
import { StyledDivider, StyledText } from '../../../../shared/styles/styled';
import { ContextMenu, ContextMenuItem } from '../ContextMenus/StyledContextMenus';

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const ZoomDropdownMenu = ({ onClose, anchorEl, onZoomOption, onFitView, onZoomToElement }) => {
  const { colors } = useTheme();

  return (
    <ContextMenu
      key="zoom-dropdown"
      open={!!anchorEl}
      onClose={onClose}
      anchorEl={anchorEl}
      maxWidth="134px"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      marginTop="4px"
    >
      {ZOOM_LEVELS.map((zoomLevel) => (
        <ContextMenuItem
          key={zoomLevel}
          onClick={() => {
            onZoomOption(zoomLevel);
            onZoomToElement(DIAGRAM_ID, zoomLevel)
            onClose?.();
          }}
        >
          <StyledText lh={20} textAlign="center">{`${zoomLevel * 100}%`}</StyledText>
        </ContextMenuItem>
      ))}
      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />
      <ContextMenuItem
        onClick={() => {
          onFitView();
          onClose?.();
        }}
      >
        <StyledText lh={20} textAlign="center">
          Zoom to Fit
        </StyledText>
      </ContextMenuItem>
    </ContextMenu>
  );
};

export default memo(ZoomDropdownMenu);
