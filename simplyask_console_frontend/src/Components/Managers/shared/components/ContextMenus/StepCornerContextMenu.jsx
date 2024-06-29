import React from 'react';
import { StyledDefaultStepHeadIcon } from '../CustomSteps/StyledStep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ContextMenu, ContextMenuItem } from './StyledContextMenus';
import { StyledText } from '../../../../shared/styles/styled';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import DeleteIcon from '../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import DuplicateIcon from '../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';

const StepCornerContextMenu = ({ secondary, onDelete, onDuplicate }) => {
  const { open, id, anchorEl, handleClose, handleClick } = usePopoverToggle();

  const handleDelete = (e) => {
    onDelete();
    handleClose(e);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    onDuplicate();
    handleClose(e);
  };

  return (
    <>
      <StyledDefaultStepHeadIcon backgroundHover="lavenderHover" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </StyledDefaultStepHeadIcon>

      <ContextMenu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={({ colors, boxShadows }) => ({
          top: 5,
          '& .MuiPopover-paper': {
            marginTop: 0,
            boxShadow: boxShadows.box,
            borderRadius: '10px',
            background: colors.white,
          },
        })}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <ContextMenuItem startIcon={<DuplicateIcon />} onClick={handleDuplicate}>
          <StyledText size={16} lh={16}>
            Duplicate
          </StyledText>
        </ContextMenuItem>
        <ContextMenuItem startIcon={<DeleteIcon />} onClick={handleDelete}>
          <StyledText size={16} lh={16}>
            Delete
          </StyledText>
        </ContextMenuItem>
      </ContextMenu>
    </>
  );
};

export default StepCornerContextMenu;
