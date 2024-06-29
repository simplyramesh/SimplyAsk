import Popover from '@mui/material/Popover';
import React, { useState } from 'react';

import ExpandMore from '../../../../../Assets/icons/expandMore.svg?component';
import { SERVICE_TICKET_TASK_STATUS_MAP } from '../../../../Issues/components/ServiceTickets/utils/helpers';
import { StyledStatus, StyledText } from '../../../styles/styled';
import {
  StyledActionsPopover,
  StyledActionsPopoverButton,
  StyledActionsPopoverItem,
  StyledActionsPopoverMenu,
} from './StyledActionsPopover';

const ActionsPopover = ({ actions, buttonTitle, menuWidth = '126px', onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    handleClose();
    onActionClick(action);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <StyledActionsPopover>
      <StyledActionsPopoverButton onClick={handleClick}>
        <StyledText size={15} weight={500} lh={18}>
          {buttonTitle}
        </StyledText>
        <ExpandMore />
      </StyledActionsPopoverButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          top: 10,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyledActionsPopoverMenu menuWidth={menuWidth}>
          {actions?.map((action) => (
            <StyledActionsPopoverItem
              key={action.id}
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(action.id);
              }}
            >
              <StyledStatus
                key={action.id}
                height="34px"
                color={SERVICE_TICKET_TASK_STATUS_MAP[action.name]?.color}
                width="fit-content"
                minWidth="0px"
              >
                {SERVICE_TICKET_TASK_STATUS_MAP[action.name]?.status || action.name}
              </StyledStatus>
            </StyledActionsPopoverItem>
          ))}
        </StyledActionsPopoverMenu>
      </Popover>
    </StyledActionsPopover>
  );
};

export default ActionsPopover;
