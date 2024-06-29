import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import { ContextMenu, ContextMenuItem } from '../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import RedoItem from '../../../Managers/shared/components/ContextMenus/items/RedoItem';
import UndoItem from '../../../Managers/shared/components/ContextMenus/items/UndoItem';
import ZoomFitToScreenItem from '../../../Managers/shared/components/ContextMenus/items/ZoomFitToScreenItem';
import ZoomInItem from '../../../Managers/shared/components/ContextMenus/items/ZoomInItem';
import ZoomOutItem from '../../../Managers/shared/components/ContextMenus/items/ZoomOutItem';
import { StyledDivider, StyledText } from '../../../shared/styles/styled';

const SettingsContextMenu = ({
    undo,
    redo,
    canRedo,
    canUndo,
    onZoomIn,
    onZoomOut,
    onZoomFit,
    onProcessDetails,
    onExpandAllSteps,
    onMinimizeAllSteps
}) => {
    const { colors } = useTheme();

    const {
        id,
        open,
        anchorEl,
        handleClick: handleOpen,
        handleClose,
    } = usePopoverToggle({
        initialId: 'view-submenu',
    });

    return (
        <>
            <ContextMenuItem onClick={onProcessDetails}>Process Details</ContextMenuItem>
            <StyledDivider borderWidth={1} color={colors.disabledBtnBg} m="0 15px 0 15px" />
            <ContextMenuItem
              endIcon={<ArrowForwardIosRounded />}
              onMouseEnter={handleOpen}
              onMouseLeave={handleClose}
              anchorEl={anchorEl}
              submenu={
                    <ContextMenu
                      key={id}
                      open={open}
                      onClose={handleClose}
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
                            onMouseLeave: handleClose,
                        }}
                      disablePortal
                      maxWidth="274px"
                      marginTop="4px"
                    >
                        <ZoomInItem onClick={onZoomIn} />
                        <ZoomOutItem onClick={onZoomOut} />
                      <ZoomFitToScreenItem onClick={onZoomFit} />
                      <StyledDivider borderWidth={1} color={colors.disabledBtnBg} m="0 15px 0 15px" />
                      <ContextMenuItem
                        onClick={() => {
                              onExpandAllSteps();
                              handleClose();
                          }}
                      >
                          Expand all steps in diagram
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                              onMinimizeAllSteps();
                              handleClose();
                          }}
                      >
                          Minimize all steps in diagram
                      </ContextMenuItem>
                    </ContextMenu>
                }
            >
                <StyledText lh={15}>View</StyledText>
            </ContextMenuItem>
            <StyledDivider borderWidth={1} color={colors.disabledBtnBg} m="0 15px 0 15px" />
            <UndoItem onClick={undo} disabled={!canUndo} endIcon={<StyledText lh={15}>Ctrl + Z</StyledText>} />
            <RedoItem onClick={redo} disabled={!canRedo} endIcon={<StyledText lh={15}>Ctrl + Y</StyledText>} />
        </>
    );
};

export default SettingsContextMenu;