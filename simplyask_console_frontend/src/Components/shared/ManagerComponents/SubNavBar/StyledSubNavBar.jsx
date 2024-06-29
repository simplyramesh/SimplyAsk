import styled from '@emotion/styled';
import { Button } from '@mui/material';

import { StyledLoadingButton } from '../../REDISIGNED/controls/Button/StyledButton';

export const StyledImportButton = styled(StyledLoadingButton)`
  height: 38px;
  width: 75px;
  gap: 9px;
  margin-top: ${({ mt }) => mt || 0};

  &>span {
    margin: 0;
  }

  &>span:not(:first-of-type) {
    margin-right: -4px;
  }
`;

export const StyledPopoverActionsBtn = styled(Button)`
  padding: 0;
  min-width: 25px;

  &:hover {
    background-color: ${({ theme }) => (theme.colors.altoGray)};
  }
`;
