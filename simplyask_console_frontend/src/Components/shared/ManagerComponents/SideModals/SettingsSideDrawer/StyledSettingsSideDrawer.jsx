import styled from '@emotion/styled';

import { PROCESS_HISTORY_STATUS_COLOR_MAP } from '../../../../Managers/ProcessManager/constants/statusConstants';
import { StyledButton } from '../../../REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../styles/styled';

export const StyledSettingsMenuItem = styled(StyledFlex)`
  cursor: pointer;
  justify-content: space-between;
  flex-direction: row;
  transition: background-color .2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.galleryGray}
  }
`;

export const StyledMenuButton = styled(StyledFlex)`
  flex-direction: row;
  align-items: center;
  padding: 20px 30px;
  gap: 16px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.galleryGray};
  }
`;

export const StyledCurrentProcessStatus = styled(StyledButton)(({ theme, status, variant }) => ({
  ...(variant === 'contained' && {
    justifyContent: 'flex-start',
    padding: '9px 14px',
    cursor: 'pointer',
    backgroundColor: theme.statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status]]?.bg,
    borderColor: theme.statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status]]?.bg,
    borderRadius: '10px',
    color: theme.colors.primary,
    transition: 'opacity 200ms',

    '& .MuiButton-startIcon': {
      color: theme.statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status]]?.color,
    },

    '& .MuiButton-endIcon > *:nth-of-type(1)': {
      fontSize: '33px',
    },

    '& .MuiStack-root': {
      flex: '1 1 auto',
    },

    '&:hover': {
      backgroundColor: theme.statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status]]?.bg,
      opacity: 0.8,
      borderColor: theme.statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status]]?.bg,
      boxShadow: 'none',
    },
  }),
}));
