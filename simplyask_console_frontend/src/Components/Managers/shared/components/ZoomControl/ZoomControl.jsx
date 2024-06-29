import React, { memo, useCallback } from 'react';
import FlowIconWithTooltip from '../FlowIconWithTooltip/FlowIconWithTooltip';
import { KeyboardArrowDown } from '@mui/icons-material';
import { ZOOM_CONFIG_SETTINGS } from '../../../AgentManager/AgentEditor/constants/head';
import { StyledFlex } from '../../../../shared/styles/styled';
import ZoomDropdownMenu from './ZoomDropdownMenu';
import { useReactFlow, useViewport } from 'reactflow';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import { StyledZoomControl } from '../StyledFlowEditor';

const ZoomControl = () => {
  const { setViewport, zoomIn, zoomOut, fitView } = useReactFlow();
  const { x, y, zoom } = useViewport();

  const {
    anchorEl: zoomAnchorEl,
    open: isZoomMenuOpen,
    handleClose: onCloseZoomMenu,
    handleClick: onOpenZoomMenu,
  } = usePopoverToggle('zoom-control');

  const handleFitView = useCallback(() => {
    fitView({
      minZoom: ZOOM_CONFIG_SETTINGS.MIN_ZOOM,
      maxZoom: ZOOM_CONFIG_SETTINGS.MAX_ZOOM,
    });
    onCloseZoomMenu();
  }, [fitView])

  const handleZoomOption = useCallback((zoomLevel) => {
    setViewport({ x, y, zoom: zoomLevel });
    onCloseZoomMenu();
  }, [x, y])

  return (
    <>
      <StyledFlex direction="row" alignItems="center" gap="0">
        <FlowIconWithTooltip
          icon="ZOOM_OUT"
          text="Zoom Out"
          isDisabled={zoom <= 0.25}
          onClick={zoomOut}
        />
        <FlowIconWithTooltip text="Zoom Options">
          <StyledZoomControl
            variant="text"
            color="primary"
            endIcon={<KeyboardArrowDown />}
            onClick={onOpenZoomMenu}
            active={isZoomMenuOpen}
          >
            {`${Math.round(zoom * 100)}%`}
          </StyledZoomControl>
        </FlowIconWithTooltip>
        <FlowIconWithTooltip
          icon="ZOOM_IN"
          text="Zoom In"
          isDisabled={zoom === ZOOM_CONFIG_SETTINGS.MAX_ZOOM}
          onClick={zoomIn}
        />
      </StyledFlex>

      <ZoomDropdownMenu
        isOpen={isZoomMenuOpen}
        onClose={onCloseZoomMenu}
        anchorEl={zoomAnchorEl}
        onZoomOption={handleZoomOption}
        onFitView={handleFitView}
      />
    </>
  );
};

export default memo(ZoomControl);
