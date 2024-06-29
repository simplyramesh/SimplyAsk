import React, { memo } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StyledDefaultStepHeadIcon } from '../../../../shared/components/CustomSteps/StyledStep';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { ContextMenu, ContextMenuItem } from '../../../../shared/components/ContextMenus/StyledContextMenus';
import { StyledText } from '../../../../../shared/styles/styled';
import DeleteIcon from '../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import DuplicateIcon from '../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';

const SidebarContextMenu = ({ onDelete, onDuplicate }) => {
  const { open, id, anchorEl, handleClose, handleClick } = usePopoverToggle();

  const handleDelete = (e) => {
    e.stopPropagation();

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
      <StyledDefaultStepHeadIcon backgroundHover="accordionBgHover" onClick={handleClick}>
        <MoreVertIcon fontSize="medium" />
      </StyledDefaultStepHeadIcon>

      <ContextMenu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={({ colors, boxShadows }) => ({
          top: 0,
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
        <ContextMenuItem startIcon={<DeleteIcon />} onClick={handleDelete}>
          <StyledText size={16} lh={16}>
            Delete
          </StyledText>
        </ContextMenuItem>
        <ContextMenuItem startIcon={<DuplicateIcon />} onClick={handleDuplicate}>
          <StyledText size={16} lh={16}>
            Duplicate
          </StyledText>
        </ContextMenuItem>
      </ContextMenu>
    </>
  );
};

export default memo(SidebarContextMenu);
