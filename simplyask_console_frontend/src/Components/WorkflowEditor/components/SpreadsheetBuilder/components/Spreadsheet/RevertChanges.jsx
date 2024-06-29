import { ExpandMore } from '@mui/icons-material';
import { Popover } from '@mui/material';
import { formatInTimeZone } from 'date-fns-tz';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { useUser } from '../../../../../../contexts/UserContext';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledText } from '../../../../../shared/styles/styled';
import { initialWorkflowState } from '../../../../store/selectors';
import { StyledRevertSpreadsheet } from './StyledSpreadsheet';

const RevertChanges = ({ onRevert }) => {
  const { user: { timezone } } = useUser();
  const { workflowInfo } = useRecoilValue(initialWorkflowState);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleRevert = () => {
    onRevert();
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton
        primary
        variant="outlined"
        onClick={handleOpen}
        endIcon={<ExpandMore />}
      >
        Revert changes
      </StyledButton>

      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        sx={{
          top: 5,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <StyledRevertSpreadsheet p="8px 10px" onClick={handleRevert}>
          <StyledText weight={500} size={15} lh={20}>
            Revert to the Last Saved Version
          </StyledText>
          <StyledText weight={400} size={12} lh={15}>
            Saved on:
            {' '}
            {formatInTimeZone(workflowInfo?.updatedAt, timezone, 'LLLL d, yyyy - p')}
          </StyledText>
        </StyledRevertSpreadsheet>
      </Popover>
    </>
  );
};

export default RevertChanges;
