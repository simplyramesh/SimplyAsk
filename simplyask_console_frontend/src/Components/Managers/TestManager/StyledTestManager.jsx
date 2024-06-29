import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { StyledFlex } from '../../shared/styles/styled';

export const CreateTestDataMenuItem = styled(StyledFlex)((props) => ({
  '&:hover': {
    backgroundColor: props.theme.colors.passwordStrengthUndefined,
  },
}));

export const LinkedTestsBox = styled(Box)(({ theme }) => ({
  maxHeight: 225,
  overflow: 'auto',
  border: '2px solid #ccc',
  borderRadius: '10px',
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: theme.colors.tableScrollThumb,
    border: `4px solid ${theme.colors.tableScrollBg}`,
  },
  '&::-webkit-scrollbar': {
    backgroundColor: theme.colors.tableScrollBg,
    width: '14px',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.colors.tableScrollBg,
    borderRadius: '10px',
  },
}));
