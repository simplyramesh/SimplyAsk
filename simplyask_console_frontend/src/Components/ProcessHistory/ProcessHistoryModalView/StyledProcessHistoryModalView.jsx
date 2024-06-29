import styled from '@emotion/styled';

import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';

export const StyledNewTabButton = styled(StyledButton)`
  & > span > svg > path {
    fill: ${({ theme }) => theme.colors.white};
  }

  &:hover > span > svg > path {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;
