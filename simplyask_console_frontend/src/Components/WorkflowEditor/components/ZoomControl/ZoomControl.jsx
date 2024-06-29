import { KeyboardArrowDown } from '@mui/icons-material';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import FlowIconWithTooltip from '../../../Managers/shared/components/FlowIconWithTooltip/FlowIconWithTooltip';
import { StyledZoomControl } from '../../../Managers/shared/components/StyledFlowEditor';
import ZoomDropdownMenu from '../../../Managers/shared/components/ZoomControl/ZoomDropdownMenu';
import { StyledFlex } from '../../../shared/styles/styled';

const ZoomControl = ({
  zoom,
  isZoomInDisabled,
  isZoomOutDisabled,
  onZoomOut,
  onZoomIn,
  onZoomFit,
  onZoomOption,
  onZoomToElement,
}) => {
  const { anchorEl, open, handleClick: handleOpen, handleClose } = usePopoverToggle('zoom-context-menu');

  return (
    <>
      <StyledFlex direction="row" alignItems="center" gap="0">
        <FlowIconWithTooltip icon="ZOOM_OUT" text="Zoom Out" isDisabled={isZoomOutDisabled} onClick={onZoomOut} />
        <FlowIconWithTooltip text="Zoom Options">
          <StyledZoomControl
            variant="text"
            color="primary"
            endIcon={<KeyboardArrowDown />}
            onClick={handleOpen}
            active={open}
          >
            {`${Math.round(zoom * 100)}%`}
          </StyledZoomControl>
        </FlowIconWithTooltip>
        <FlowIconWithTooltip icon="ZOOM_IN" text="Zoom In" isDisabled={isZoomInDisabled} onClick={onZoomIn} />
      </StyledFlex>

      <ZoomDropdownMenu
        isOpen={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        onZoomOption={onZoomOption}
        onZoomToElement={onZoomToElement}
        onFitView={onZoomFit}
      />
    </>
  );
};

export default ZoomControl;