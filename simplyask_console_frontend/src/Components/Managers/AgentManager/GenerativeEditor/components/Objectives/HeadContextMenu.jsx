import React from 'react';
import { ContextMenu, ContextMenuItem } from '../../../../shared/components/ContextMenus/StyledContextMenus';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { StyledDefaultStepHeadIcon } from '../../../../shared/components/CustomSteps/StyledStep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import DeleteIcon from '../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import DuplicateIcon from '../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';

const HeadContextMenu = ({ canDelete, onDelete, onDuplicate }) => {
  const { open, id, anchorEl, handleClose, handleClick } = usePopoverToggle();

  const handleDelete = (e) => {
    if (!canDelete) return;

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
        <MoreVertIcon fontSize="small" />
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
        <ContextMenuItem disabledWithActions={!canDelete} startIcon={<DeleteIcon />} onClick={handleDelete}>
          <StyledText size={16} lh={16}>
            <StyledFlex gap="5px" direction="row" alignItems="center">
              Delete
              {!canDelete && (
                <StyledTooltip
                  arrow
                  placement="top"
                  title="The objective cannot be deleted, as there must always be one objective per Agent"
                  p="10px 15px"
                >
                  <InfoOutlined fontSize="inherit" />
                </StyledTooltip>
              )}
            </StyledFlex>
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

export default HeadContextMenu;
