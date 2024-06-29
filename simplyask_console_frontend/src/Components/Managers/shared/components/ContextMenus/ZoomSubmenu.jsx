import React, { memo } from 'react';
import { useReactFlow } from 'reactflow';
import { ZOOM_CONFIG_SETTINGS } from '../../../AgentManager/AgentEditor/constants/head';
import { ContextMenu } from './StyledContextMenus';
import ZoomInItem from './items/ZoomInItem';
import ZoomOutItem from './items/ZoomOutItem';
import ZoomFitToScreenItem from './items/ZoomFitToScreenItem';

const ZoomSubmenu = ({ isOpen, onClose, anchorEl }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <ContextMenu
      open={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      MenuListProps={{
        onMouseLeave: onClose,
      }}
      disablePortal
      maxWidth="274px"
      marginTop="4px"
    >
      <ZoomInItem onClick={zoomIn} />
      <ZoomOutItem onClick={zoomOut} />
      <ZoomFitToScreenItem onClick={() => fitView({
        minZoom: ZOOM_CONFIG_SETTINGS.MIN_ZOOM,
        maxZoom: ZOOM_CONFIG_SETTINGS.MAX_ZOOM,
      })} />
    </ContextMenu>
  );
};

export default memo(ZoomSubmenu);
