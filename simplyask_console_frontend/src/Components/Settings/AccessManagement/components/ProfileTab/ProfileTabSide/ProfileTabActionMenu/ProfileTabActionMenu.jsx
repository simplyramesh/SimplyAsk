import { Popover } from '@mui/material';
import PropTypes from 'prop-types';
import { memo } from 'react';

import AccessManagementIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { StyledProfileTabActionMenu } from '../../StyledProfileTab';

const ProfileTabActionMenu = ({
  anchorRef, open, onClose, onPassword, onActivate, isLocked,
}) => {
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      anchorEl={anchorRef.current || anchorRef}
    >
      <StyledProfileTabActionMenu>
        <StyledFlex
          direction="row"
          gap="6px"
          onClick={onPassword}
          mx="10px"
          p="4px 6px"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '4px',
            },
          }}
        >
          <AccessManagementIcons icon="KEY" width={18} />
          <StyledText
            size={16}
            weight={500}
            cursor={onPassword ? 'pointer' : 'default'}
          >
            Change Password
          </StyledText>
        </StyledFlex>
        <StyledFlex
          direction="row"
          gap="6px"
          mx="10px"
          p="4px 6px"
          onClick={onActivate}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '4px',
            },
          }}
        >
          <AccessManagementIcons icon={`${isLocked ? 'ACTIVATED' : 'DEACTIVATED'}`} width={18} />
          <StyledText
            size={16}
            weight={500}
            cursor={onActivate ? 'pointer' : 'default'}
          >
            {`${isLocked ? 'Activate' : 'Deactivate'} Account`}
          </StyledText>
        </StyledFlex>
      </StyledProfileTabActionMenu>
    </Popover>
  );
};

export default memo(ProfileTabActionMenu);

ProfileTabActionMenu.propTypes = {
  anchorRef: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onPassword: PropTypes.func,
  onActivate: PropTypes.func,
  isLocked: PropTypes.bool,
};
